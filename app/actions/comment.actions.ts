"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { commentSchema } from "@/app/lib/validations";
import { auth } from "@/app/lib/auth";
import { logger } from "@/app/lib/logger";

import type { ActionResult } from "@/app/lib/form-types";

export async function getComments() {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    return await prisma.comment.findMany({
      include: { post: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    await logger.error("Failed to fetch comments", {
      action: "getComments",
      stack: error instanceof Error ? error.stack : undefined,
    });
    if (error instanceof Error && error.message === "Unauthorized") throw error;
    throw new Error("Failed to fetch comments");
  }
}

export async function createComment(formData: FormData): Promise<ActionResult> {
  try {
    const raw = Object.fromEntries(formData);
    const parsed = commentSchema.safeParse({
      name: raw.name,
      email: raw.email || "",
      content: raw.content,
    });

    if (!parsed.success) {
      await logger.error("Comment validation failed", {
        action: "createComment",
        context: { errors: parsed.error.issues },
      });
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        message: "Validation failed",
      };
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
    return { success: true, errors: null, message: "Comment submitted for review" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "createComment",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}

export async function approveComment(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    await prisma.comment.update({
      where: { id },
      data: { isApproved: true },
    });

    revalidatePath("/admin/comments");
    return { success: true, errors: null, message: "Comment approved" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "approveComment",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}

export async function rejectComment(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    await prisma.comment.update({
      where: { id },
      data: { isApproved: false },
    });

    revalidatePath("/admin/comments");
    return { success: true, errors: null, message: "Comment rejected" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "rejectComment",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}

export async function deleteComment(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    await prisma.comment.delete({ where: { id } });

    revalidatePath("/admin/comments");
    return { success: true, errors: null, message: "Comment deleted" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "deleteComment",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}

export async function deleteAllComments(_formData?: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    const { count } = await prisma.comment.deleteMany();

    revalidatePath("/admin/comments");
    return { success: true, errors: null, message: `${count} comments deleted` };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "deleteAllComments",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}
