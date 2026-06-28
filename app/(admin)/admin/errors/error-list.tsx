"use client";

import { useState } from "react";

type ErrorLog = {
  id: string;
  level: string;
  message: string;
  context: string | null;
  stack: string | null;
  action: string | null;
  userId: string | null;
  url: string | null;
  createdAt: Date;
};

export function ErrorLogList({ logs }: { logs: ErrorLog[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No error logs found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const isExpanded = expandedId === log.id;
        return (
          <div
            key={log.id}
            className={`border rounded-lg overflow-hidden ${
              log.level === "error"
                ? "border-red-200 dark:border-red-900"
                : log.level === "warn"
                  ? "border-yellow-200 dark:border-yellow-900"
                  : "border-border"
            }`}
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : log.id)}
              className="w-full flex items-start gap-3 p-4 text-left hover:bg-accent/50 transition-colors"
            >
              <span
                className={`mt-0.5 shrink-0 w-2 h-2 rounded-full ${
                  log.level === "error"
                    ? "bg-red-500"
                    : log.level === "warn"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                      log.level === "error"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : log.level === "warn"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {log.level.toUpperCase()}
                  </span>
                  {log.action && (
                    <span className="text-xs text-muted-foreground">
                      {log.action}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm font-mono break-words">{log.message}</p>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t px-4 py-3 space-y-3 bg-muted/30">
                {log.url && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">URL:</span>
                    <p className="text-xs font-mono mt-0.5">{log.url}</p>
                  </div>
                )}
                {log.userId && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">User ID:</span>
                    <p className="text-xs font-mono mt-0.5">{log.userId}</p>
                  </div>
                )}
                {log.context && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Context:</span>
                    <pre className="text-xs font-mono mt-0.5 bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(JSON.parse(log.context), null, 2)}
                    </pre>
                  </div>
                )}
                {log.stack && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Stack Trace:</span>
                    <pre className="text-xs font-mono mt-0.5 bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap">
                      {log.stack}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
