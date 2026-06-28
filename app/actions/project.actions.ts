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
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

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
      logger.error("Project validation failed", {
        action: "createProject",
        userId: session.user.id as string,
        context: { errors: parsed.error.issues, raw: { title, slug } },
      });
      throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
    }

    await prisma.project.create({
      data: { ...parsed.data, techStack: JSON.stringify(parsed.data.techStack) },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    redirect("/admin/projects");
  } catch (error) {
    logAndRethrow("createProject", error, { userId: (await auth())?.user?.id });
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const raw = Object.fromEntries(formData);

    let existing;
    try {
      existing = await prisma.project.findUnique({ where: { id } });
    } catch {
      throw new Error("Failed to find project for update");
    }
    if (!existing) throw new Error("Not found");

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
      logger.error("Project validation failed", {
        action: "updateProject",
        userId: session.user.id as string,
        context: { id, errors: parsed.error.issues, raw: { title, slug } },
      });
      throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
    }

    await prisma.project.update({
      where: { id },
      data: { ...parsed.data, techStack: JSON.stringify(parsed.data.techStack) },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    redirect("/admin/projects");
  } catch (error) {
    logAndRethrow("updateProject", error, { userId: (await auth())?.user?.id, context: { id } });
  }
}

export async function deleteProject(id: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    try {
      await prisma.project.delete({ where: { id } });
    } catch {
      throw new Error("Failed to delete project");
    }

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
  } catch (error) {
    logAndRethrow("deleteProject", error, { userId: (await auth())?.user?.id, context: { id } });
  }
}

export async function toggleProjectFeatured(id: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new Error("Not found");

    await prisma.project.update({
      where: { id },
      data: { isFeatured: !project.isFeatured },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
  } catch (error) {
    logAndRethrow("toggleProjectFeatured", error, { userId: (await auth())?.user?.id, context: { id } });
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

  throw typeof error === "object" && error !== null && "message" in error
    ? error
    : new Error("An unexpected error occurred");
}
