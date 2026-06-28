"use server";

import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export async function testServerAction(formData: FormData) {
  const name = formData.get("name") as string;

  const session = await auth();
  const userId = session?.user?.id || "NO_SESSION";

  redirect(`/api/debug/test-form?name=${encodeURIComponent(name || "test")}&userId=${userId}`);
}
