import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { ErrorLogList } from "./error-list";

export const dynamic = "force-dynamic";

export default async function ErrorLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { level, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const pageSize = 20;

  const where = level && level !== "all" ? { level } : {};

  const [total, logs] = await Promise.all([
    prisma.errorLog.count({ where }),
    prisma.errorLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  const levels = ["all", "error", "warn", "info", "debug"];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Error Logs</h1>
        <p className="text-sm text-muted-foreground">{total} total entries</p>
      </div>

      <div className="flex gap-2 mb-6">
        {levels.map((l) => (
          <a
            key={l}
            href={`/admin/errors?level=${l}`}
            className={`px-3 py-1 rounded-md text-sm border transition-colors ${
              (level || "all") === l
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card hover:bg-accent"
            }`}
          >
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </a>
        ))}
      </div>

      <ErrorLogList logs={logs} />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {currentPage > 1 && (
            <a
              href={`/admin/errors?level=${level || "all"}&page=${currentPage - 1}`}
              className="px-3 py-1 rounded-md border bg-card hover:bg-accent text-sm"
            >
              Previous
            </a>
          )}
          <span className="px-3 py-1 text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <a
              href={`/admin/errors?level=${level || "all"}&page=${currentPage + 1}`}
              className="px-3 py-1 rounded-md border bg-card hover:bg-accent text-sm"
            >
              Next
            </a>
          )}
        </div>
      )}
    </div>
  );
}
