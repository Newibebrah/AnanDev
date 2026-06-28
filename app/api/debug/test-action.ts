"use server";

// Test 1: Import just @prisma/client (no instantiation)
import { PrismaClient } from "@prisma/client";

export async function testServerAction(formData: FormData) {
  const name = formData.get("name") as string;

  // Test 2: Instantiate PrismaClient inside the action
  const prisma = new PrismaClient();

  try {
    await prisma.errorLog.create({
      data: {
        level: "info",
        message: `Test server action with inline Prisma: ${name || "no name"}`,
        action: "test-server-action-inline",
        context: JSON.stringify({ name }),
      },
    });
  } catch (error) {
    // If Prisma fails, this error message will tell us something
    throw new Error(`Prisma error: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    await prisma.$disconnect();
  }
}
