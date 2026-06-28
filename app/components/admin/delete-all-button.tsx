"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import type { ActionResult } from "@/app/lib/form-types";

interface DeleteAllButtonProps {
  action: (formData: FormData) => Promise<ActionResult>;
  label?: string;
}

export function DeleteAllButton({ action, label = "Delete All" }: DeleteAllButtonProps) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => action(formData),
    null
  );

  useEffect(() => {
    if (state?.success) {
      window.location.reload();
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirm("Yakin ingin menghapus semua data? Tindakan ini tidak bisa dibatalkan.")) return;
    formAction(new FormData(e.currentTarget));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" variant="destructive" size="sm">
        {label}
      </Button>
    </form>
  );
}
