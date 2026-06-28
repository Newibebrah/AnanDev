"use client";

import { useEffect } from "react";
import { clientLogError } from "@/app/lib/client-logger";
import { Button } from "@/app/components/ui/button";

export default function RootErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    clientLogError(error, { action: "root-error-boundary" });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        An unexpected error occurred. Our team has been notified.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
