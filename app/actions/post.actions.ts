"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { postSchema } from "@/app/lib/validations";
import { auth } from "@/app/lib/auth";
import { logger } from "@/app/lib/logger";
import { slugify } from "@/app/lib/utils";

export async function getPosts() {
  try {
    return await prisma.post.findMany({
      include: { author: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    logger.error("Failed to fetch posts", {
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
    logger.error("Failed to fetch published posts", {
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
    logger.error("Failed to fetch post by slug", {
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
    logger.error("Failed to fetch post by id", {
      action: "getPostById",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to fetch post");
  }
}

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData);
  const published = raw.status === "PUBLISHED" || raw.status === "on";

  const slug = (raw.slug as string)?.trim() || slugify(raw.title as string);

  const parsed = postSchema.safeParse({
    title: raw.title,
    slug,
    excerpt: raw.excerpt || undefined,
    content: raw.content,
    coverImage: raw.coverImage || "",
    status: published ? "PUBLISHED" : "DRAFT",
    publishedAt: published ? new Date().toISOString() : undefined,
  });

  if (!parsed.success) {
    logger.error("Post validation failed", {
      action: "createPost",
      userId: session.user.id as string,
      context: { errors: parsed.error.issues, raw: { title: raw.title, slug } },
    });
    throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  }

  const authorId = session.user.id as string;

  try {
    await prisma.post.create({
      data: {
        ...parsed.data,
        publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null,
        authorId,
      },
    });
  } catch (error) {
    logger.error("Failed to create post", {
      action: "createPost",
      userId: authorId,
      context: { title: parsed.data.title, slug: parsed.data.slug },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to create post");
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updatePost(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData);
  const published = raw.status === "PUBLISHED" || raw.status === "on";

  let existing;
  try {
    existing = await prisma.post.findUnique({ where: { id } });
  } catch (error) {
    logger.error("Failed to find post for update", {
      action: "updatePost",
      userId: session.user.id as string,
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to update post");
  }

  if (!existing) throw new Error("Not found");

  const slug = (raw.slug as string)?.trim() || existing.slug;

  const parsed = postSchema.safeParse({
    title: raw.title,
    slug,
    excerpt: raw.excerpt || undefined,
    content: raw.content,
    coverImage: raw.coverImage || "",
    status: published ? "PUBLISHED" : "DRAFT",
    publishedAt:
      published && !existing.publishedAt
        ? new Date().toISOString()
        : existing.publishedAt?.toISOString() || undefined,
  });

  if (!parsed.success) {
    logger.error("Post validation failed", {
      action: "updatePost",
      userId: session.user.id as string,
      context: { id, errors: parsed.error.issues, raw: { title: raw.title, slug } },
    });
    throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  }

  try {
    await prisma.post.update({
      where: { id },
      data: {
        ...parsed.data,
        publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null,
      },
    });
  } catch (error) {
    logger.error("Failed to update post", {
      action: "updatePost",
      userId: session.user.id as string,
      context: { id, title: parsed.data.title },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to update post");
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.post.delete({ where: { id } });
  } catch (error) {
    logger.error("Failed to delete post", {
      action: "deletePost",
      userId: session.user.id as string,
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to delete post");
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function togglePostStatus(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  let post;
  try {
    post = await prisma.post.findUnique({ where: { id } });
  } catch (error) {
    logger.error("Failed to find post for toggle", {
      action: "togglePostStatus",
      userId: session.user.id as string,
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to toggle post status");
  }

  if (!post) throw new Error("Not found");

  const newStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

  try {
    await prisma.post.update({
      where: { id },
      data: {
        status: newStatus,
        publishedAt: newStatus === "PUBLISHED" ? new Date() : null,
      },
    });
  } catch (error) {
    logger.error("Failed to toggle post status", {
      action: "togglePostStatus",
      userId: session.user.id as string,
      context: { id, newStatus },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to toggle post status");
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
