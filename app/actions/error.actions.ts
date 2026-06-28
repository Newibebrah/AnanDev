"use server";

import { logger } from "@/app/lib/logger";
import { auth } from "@/app/lib/auth";

export async function reportClientError(formData: FormData) {
  const session = await auth();

  const message = formData.get("message") as string;
  const stack = formData.get("stack") as string;
  const url = formData.get("url") as string;
  const action = formData.get("action") as string;

  if (!message) return;

  await logger.error(message, {
    action: action || "client-error",
    userId: session?.user?.id as string | undefined,
    url: url || undefined,
    stack: stack || undefined,
  });
}
