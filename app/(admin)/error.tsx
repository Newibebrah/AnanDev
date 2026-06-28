"use client";

import { useEffect } from "react";
import { clientLogError } from "@/app/lib/client-logger";
import { Button } from "@/app/components/ui/button";

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    clientLogError(error, { action: "admin-error-boundary" });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Admin Error</h1>
      <p className="text-muted-foreground mb-8">
        Something went wrong in the admin panel.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/admin/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
