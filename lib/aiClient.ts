// lib/aiClient.ts

import {
  AiVentureReport,
  VentureInput,
} from "./reportSchema";
import type { VentureInsights } from "./insightSchema";
import type { VentureScoringResult } from "./scoringEngine";
import { buildVentureAnalysisPrompt } from "./prompts";
import { recoverAiVentureReport } from "./reportRecovery";

/**
 * GeminiResponse describes the portion of Gemini's API response
 * that EmpresaFi needs to inspect.
 */
type GeminiResponse = {
  candidates?: Array<{
    finishReason?: string;

    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;

  promptFeedback?: {
    blockReason?: string;
  };

  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

/**
 * GeminiAttemptResult contains the HTTP response
 * and its parsed Gemini response body.
 */
type GeminiAttemptResult = {
  response: Response;
  responseBody: GeminiResponse;
};

/**
 * GeminiProviderError preserves the HTTP status returned by Gemini.
 *
 * Keeping the status allows EmpresaFi to distinguish retryable
 * provider failures from permanent request or configuration errors.
 */
class GeminiProviderError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = "GeminiProviderError";
    this.status = status;
  }
}

/**
 * Gemini structured-output schema for the core venture report.
 *
 * The Insight Engine and deterministic scoring engine run separately.
 * Their validated outputs are inserted into the prompt as context,
 * while this schema controls the final report structure.
 */
const ventureReportJsonSchema = {
  type: "object",

  properties: {
    ventureName: {
      type: "string",
    },

    ventureScore: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },

    marketOpportunityScore: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },

    investorReadinessScore: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },

    riskLevel: {
      type: "string",
      enum: ["Low", "Medium", "High"],
    },

    revenuePotential: {
      type: "string",
      enum: ["Low", "Medium", "High"],
    },

    startupCostEstimate: {
      type: "string",
    },

    executiveSummary: {
      type: "string",
    },

    marketAnalysis: {
      type: "string",
    },

    competitorAnalysis: {
      type: "string",
    },

    businessModel: {
      type: "string",
    },

    pricingStrategy: {
      type: "string",
    },

    financialProjection: {
      type: "string",
    },

    keyRisks: {
      type: "array",
      minItems: 3,
      maxItems: 7,

      items: {
        type: "string",
      },
    },

    growthStrategy: {
      type: "string",
    },

    roadmap: {
      type: "array",
      minItems: 3,
      maxItems: 3,

      items: {
        type: "object",

        properties: {
          period: {
            type: "string",
            enum: ["30 Days", "90 Days", "365 Days"],
          },

          title: {
            type: "string",
          },

          actions: {
            type: "array",
            minItems: 3,
            maxItems: 6,

            items: {
              type: "string",
            },
          },
        },

        required: ["period", "title", "actions"],
      },
    },

    investorBrief: {
      type: "string",
    },
  },

  required: [
    "ventureName",
    "ventureScore",
    "marketOpportunityScore",
    "investorReadinessScore",
    "riskLevel",
    "revenuePotential",
    "startupCostEstimate",
    "executiveSummary",
    "marketAnalysis",
    "competitorAnalysis",
    "businessModel",
    "pricingStrategy",
    "financialProjection",
    "keyRisks",
    "growthStrategy",
    "roadmap",
    "investorBrief",
  ],
};

/**
 * Pauses execution between retry attempts.
 */
function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/**
 * Returns true when a provider failure is likely temporary.
 *
 * EmpresaFi retries timeouts, rate limits, server-capacity errors,
 * and gateway errors. Permanent errors such as invalid API keys,
 * unsupported models, or malformed payloads are not retried.
 */
function isRetryableStatus(status: number): boolean {
  return [408, 429, 500, 502, 503, 504].includes(status);
}

/**
 * Extracts the clearest available provider error message.
 */
function getProviderErrorMessage(
  responseBody: GeminiResponse,
  status: number
): string {
  return (
    responseBody.error?.message ||
    responseBody.error?.status ||
    `Gemini request failed with status ${status}.`
  );
}

/**
 * Reads and combines all text parts returned by Gemini.
 */
function extractGeminiText(response: GeminiResponse): string {
  const text = response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (text) {
    return text;
  }

  const blockReason = response.promptFeedback?.blockReason;
  const finishReason = response.candidates?.[0]?.finishReason;

  if (blockReason) {
    throw new Error(
      `Gemini blocked the request: ${blockReason}.`
    );
  }

  if (finishReason) {
    throw new Error(
      `Gemini returned no report. Finish reason: ${finishReason}.`
    );
  }

  throw new Error(
    response.error?.message ||
      "Gemini returned an empty response."
  );
}

/**
 * Removes Markdown fences if Gemini unexpectedly wraps
 * the structured JSON response inside a code block.
 */
function cleanJsonText(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

/**
 * Safely parses Gemini's raw HTTP response.
 *
 * Gemini normally returns JSON for both successful requests and API
 * errors. This helper produces clearer messages for empty or
 * non-JSON responses.
 */
async function parseGeminiResponse(
  response: Response
): Promise<GeminiResponse> {
  const rawResponse = await response.text();

  if (!rawResponse.trim()) {
    throw new GeminiProviderError(
      `Gemini returned an empty HTTP response with status ${response.status}.`,
      response.status
    );
  }

  try {
    return JSON.parse(rawResponse) as GeminiResponse;
  } catch {
    throw new GeminiProviderError(
      `Gemini returned a non-JSON response with status ${response.status}.`,
      response.status
    );
  }
}

/**
 * Sends one report-generation request to a specific Gemini model.
 *
 * Each attempt receives its own AbortController so one timeout does
 * not accidentally cancel later retries or the backup-model request.
 */
async function sendGeminiRequest({
  apiKey,
  model,
  prompt,
  requestId,
  attempt,
  timeoutMs,
}: {
  apiKey: string;
  model: string;
  prompt: string;
  requestId: string;
  attempt: number;
  timeoutMs: number;
}): Promise<GeminiAttemptResult> {
  const controller = new AbortController();
  const attemptStartedAt = Date.now();

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  console.log(
    `[Gemini ${requestId}] Model ${model}, attempt ${attempt} started.`
  );

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          // Keep the API key out of the URL and normal request logs.
          "x-goog-api-key": apiKey,
        },

        signal: controller.signal,

        // AI reports must never be reused through the Next.js fetch cache.
        cache: "no-store",

        body: JSON.stringify({
          contents: [
            {
              role: "user",

              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],

          generationConfig: {
            /**
             * A low temperature improves repeatability while still
             * allowing enough flexibility for natural report writing.
             */
            temperature: 0.1,

            /**
             * Provides enough room for the complete structured report
             * while keeping the live analysis reasonably fast.
             */
            maxOutputTokens: 3072,

            responseMimeType: "application/json",
            responseSchema: ventureReportJsonSchema,
          },
        }),
      }
    );

    const elapsedMs = Date.now() - attemptStartedAt;

    console.log(
      `[Gemini ${requestId}] Model ${model}, attempt ${attempt} returned status ${response.status} in ${elapsedMs}ms.`
    );

    const responseBody = await parseGeminiResponse(response);

    return {
      response,
      responseBody,
    };
  } catch (error) {
    const elapsedMs = Date.now() - attemptStartedAt;

    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new GeminiProviderError(
        `Gemini model "${model}" timed out after ${elapsedMs}ms.`,
        408
      );
    }

    if (error instanceof GeminiProviderError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new GeminiProviderError(
        `Network request failed while contacting Gemini model "${model}": ${error.message}`,
        503
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Calls one Gemini model using controlled retries.
 *
 * Temporary failures use exponential backoff with a small amount of
 * random jitter. Permanent provider errors stop immediately.
 */
async function generateWithModel({
  apiKey,
  model,
  prompt,
  requestId,
  maxAttempts,
  timeoutMs,
}: {
  apiKey: string;
  model: string;
  prompt: string;
  requestId: string;
  maxAttempts: number;
  timeoutMs: number;
}): Promise<GeminiResponse> {
  let lastError: Error | null = null;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {
    try {
      const { response, responseBody } =
        await sendGeminiRequest({
          apiKey,
          model,
          prompt,
          requestId,
          attempt,
          timeoutMs,
        });

      if (response.ok) {
        return responseBody;
      }

      const providerMessage = getProviderErrorMessage(
        responseBody,
        response.status
      );

      const providerError = new GeminiProviderError(
        providerMessage,
        response.status
      );

      lastError = providerError;

      const canRetry =
        isRetryableStatus(response.status) &&
        attempt < maxAttempts;

      if (!canRetry) {
        throw providerError;
      }

      /**
       * Exponential delay:
       * attempt 1 -> about 2 seconds
       * attempt 2 -> about 4 seconds
       */
      const baseDelay =
        2_000 * 2 ** (attempt - 1);

      const jitter =
        Math.floor(Math.random() * 500);

      const retryDelay =
        baseDelay + jitter;

      console.warn(
        `[Gemini ${requestId}] Temporary error from ${model}: ${providerMessage}`
      );

      console.warn(
        `[Gemini ${requestId}] Retrying ${model} in ${retryDelay}ms.`
      );

      await sleep(retryDelay);
    } catch (error) {
      const normalizedError =
        error instanceof Error
          ? error
          : new Error(
              "Unknown Gemini provider error."
            );

      lastError = normalizedError;

      if (
        error instanceof GeminiProviderError &&
        isRetryableStatus(error.status) &&
        attempt < maxAttempts
      ) {
        const baseDelay =
          2_000 * 2 ** (attempt - 1);

        const jitter =
          Math.floor(Math.random() * 500);

        const retryDelay =
          baseDelay + jitter;

        console.warn(
          `[Gemini ${requestId}] ${error.message} Retrying in ${retryDelay}ms.`
        );

        await sleep(retryDelay);
        continue;
      }

      throw normalizedError;
    }
  }

  throw (
    lastError ||
    new Error(`Gemini model "${model}" failed.`)
  );
}

/**
 * Parses Gemini's structured JSON report and performs
 * field-level recovery.
 *
 * Valid AI-generated sections are preserved. Only missing or invalid
 * fields are replaced with EmpresaFi's reliable local fallback values.
 */
function recoverGeneratedReport({
  responseBody,
  requestId,
  model,
  input,
}: {
  responseBody: GeminiResponse;
  requestId: string;
  model: string;
  input: VentureInput;
}): AiVentureReport {
  const rawText =
    extractGeminiText(responseBody);

  const cleanedText =
    cleanJsonText(rawText);

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(cleanedText);
  } catch {
    console.error(
      `[Gemini ${requestId}] Model ${model} returned malformed JSON:`,
      cleanedText.slice(0, 500)
    );

    /**
     * Field-level recovery requires valid JSON.
     *
     * Malformed JSON is allowed to fail here so the main Venture
     * Intelligence Engine can use the complete local report fallback.
     */
    throw new Error(
      `Gemini model "${model}" returned malformed JSON.`
    );
  }

  const recoveryResult =
    recoverAiVentureReport(
      parsedJson,
      input
    );

  if (
    recoveryResult.recoveredFields.length > 0
  ) {
    console.warn(
      `[Gemini ${requestId}] Recovered ${
        recoveryResult.recoveredFields.length
      } report field(s) from local fallback: ${recoveryResult.recoveredFields.join(
        ", "
      )}.`
    );
  }

  console.log(
    `[Gemini ${requestId}] Preserved ${
      recoveryResult.aiGeneratedFields.length
    } AI-generated report field(s).`
  );

  if (
    recoveryResult.recoveredFields.length === 0
  ) {
    console.log(
      `[Gemini ${requestId}] All report fields passed section-level validation.`
    );
  }

  return recoveryResult.report;
}

/**
 * Generates a structured EmpresaFi venture report.
 *
 * The insights argument contains strategic competitors, market signals,
 * and industry intelligence created by the EmpresaFi Insight Engine.
 *
 * The scoring argument contains EmpresaFi's deterministic scoring
 * result. Gemini explains those scores, but it does not control the
 * final scores displayed in the product.
 *
 * Workflow:
 * 1. Build a prompt from founder input, strategic insights, and scores.
 * 2. Try the primary low-latency Gemini model.
 * 3. Retry temporary provider errors once.
 * 4. Switch to the configured backup model if necessary.
 * 5. Parse the structured JSON response.
 * 6. Preserve every valid AI-generated report field.
 * 7. Recover only missing or invalid fields from the local fallback.
 * 8. Throw only when every provider route fails or JSON is malformed.
 *
 * The main Venture Intelligence Engine catches the final error and
 * returns EmpresaFi's complete local report fallback.
 */
export async function generateAiVentureReport(
  input: VentureInput,
  insights?: VentureInsights,
  scoring?: VentureScoringResult
): Promise<AiVentureReport> {
  const apiKey =
    process.env.GEMINI_API_KEY?.trim();

  const primaryModel =
    process.env.GEMINI_MODEL?.trim() ||
    "gemini-3.1-flash-lite";

  const fallbackModel =
    process.env.GEMINI_FALLBACK_MODEL?.trim() ||
    "gemini-3.5-flash";

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured."
    );
  }

  /**
   * The prompt includes:
   * - founder input
   * - strategic Insight Engine context
   * - deterministic EmpresaFi scoring
   */
  const prompt = buildVentureAnalysisPrompt(
    input,
    insights,
    scoring
  );

  const requestId =
    crypto.randomUUID().slice(0, 8);

  const requestStartedAt =
    Date.now();

  console.log(
    `[Gemini ${requestId}] Starting EmpresaFi report generation. Primary model: ${primaryModel}. Insight mode: ${
      insights?.researchMode ?? "unavailable"
    }. Scoring version: ${
      scoring?.scoringVersion ?? "unavailable"
    }.`
  );

  try {
    const primaryResponse =
      await generateWithModel({
        apiKey,
        model: primaryModel,
        prompt,
        requestId,

        // One initial request and one retry for temporary failures.
        maxAttempts: 2,

        // Timeout applies independently to every provider attempt.
        timeoutMs: 60_000,
      });

    const report = recoverGeneratedReport({
      responseBody: primaryResponse,
      requestId,
      model: primaryModel,
      input,
    });

    console.log(
      `[Gemini ${requestId}] EmpresaFi report generated successfully with ${primaryModel} in ${
        Date.now() - requestStartedAt
      }ms.`
    );

    return report;
  } catch (primaryError) {
    const primaryMessage =
      primaryError instanceof Error
        ? primaryError.message
        : "Unknown primary-model error.";

    console.warn(
      `[Gemini ${requestId}] Primary model ${primaryModel} failed: ${primaryMessage}`
    );

    /**
     * Avoid making an identical second call when both model variables
     * accidentally contain the same model ID.
     */
    if (fallbackModel === primaryModel) {
      throw primaryError;
    }
  }

  console.warn(
    `[Gemini ${requestId}] Switching report generation to backup model: ${fallbackModel}.`
  );

  try {
    const fallbackResponse =
      await generateWithModel({
        apiKey,
        model: fallbackModel,
        prompt,
        requestId,

        /**
         * One backup attempt prevents excessively long live-demo waits.
         */
        maxAttempts: 1,
        timeoutMs: 60_000,
      });

    const report = recoverGeneratedReport({
      responseBody: fallbackResponse,
      requestId,
      model: fallbackModel,
      input,
    });

    console.log(
      `[Gemini ${requestId}] EmpresaFi report generated successfully with backup model ${fallbackModel} in ${
        Date.now() - requestStartedAt
      }ms.`
    );

    return report;
  } catch (fallbackError) {
    const fallbackMessage =
      fallbackError instanceof Error
        ? fallbackError.message
        : "Unknown backup-model error.";

    throw new Error(
      `Gemini report generation failed. Primary model "${primaryModel}" and backup model "${fallbackModel}" were unavailable. Last error: ${fallbackMessage}`
    );
  }
}