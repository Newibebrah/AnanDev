"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { logger } from "@/app/lib/logger";

import type { ActionResult } from "@/app/lib/form-types";

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

export async function deleteAllErrorLogs(_formData?: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    const { count } = await prisma.errorLog.deleteMany();

    revalidatePath("/admin/errors");
    return { success: true, errors: null, message: `${count} error logs deleted` };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "deleteAllErrorLogs",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}
