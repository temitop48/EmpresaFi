// lib/insightEngine.ts

import { VentureInput } from "./reportSchema";
import {
  VentureInsights,
  ventureInsightsSchema,
} from "./insightSchema";
import { buildInsightResearchPrompt } from "./insightPrompts";
import { createFallbackInsights } from "./mockInsights";

type GeminiInsightResponse = {
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
    message?: string;
    status?: string;
  };
};

type RawInsightJson = {
  competitors?: unknown[];
  marketSignals?: unknown[];
  industryFacts?: unknown[];
  researchSummary?: string;
};

/**
 * Removes Markdown fences if Gemini unexpectedly wraps JSON
 * inside a code block.
 */
function cleanJsonText(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

/**
 * Extracts the generated strategic intelligence text.
 */
function extractResponseText(
  response: GeminiInsightResponse
): string {
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
      `Gemini blocked the insight request: ${blockReason}.`
    );
  }

  if (finishReason) {
    throw new Error(
      `Gemini returned no insight package. Finish reason: ${finishReason}.`
    );
  }

  throw new Error(
    response.error?.message ||
      "Gemini returned an empty insight response."
  );
}

/**
 * Parses Gemini's HTTP response safely.
 */
async function parseGeminiResponse(
  response: Response
): Promise<GeminiInsightResponse> {
  const rawResponse = await response.text();

  if (!rawResponse.trim()) {
    throw new Error(
      `Gemini returned an empty response with status ${response.status}.`
    );
  }

  try {
    return JSON.parse(rawResponse) as GeminiInsightResponse;
  } catch {
    throw new Error(
      `Gemini returned a non-JSON response with status ${response.status}.`
    );
  }
}

/**
 * Generates strategic market intelligence using Gemini reasoning.
 *
 * This submission-safe version does not depend on Google Search,
 * paid grounding, or external commercial-data APIs.
 */
async function generateStrategicInsights(
  input: VentureInput
): Promise<VentureInsights> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  const model =
    process.env.GEMINI_INSIGHT_MODEL?.trim() ||
    process.env.GEMINI_MODEL?.trim() ||
    "gemini-3.1-flash-lite";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const prompt = buildInsightResearchPrompt(input);
  const requestId = crypto.randomUUID().slice(0, 8);
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 45_000);

  console.log(
    `[EmpresaFi Insight ${requestId}] Starting strategic intelligence generation with ${model}.`
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
          "x-goog-api-key": apiKey,
        },

        signal: controller.signal,
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
            temperature: 0.3,
            maxOutputTokens: 2400,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const responseBody =
      await parseGeminiResponse(response);

    if (!response.ok) {
      throw new Error(
        responseBody.error?.message ||
          responseBody.error?.status ||
          `Insight generation failed with status ${response.status}.`
      );
    }

    const cleanedText = cleanJsonText(
      extractResponseText(responseBody)
    );

    let parsed: RawInsightJson;

    try {
      parsed = JSON.parse(cleanedText) as RawInsightJson;
    } catch {
      console.error(
        `[EmpresaFi Insight ${requestId}] Malformed insight JSON:`,
        cleanedText.slice(0, 500)
      );

      throw new Error(
        "Gemini returned malformed strategic insight JSON."
      );
    }

    const validation = ventureInsightsSchema.safeParse({
      ...parsed,

      // No external URLs are claimed in submission mode.
      sources: [],

      researchMode: "ai_estimate",
      researchedAt: new Date().toISOString(),
    });

    if (!validation.success) {
      console.error(
        `[EmpresaFi Insight ${requestId}] Insight validation failed:`,
        validation.error.flatten()
      );

      throw new Error(
        "Gemini returned an incomplete strategic insight package."
      );
    }

    console.log(
      `[EmpresaFi Insight ${requestId}] Strategic intelligence generated successfully.`
    );

    return validation.data;
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new Error(
        "Strategic intelligence generation timed out."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Public EmpresaFi Insight Engine entry point.
 *
 * It first generates AI strategic intelligence. If the model is
 * unavailable, EmpresaFi returns a transparent local fallback package.
 */
export async function generateVentureInsights(
  input: VentureInput
): Promise<VentureInsights> {
  try {
    return await generateStrategicInsights(input);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown insight-provider error.";

    console.warn(
      `[EmpresaFi Insight] Strategic intelligence generation failed. Using local fallback: ${message}`
    );

    return createFallbackInsights(input);
  }
}