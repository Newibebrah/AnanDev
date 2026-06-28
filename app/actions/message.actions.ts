"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { messageSchema } from "@/app/lib/validations";
import { auth } from "@/app/lib/auth";
import { logger } from "@/app/lib/logger";

import type { ActionResult } from "@/app/lib/form-types";

export async function getMessages() {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    return await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    await logger.error("Failed to fetch messages", {
      action: "getMessages",
      stack: error instanceof Error ? error.stack : undefined,
    });
    if (error instanceof Error && error.message === "Unauthorized") throw error;
    throw new Error("Failed to fetch messages");
  }
}

export async function submitMessage(formData: FormData): Promise<ActionResult> {
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
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        message: "Validation failed",
      };
    }

    await prisma.message.create({ data: parsed.data });

    revalidatePath("/admin/messages");
    return { success: true, errors: null, message: "Message sent successfully" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "submitMessage",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}

export async function markMessageRead(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });

    revalidatePath("/admin/messages");
    return { success: true, errors: null, message: "Message marked as read" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "markMessageRead",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    await prisma.message.delete({ where: { id } });

    revalidatePath("/admin/messages");
    return { success: true, errors: null, message: "Message deleted" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "deleteMessage",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}

export async function deleteAllMessages(_formData?: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    const { count } = await prisma.message.deleteMany();

    revalidatePath("/admin/messages");
    return { success: true, errors: null, message: `${count} messages deleted` };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "deleteAllMessages",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}
