"use server";

import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

export async function testServerAction(formData: FormData) {
  const name = formData.get("name") as string;

  const prisma = new PrismaClient();

  try {
    const created = await prisma.errorLog.create({
      data: {
        level: "info",
        message: `Test: ${name || "no name"}`,
        action: "test-return-result",
        context: JSON.stringify({ name, timestamp: new Date().toISOString() }),
      },
    });

    redirect(`/api/debug/test-form?result=ok&id=${created.id}`);
  } catch (error) {
    redirect(
      `/api/debug/test-form?result=error&msg=${encodeURIComponent(error instanceof Error ? error.message : String(error))}`
    );
  } finally {
    await prisma.$disconnect();
  }
}
