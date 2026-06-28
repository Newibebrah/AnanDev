"use client";

export function clientLogError(error: Error, context?: Record<string, unknown>) {
  console.error("[CLIENT ERROR]", error.message, context);

  const formData = new FormData();
  formData.set("message", error.message);
  formData.set("stack", error.stack || "");
  formData.set("url", window.location.href);
  formData.set("action", context?.action as string || "");

  fetch("/api/log/error", {
    method: "POST",
    body: formData,
  }).catch(() => {
    // Silently fail if the report can't be sent
  });
}

export function clientLogWarning(message: string, context?: Record<string, unknown>) {
  console.warn("[CLIENT WARN]", message, context);
}
