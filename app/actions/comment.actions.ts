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
  const raw = Object.fromEntries(formData);
  const parsed = commentSchema.parse({
    name: raw.name,
    email: raw.email || "",
    content: raw.content,
  });

  try {
    await prisma.comment.create({
      data: {
        name: parsed.name,
        email: parsed.email || null,
        content: parsed.content,
        postId: raw.postId as string,
        parentId: (raw.parentId as string) || null,
      },
    });
  } catch (error) {
    logger.error("Failed to create comment", {
      action: "createComment",
      context: { postId: raw.postId },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to submit comment");
  }

  revalidatePath("/blog");
}

export async function approveComment(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.comment.update({
      where: { id },
      data: { isApproved: true },
    });
  } catch (error) {
    logger.error("Failed to approve comment", {
      action: "approveComment",
      userId: session.user.id as string,
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to approve comment");
  }

  revalidatePath("/admin/comments");
}

export async function rejectComment(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.comment.update({
      where: { id },
      data: { isApproved: false },
    });
  } catch (error) {
    logger.error("Failed to reject comment", {
      action: "rejectComment",
      userId: session.user.id as string,
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to reject comment");
  }

  revalidatePath("/admin/comments");
}

export async function deleteComment(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.comment.delete({ where: { id } });
  } catch (error) {
    logger.error("Failed to delete comment", {
      action: "deleteComment",
      userId: session.user.id as string,
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to delete comment");
  }

  revalidatePath("/admin/comments");
}
