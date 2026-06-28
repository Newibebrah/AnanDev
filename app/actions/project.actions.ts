"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { projectSchema } from "@/app/lib/validations";
import { auth } from "@/app/lib/auth";
import { logger } from "@/app/lib/logger";
import { slugify } from "@/app/lib/utils";

export async function getProjects() {
  try {
    return await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    logger.error("Failed to fetch projects", {
      action: "getProjects",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to fetch projects");
  }
}

export async function getPublishedProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    logger.error("Failed to fetch published projects", {
      action: "getPublishedProjects",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to fetch projects");
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    return await prisma.project.findUnique({ where: { slug } });
  } catch (error) {
    logger.error("Failed to fetch project by slug", {
      action: "getProjectBySlug",
      context: { slug },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to fetch project");
  }
}

export async function getProjectById(id: string) {
  try {
    return await prisma.project.findUnique({ where: { id } });
  } catch (error) {
    logger.error("Failed to fetch project by id", {
      action: "getProjectById",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to fetch project");
  }
}

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData);

  const slug = (raw.slug as string)?.trim() || slugify(raw.title as string);

  const techStack = safeParseJsonArray(raw.techStack as string);

  const parsed = projectSchema.safeParse({
    title: raw.title,
    slug,
    description: raw.description,
    content: raw.content,
    thumbnail: raw.thumbnail || "",
    demoUrl: raw.demoUrl || "",
    githubUrl: raw.githubUrl || "",
    techStack,
    isFeatured: raw.isFeatured === "on" || raw.isFeatured === "true",
  });

  if (!parsed.success) {
    logger.error("Project validation failed", {
      action: "createProject",
      userId: session.user.id as string,
      context: { errors: parsed.error.issues, raw: { title: raw.title, slug } },
    });
    throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  }

  try {
    await prisma.project.create({
      data: { ...parsed.data, techStack: JSON.stringify(parsed.data.techStack) },
    });
  } catch (error) {
    logger.error("Failed to create project", {
      action: "createProject",
      userId: session.user.id as string,
      context: { title: parsed.data.title, slug: parsed.data.slug },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to create project");
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData);

  let existing;
  try {
    existing = await prisma.project.findUnique({ where: { id } });
  } catch (error) {
    logger.error("Failed to find project for update", {
      action: "updateProject",
      userId: session.user.id as string,
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to update project");
  }

  if (!existing) throw new Error("Not found");

  const slug = (raw.slug as string)?.trim() || existing.slug;

  const techStack = safeParseJsonArray(raw.techStack as string);

  const parsed = projectSchema.safeParse({
    title: raw.title,
    slug,
    description: raw.description,
    content: raw.content,
    thumbnail: raw.thumbnail || "",
    demoUrl: raw.demoUrl || "",
    githubUrl: raw.githubUrl || "",
    techStack,
    isFeatured: raw.isFeatured === "on" || raw.isFeatured === "true",
  });

  if (!parsed.success) {
    logger.error("Project validation failed", {
      action: "updateProject",
      userId: session.user.id as string,
      context: { id, errors: parsed.error.issues, raw: { title: raw.title, slug } },
    });
    throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  }

  try {
    await prisma.project.update({
      where: { id },
      data: { ...parsed.data, techStack: JSON.stringify(parsed.data.techStack) },
    });
  } catch (error) {
    logger.error("Failed to update project", {
      action: "updateProject",
      userId: session.user.id as string,
      context: { id, title: parsed.data.title },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to update project");
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.project.delete({ where: { id } });
  } catch (error) {
    logger.error("Failed to delete project", {
      action: "deleteProject",
      userId: session.user.id as string,
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to delete project");
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

export async function toggleProjectFeatured(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  let project;
  try {
    project = await prisma.project.findUnique({ where: { id } });
  } catch (error) {
    logger.error("Failed to find project for toggle", {
      action: "toggleProjectFeatured",
      userId: session.user.id as string,
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to toggle project featured status");
  }

  if (!project) throw new Error("Not found");

  try {
    await prisma.project.update({
      where: { id },
      data: { isFeatured: !project.isFeatured },
    });
  } catch (error) {
    logger.error("Failed to toggle project featured", {
      action: "toggleProjectFeatured",
      userId: session.user.id as string,
      context: { id, isFeatured: !project.isFeatured },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to toggle project featured status");
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

function safeParseJsonArray(value: string): string[] {
  if (!value || value === "[]") return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((item) => typeof item === "string");
    return [];
  } catch {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
}
