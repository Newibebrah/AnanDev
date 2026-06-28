import { testServerAction } from "../test-action";

export const dynamic = "force-dynamic";

export default async function TestFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const result = params.result as string | undefined;
  const id = params.id as string | undefined;
  const msg = params.msg as string | undefined;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Test Server Action</h1>

      {result === "ok" && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-800">
          ✅ Write successful! ID: <code className="font-mono text-xs break-all">{id}</code>
          <br />
          Check{" "}
          <a href="/admin/errors" className="underline">
            /admin/errors
          </a>{" "}
          — search for &quot;test-return-result&quot;.
        </div>
      )}

      {result === "error" && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800">
          ❌ Error: {msg}
        </div>
      )}

      <form action={testServerAction} className="space-y-4">
        <input
          name="name"
          placeholder="Enter test name"
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Test
        </button>
      </form>
    </div>
  );
}
