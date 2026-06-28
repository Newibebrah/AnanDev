"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { commentSchema } from "@/app/lib/validations";
import { auth } from "@/app/lib/auth";
import { logger } from "@/app/lib/logger";

export async function getComments() {
  try {
    return await prisma.comment.findMany({
      include: { post: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    logger.error("Failed to fetch comments", {
      action: "getComments",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to fetch comments");
  }
}

export async function createComment(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData);
    const parsed = commentSchema.safeParse({
      name: raw.name,
      email: raw.email || "",
      content: raw.content,
    });

    if (!parsed.success) {
      logger.error("Comment validation failed", {
        action: "createComment",
        context: { errors: parsed.error.issues },
      });
      throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
    }

    await prisma.comment.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email || null,
        content: parsed.data.content,
        postId: raw.postId as string,
        parentId: (raw.parentId as string) || null,
      },
    });

    revalidatePath("/blog");
  } catch (error) {
    logAndRethrow("createComment", error);
  }
}

export async function approveComment(id: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    await prisma.comment.update({
      where: { id },
      data: { isApproved: true },
    });

    revalidatePath("/admin/comments");
  } catch (error) {
    logAndRethrow("approveComment", error, { userId: (await auth())?.user?.id, context: { id } });
  }
}

export async function rejectComment(id: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    await prisma.comment.update({
      where: { id },
      data: { isApproved: false },
    });

    revalidatePath("/admin/comments");
  } catch (error) {
    logAndRethrow("rejectComment", error, { userId: (await auth())?.user?.id, context: { id } });
  }
}

export async function deleteComment(id: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    await prisma.comment.delete({ where: { id } });

    revalidatePath("/admin/comments");
  } catch (error) {
    logAndRethrow("deleteComment", error, { userId: (await auth())?.user?.id, context: { id } });
  }
}

function logAndRethrow(action: string, error: unknown, extra?: { userId?: unknown; context?: Record<string, unknown> }) {
  const isRedirectError = error instanceof Error && error.message.includes("NEXT_REDIRECT");
  if (isRedirectError) throw error;

  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  logger.error(message, {
    action,
    userId: extra?.userId as string | undefined,
    context: extra?.context,
    stack,
  });

  throw typeof error === "object" && error !== null && "message" in error ? error : new Error("An unexpected error occurred");
}
