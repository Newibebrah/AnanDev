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
    logger.error("Failed to fetch messages", {
      action: "getMessages",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to fetch messages");
  }
}

export async function submitMessage(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = messageSchema.parse({
    name: raw.name,
    email: raw.email,
    content: raw.content,
  });

  try {
    await prisma.message.create({ data: parsed });
  } catch (error) {
    logger.error("Failed to submit message", {
      action: "submitMessage",
      context: { name: parsed.name, email: parsed.email },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to send message");
  }

  revalidatePath("/admin/messages");
}

export async function markMessageRead(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });
  } catch (error) {
    logger.error("Failed to mark message as read", {
      action: "markMessageRead",
      userId: session.user.id as string,
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to mark message as read");
  }

  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.message.delete({ where: { id } });
  } catch (error) {
    logger.error("Failed to delete message", {
      action: "deleteMessage",
      userId: session.user.id as string,
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to delete message");
  }

  revalidatePath("/admin/messages");
}
