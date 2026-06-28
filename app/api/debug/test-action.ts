"use server";

import { prisma } from "@/app/lib/prisma";

export async function testServerAction(formData: FormData) {
  const name = formData.get("name") as string;

  try {
    await prisma.errorLog.create({
      data: {
        level: "info",
        message: `Test server action executed: ${name || "no name"}`,
        action: "test-server-action",
        context: JSON.stringify({ name }),
      },
    });
  } catch (error) {
    await prisma.errorLog.create({
      data: {
        level: "error",
        message: `Test server action FAILED: ${error instanceof Error ? error.message : String(error)}`,
        action: "test-server-action-error",
        context: JSON.stringify({ name, error: error instanceof Error ? error.stack : String(error) }),
      },
    });
  }
}
