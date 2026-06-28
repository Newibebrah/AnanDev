"use client";

import { useActionState, useEffect, type ReactNode } from "react";
import type { ActionResult } from "@/app/lib/form-types";

interface InlineActionProps {
  action: (formData: FormData) => Promise<ActionResult>;
  children: ReactNode;
  className?: string;
}

export function InlineAction({ action, children, className }: InlineActionProps) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => action(formData),
    null
  );

  useEffect(() => {
    if (state?.success) {
      window.location.reload();
    }
  }, [state]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); formAction(new FormData(e.currentTarget)); }} className={className}>
      {state?.message && !state.success && (
        <p className="text-red-500 text-xs mb-1">{state.message}</p>
      )}
      {children}
    </form>
  );
}
