// lib/prisma.ts

import { PrismaClient } from "@prisma/client";

/**
 * globalForPrisma prevents creating too many Prisma clients
 * during development hot reloads in Next.js.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * prisma is the shared database client used across API routes
 * and server components.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}