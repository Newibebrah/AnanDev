import { reportClientError } from "@/app/actions/error.actions";

export async function POST(request: Request) {
  const formData = await request.formData();
  await reportClientError(formData);
  return new Response(null, { status: 204 });
}
