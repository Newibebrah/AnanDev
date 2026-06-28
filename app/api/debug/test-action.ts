"use server";

import { PrismaClient } from "@prisma/client";

export async function testServerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const prisma = new PrismaClient();

  let result;
  try {
    result = await prisma.errorLog.create({
      data: {
        level: "info",
        message: `Test: ${name || "no name"}`,
        action: "test-prisma-error",
        context: JSON.stringify({ name }),
      },
    });
  } finally {
    await prisma.$disconnect();
  }

  // Return result as redirect — outside try/catch
  const redirectUrl = `/api/debug/test-form?result=ok&id=${result.id}`;

  // Use Response.redirect instead of Next.js redirect
  const { redirect } = await import("next/navigation");
  redirect(redirectUrl);
}
