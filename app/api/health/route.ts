// app/api/health/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/health
 *
 * Provides a lightweight service-health response for
 * deployment checks, ASP listing reviews, and monitoring.
 */
export async function GET() {
  const startedAt = Date.now();

  let databaseStatus: "connected" | "unavailable" = "connected";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    databaseStatus = "unavailable";

    console.error("EmpresaFi health check database error:", error);
  }

  const aiConfigured = Boolean(process.env.GEMINI_API_KEY);

  const overallStatus =
    databaseStatus === "connected" && aiConfigured
      ? "healthy"
      : "degraded";

  return NextResponse.json(
    {
      status: overallStatus,

      service: {
        name: "EmpresaFi",
        version: "1.0.0",
        type: "AI Venture Intelligence ASP",
      },

      checks: {
        api: "operational",
        database: databaseStatus,
        aiProvider: aiConfigured ? "configured" : "not_configured",
      },

      responseTimeMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    },
    {
      status: overallStatus === "healthy" ? 200 : 503,
    }
  );
}