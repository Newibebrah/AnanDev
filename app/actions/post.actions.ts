"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { postSchema } from "@/app/lib/validations";
import { auth } from "@/app/lib/auth";
import { logger } from "@/app/lib/logger";
import { slugify } from "@/app/lib/utils";

import type { ActionResult } from "@/app/lib/form-types";

export async function getPosts() {
  try {
    return await prisma.post.findMany({
      include: { author: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    await logger.error("Failed to fetch posts", {
      action: "getPosts",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to fetch posts");
  }
}

export async function getPublishedPosts() {
  try {
    return await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    await logger.error("Failed to fetch published posts", {
      action: "getPublishedPosts",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to fetch posts");
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { username: true } },
        comments: {
          where: { isApproved: true, parentId: null },
          include: {
            replies: {
              where: { isApproved: true },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (error) {
    await logger.error("Failed to fetch post by slug", {
      action: "getPostBySlug",
      context: { slug },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to fetch post");
  }
}

export async function getPostById(id: string) {
  try {
    return await prisma.post.findUnique({ where: { id } });
  } catch (error) {
    await logger.error("Failed to fetch post by id", {
      action: "getPostById",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to fetch post");
  }
}

export async function createPost(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    const raw = Object.fromEntries(formData);
    const published = raw.status === "PUBLISHED" || raw.status === "on";

    const title = (raw.title as string) || "";
    const slug = (raw.slug as string)?.trim() || slugify(title);

    const parsed = postSchema.safeParse({
      title,
      slug,
      excerpt: (raw.excerpt as string) || undefined,
      content: (raw.content as string) || "",
      coverImage: (raw.coverImage as string) || "",
      status: published ? "PUBLISHED" : "DRAFT",
      publishedAt: published ? new Date().toISOString() : undefined,
    });

    if (!parsed.success) {
      await logger.error("Post validation failed", {
        action: "createPost",
        userId: session.user.id as string,
        context: { errors: parsed.error.issues, raw: { title, slug } },
      });
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        message: "Validation failed",
      };
    }

    const authorId = session.user.id as string;

    await prisma.post.create({
      data: {
        ...parsed.data,
        publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null,
        authorId,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true, errors: null, message: "Post created successfully" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "createPost",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}

export async function updatePost(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    const raw = Object.fromEntries(formData);
    const published = raw.status === "PUBLISHED" || raw.status === "on";

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) return { success: false, errors: null, message: "Not found" };

    const title = (raw.title as string) || "";
    const slug = (raw.slug as string)?.trim() || existing.slug;

    const parsed = postSchema.safeParse({
      title,
      slug,
      excerpt: (raw.excerpt as string) || undefined,
      content: (raw.content as string) || "",
      coverImage: (raw.coverImage as string) || "",
      status: published ? "PUBLISHED" : "DRAFT",
      publishedAt:
        published && !existing.publishedAt
          ? new Date().toISOString()
          : existing.publishedAt?.toISOString() || undefined,
    });

    if (!parsed.success) {
      await logger.error("Post validation failed", {
        action: "updatePost",
        userId: session.user.id as string,
        context: { id, errors: parsed.error.issues, raw: { title, slug } },
      });
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        message: "Validation failed",
      };
    }

    await prisma.post.update({
      where: { id },
      data: {
        ...parsed.data,
        publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true, errors: null, message: "Post updated successfully" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "updatePost",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    await prisma.post.delete({ where: { id } });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true, errors: null, message: "Post deleted" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "deletePost",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}

export async function togglePostStatus(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return { success: false, errors: null, message: "Not found" };

    const newStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    await prisma.post.update({
      where: { id },
      data: {
        status: newStatus,
        publishedAt: newStatus === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true, errors: null, message: `Post ${newStatus.toLowerCase()}` };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "togglePostStatus",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}
