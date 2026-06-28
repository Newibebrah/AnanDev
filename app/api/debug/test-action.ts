"use server";

export async function testServerAction(formData: FormData) {
  const name = formData.get("name") as string;
  // Just return — no Prisma, no fs
}
