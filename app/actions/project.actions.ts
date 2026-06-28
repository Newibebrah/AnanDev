"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { projectSchema } from "@/app/lib/validations";
import { auth } from "@/app/lib/auth";
import { logger } from "@/app/lib/logger";
import { slugify } from "@/app/lib/utils";

import type { ActionResult } from "@/app/lib/form-types";

export async function getProjects() {
  try {
    return await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    await logger.error("Failed to fetch projects", {
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
    await logger.error("Failed to fetch published projects", {
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
    await logger.error("Failed to fetch project by slug", {
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
    await logger.error("Failed to fetch project by id", {
      action: "getProjectById",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to fetch project");
  }
}

export async function createProject(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, errors: null, message: "Unauthorized" };
    }

    const raw = Object.fromEntries(formData);

    const title = (raw.title as string) || "";
    const slug = (raw.slug as string)?.trim() || slugify(title);
    const description = (raw.description as string) || "";
    const content = (raw.content as string) || "";
    const techStack = safeParseJsonArray(raw.techStack as string);

    const parsed = projectSchema.safeParse({
      title,
      slug,
      description,
      content,
      thumbnail: (raw.thumbnail as string) || "",
      demoUrl: (raw.demoUrl as string) || "",
      githubUrl: (raw.githubUrl as string) || "",
      techStack,
      isFeatured: raw.isFeatured === "on" || raw.isFeatured === "true",
    });

    if (!parsed.success) {
      await logger.error("Project validation failed", {
        action: "createProject",
        userId: session.user.id as string,
        context: { errors: parsed.error.issues, raw: { title, slug } },
      });
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        message: "Validation failed",
      };
    }

    await prisma.project.create({
      data: { ...parsed.data, techStack: JSON.stringify(parsed.data.techStack) },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { success: true, errors: null, message: "Project created successfully" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "createProject",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}

export async function updateProject(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, errors: null, message: "Unauthorized" };
    }

    const raw = Object.fromEntries(formData);

    let existing;
    try {
      existing = await prisma.project.findUnique({ where: { id } });
    } catch {
      return { success: false, errors: null, message: "Failed to find project for update" };
    }
    if (!existing) return { success: false, errors: null, message: "Not found" };

    const title = (raw.title as string) || "";
    const slug = (raw.slug as string)?.trim() || existing.slug;
    const description = (raw.description as string) || "";
    const content = (raw.content as string) || "";
    const techStack = safeParseJsonArray(raw.techStack as string);

    const parsed = projectSchema.safeParse({
      title,
      slug,
      description,
      content,
      thumbnail: (raw.thumbnail as string) || "",
      demoUrl: (raw.demoUrl as string) || "",
      githubUrl: (raw.githubUrl as string) || "",
      techStack,
      isFeatured: raw.isFeatured === "on" || raw.isFeatured === "true",
    });

    if (!parsed.success) {
      await logger.error("Project validation failed", {
        action: "updateProject",
        userId: session.user.id as string,
        context: { id, errors: parsed.error.issues, raw: { title, slug } },
      });
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        message: "Validation failed",
      };
    }

    await prisma.project.update({
      where: { id },
      data: { ...parsed.data, techStack: JSON.stringify(parsed.data.techStack) },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { success: true, errors: null, message: "Project updated successfully" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "updateProject",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    try {
      await prisma.project.delete({ where: { id } });
    } catch {
      return { success: false, errors: null, message: "Failed to delete project" };
    }

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { success: true, errors: null, message: "Project deleted" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "deleteProject",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
}

export async function toggleProjectFeatured(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return { success: false, errors: null, message: "Not found" };

    await prisma.project.update({
      where: { id },
      data: { isFeatured: !project.isFeatured },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { success: true, errors: null, message: "Project updated" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "toggleProjectFeatured",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "An unexpected error occurred" };
  }
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
