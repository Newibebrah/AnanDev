import { projectSchema, postSchema, commentSchema, messageSchema } from "./validations";
import type { ActionResult } from "./form-types";

const FIELD_LABELS: Record<string, string> = {
  title: "Judul",
  slug: "Slug",
  description: "Deskripsi",
  content: "Konten",
  name: "Nama",
  email: "Email",
  excerpt: "Ringkasan",
};

function translateZodIssue(field: string, message: string): string {
  const label = FIELD_LABELS[field] || field;
  if (message.startsWith("Too small")) {
    if (message.includes(">= 3")) return `${label} terlalu pendek, minimal 3 karakter`;
    if (message.includes(">= 10")) return `${label} terlalu pendek, minimal 10 karakter`;
    if (message.includes(">= 2")) return `${label} terlalu pendek, minimal 2 karakter`;
    if (message.includes(">= 20")) return `${label} terlalu pendek, minimal 20 karakter`;
  }
  if (message.startsWith("Too big")) return `${label} terlalu panjang`;
  if (message.includes("Invalid email")) return "Email tidak valid";
  if (message.includes("Invalid")) return `${label} tidak valid`;
  return message;
}

function getFirstError(error: { issues: Array<{ path: (string | number | symbol)[]; message: string }> }): string {
  const issue = error.issues[0];
  if (!issue) return "Validasi gagal";
  const field = issue.path[0] as string;
  return translateZodIssue(field, issue.message);
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

export function validateProject(formData: FormData): ActionResult | null {
  const raw = Object.fromEntries(formData);
  const parsed = projectSchema.safeParse({
    title: (raw.title as string) || "",
    slug: (raw.slug as string)?.trim() || "",
    description: (raw.description as string) || "",
    content: (raw.content as string) || "",
    thumbnail: (raw.thumbnail as string) || "",
    demoUrl: (raw.demoUrl as string) || "",
    githubUrl: (raw.githubUrl as string) || "",
    techStack: safeParseJsonArray(raw.techStack as string),
    isFeatured: raw.isFeatured === "on" || raw.isFeatured === "true",
  });
  if (!parsed.success) {
    return { success: false, errors: null, message: getFirstError(parsed.error) };
  }
  return null;
}

export function validatePost(formData: FormData): ActionResult | null {
  const raw = Object.fromEntries(formData);
  const published = raw.status === "PUBLISHED";
  const parsed = postSchema.safeParse({
    title: (raw.title as string) || "",
    slug: (raw.slug as string)?.trim() || "",
    excerpt: (raw.excerpt as string) || undefined,
    content: (raw.content as string) || "",
    coverImage: (raw.coverImage as string) || "",
    status: published ? "PUBLISHED" : "DRAFT",
    publishedAt: published ? new Date().toISOString() : undefined,
  });
  if (!parsed.success) {
    return { success: false, errors: null, message: getFirstError(parsed.error) };
  }
  return null;
}

export function validateComment(formData: FormData): ActionResult | null {
  const raw = Object.fromEntries(formData);
  const parsed = commentSchema.safeParse({
    name: raw.name,
    email: raw.email || "",
    content: raw.content,
  });
  if (!parsed.success) {
    return { success: false, errors: null, message: getFirstError(parsed.error) };
  }
  return null;
}

export function validateMessage(formData: FormData): ActionResult | null {
  const raw = Object.fromEntries(formData);
  const parsed = messageSchema.safeParse({
    name: raw.name,
    email: raw.email,
    content: raw.content,
  });
  if (!parsed.success) {
    return { success: false, errors: null, message: getFirstError(parsed.error) };
  }
  return null;
}
