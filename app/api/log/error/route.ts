import { reportClientError } from "@/app/actions/error.actions";

const RATE_LIMIT_MAP = new Map<string, number>();
const RATE_WINDOW = 10_000;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const last = RATE_LIMIT_MAP.get(ip);
  if (last && now - last < RATE_WINDOW) {
    return new Response(null, { status: 429 });
  }
  RATE_LIMIT_MAP.set(ip, now);

  const formData = await request.formData();
  await reportClientError(formData);
  return new Response(null, { status: 204 });
}
