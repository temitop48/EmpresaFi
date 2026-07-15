// lib/reportMetadata.ts

import type { VentureInsights } from "./insightSchema";

export type ReportMetadataInput = {
  createdAt: string | Date;
  generationDurationMs?: number;
  generationMode?: "ai" | "fallback";
  reportVersion?: string;
  modelName?: string;
  scoringVersion?: string;
  insightMode?: VentureInsights["researchMode"];
};

export type ReportMetadataResult = {
  generatedDate: string;
  generatedTime: string;
  generationDuration: string;
  reportVersion: string;
  modelName: string;
  scoringVersion: string;
  generationLabel: string;
  insightLabel: string;
};

/**
 * Formats the report creation date for executive presentation.
 */
function formatGeneratedDate(value: string | Date): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Formats the report creation time.
 */
function formatGeneratedTime(value: string | Date): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Converts milliseconds into a concise readable duration.
 */
function formatDuration(durationMs?: number): string {
  if (
    typeof durationMs !== "number" ||
    !Number.isFinite(durationMs) ||
    durationMs < 0
  ) {
    return "Not recorded";
  }

  if (durationMs < 1000) {
    return `${Math.round(durationMs)} ms`;
  }

  return `${(durationMs / 1000).toFixed(1)} sec`;
}

/**
 * Converts the internal report-generation mode into a readable label.
 */
function getGenerationLabel(
  mode?: "ai" | "fallback"
): string {
  return mode === "fallback"
    ? "Local Recovery"
    : "AI Generated";
}

/**
 * Converts the Insight Engine mode into user-facing language.
 */
function getInsightLabel(
  mode?: VentureInsights["researchMode"]
): string {
  if (mode === "live_search") {
    return "Live Market Intelligence";
  }

  if (mode === "fallback") {
    return "Strategic Fallback";
  }

  return "AI Strategic Intelligence";
}

/**
 * Builds the complete metadata package shown on the report cover.
 */
export function buildReportMetadata(
  input: ReportMetadataInput
): ReportMetadataResult {
  return {
    generatedDate: formatGeneratedDate(input.createdAt),
    generatedTime: formatGeneratedTime(input.createdAt),
    generationDuration: formatDuration(
      input.generationDurationMs
    ),
    reportVersion: input.reportVersion || "1.0",
    modelName:
      input.modelName || "Gemini AI",
    scoringVersion:
      input.scoringVersion || "1.0",
    generationLabel: getGenerationLabel(
      input.generationMode
    ),
    insightLabel: getInsightLabel(
      input.insightMode
    ),
  };
}