"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { messageSchema } from "@/app/lib/validations";
import { auth } from "@/app/lib/auth";
import { logger } from "@/app/lib/logger";

export async function getMessages() {
  try {
    return await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    await logger.error("Failed to fetch messages", {
      action: "getMessages",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to fetch messages");
  }
}

export async function submitMessage(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData);
    const parsed = messageSchema.safeParse({
      name: raw.name,
      email: raw.email,
      content: raw.content,
    });

    if (!parsed.success) {
      await logger.error("Message validation failed", {
        action: "submitMessage",
        context: { errors: parsed.error.issues },
      });
      throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
    }

    await prisma.message.create({ data: parsed.data });

    revalidatePath("/admin/messages");
  } catch (error) {
    await logAndRethrow("submitMessage", error);
  }
}

export async function markMessageRead(id: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });

    revalidatePath("/admin/messages");
  } catch (error) {
    await logAndRethrow("markMessageRead", error, { userId: (await auth())?.user?.id, context: { id } });
  }
}

export async function deleteMessage(id: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    await prisma.message.delete({ where: { id } });

    revalidatePath("/admin/messages");
  } catch (error) {
    await logAndRethrow("deleteMessage", error, { userId: (await auth())?.user?.id, context: { id } });
  }
}

async function logAndRethrow(action: string, error: unknown, extra?: { userId?: unknown; context?: Record<string, unknown> }) {
  const isRedirectError = error instanceof Error && error.message.includes("NEXT_REDIRECT");
  if (isRedirectError) throw error;

  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  await logger.error(message, {
    action,
    userId: extra?.userId as string | undefined,
    context: extra?.context,
    stack,
  });

  throw typeof error === "object" && error !== null && "message" in error ? error : new Error("An unexpected error occurred");
}
