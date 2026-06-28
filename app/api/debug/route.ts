import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, unknown> = {
    env: {
      PRISMA_DATABASE_URL_SET: !!process.env.PRISMA_DATABASE_URL,
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
      POSTGRES_URL_SET: !!process.env.POSTGRES_URL,
      NODE_ENV: process.env.NODE_ENV,
    },
  };

  try {
    await prisma.$connect();

    const tables = await prisma.$queryRawUnsafe<{tablename: string}[]>(
      "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'"
    );
    checks.connected = true;
    checks.tables = tables.map((t) => t.tablename);
  } catch (error) {
    checks.connected = false;
    checks.error = error instanceof Error ? error.message : String(error);
  }

  // Test direct write to ErrorLog
  try {
    const written = await prisma.errorLog.create({
      data: {
        level: "debug",
        message: "Debug test from /api/debug",
        action: "debug-endpoint",
        context: JSON.stringify({ test: true, timestamp: new Date().toISOString() }),
      },
    });
    checks.writeTest = `✅ Written: ${written.id}`;
  } catch (error) {
    checks.writeTest = "❌ Failed";
    checks.writeError = error instanceof Error ? error.message : String(error);
  }

  return Response.json(checks);
}
