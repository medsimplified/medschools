// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

function normalizeDatabaseUrl(url?: string) {
  if (!url) return url;
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const isLocal = host === "localhost" || host === "127.0.0.1";

    // If remote DB and no SSL flags present, add ssl=true for node-postgres
    const hasSsl = u.searchParams.has("ssl") || u.searchParams.has("sslmode");
    if (!isLocal && !hasSsl) {
      u.searchParams.append("ssl", "true");
    }

    // Hint for connection pooling (optional, safe no-op if ignored)
    if (!u.searchParams.has("pgbouncer")) {
      u.searchParams.append("pgbouncer", "true");
    }
    if (!u.searchParams.has("connection_limit")) {
      u.searchParams.append("connection_limit", "5");
    }

    return u.toString();
  } catch {
    return url;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: normalizeDatabaseUrl(process.env.DATABASE_URL),
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
const cleanup = async () => {
  await prisma.$disconnect();
};

if (typeof window === "undefined") {
  process.on("beforeExit", cleanup);
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

export default prisma;
