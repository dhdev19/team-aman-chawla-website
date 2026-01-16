import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
  adapter: PrismaPg | undefined;
};

/**
 * Prisma Client Singleton
 * Prevents multiple instances of Prisma Client in development
 * Handles connection pooling and error handling
 */
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool;
}

const adapter =
  globalForPrisma.adapter ?? new PrismaPg(pool);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.adapter = adapter;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
