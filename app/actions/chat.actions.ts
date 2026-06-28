"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { chatMessageSchema } from "@/app/lib/validations";
import { auth } from "@/app/lib/auth";
import { logger } from "@/app/lib/logger";
import { createHash } from "crypto";

import type { ActionResult } from "@/app/lib/form-types";

export type ChatMessageData = {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
};

const RATE_LIMIT_SECONDS = 2;

const IP_SALT = process.env.IP_HASH_SALT || "default-rotate-in-prod";

function hashIp(ip: string): string {
  return createHash("sha256").update(ip + IP_SALT).digest("hex").slice(0, 16);
}

async function getClientIp(): Promise<string> {
  const { headers } = await import("next/headers");
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

export async function getMessages(): Promise<ChatMessageData[]> {
  try {
    return await prisma.chatMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch (error) {
    await logger.error("Failed to fetch chat messages", {
      action: "getMessages",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return [];
  }
}

export async function sendMessage(formData: FormData): Promise<ActionResult> {
  try {
    const raw = Object.fromEntries(formData);
    const parsed = chatMessageSchema.safeParse({
      name: (raw.name as string)?.trim() || "Anonymous",
      content: (raw.content as string)?.trim(),
    });

    if (!parsed.success) {
      return {
        success: false,
        errors: null,
        message: "Pesan tidak valid (maks 500 karakter)",
      };
    }

    const ip = await getClientIp();
    const key = hashIp(ip);

    const recent = await prisma.chatMessage.findFirst({
      where: { rateKey: key },
      orderBy: { createdAt: "desc" },
    });

    if (recent) {
      const elapsed = (Date.now() - recent.createdAt.getTime()) / 1000;
      if (elapsed < RATE_LIMIT_SECONDS) {
        const wait = Math.ceil(RATE_LIMIT_SECONDS - elapsed);
        return {
          success: false,
          errors: null,
          message: `Tunggu ${wait} detik sebelum mengirim lagi`,
        };
      }
    }

    await prisma.chatMessage.create({
      data: {
        name: parsed.data.name || "Anonymous",
        content: parsed.data.content,
        rateKey: key,
      },
    });

    revalidatePath("/chat");
    return { success: true, errors: null, message: "Pesan terkirim" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "sendMessage",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "Gagal mengirim pesan" };
  }
}

export async function deleteChatMessage(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    await prisma.chatMessage.delete({ where: { id } });

    revalidatePath("/admin/chat");
    return { success: true, errors: null, message: "Pesan dihapus" };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "deleteChatMessage",
      context: { id },
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "Gagal menghapus pesan" };
  }
}

export async function deleteAllChatMessages(_formData?: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, errors: null, message: "Unauthorized" };

    const { count } = await prisma.chatMessage.deleteMany();

    revalidatePath("/admin/chat");
    return { success: true, errors: null, message: `${count} pesan dihapus` };
  } catch (error) {
    await logger.error(error instanceof Error ? error.message : String(error), {
      action: "deleteAllChatMessages",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, errors: null, message: "Gagal menghapus semua pesan" };
  }
}
