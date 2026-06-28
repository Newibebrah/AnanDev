import { testServerAction } from "../test-action";

export const dynamic = "force-dynamic";

export default async function TestFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const name = params.name as string | undefined;
  const userId = params.userId as string | undefined;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Test auth() in Server Action</h1>

      {userId && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800">
          <p>Name: <strong>{name}</strong></p>
          <p>User ID dari auth(): <strong>{userId}</strong></p>
          <p className="text-sm mt-1">
            {userId === "NO_SESSION"
              ? "❌ Tidak ada session — auth() gagal"
              : "✅ auth() berhasil"}
          </p>
        </div>
      )}

      <form action={testServerAction} className="space-y-4">
        <input
          name="name"
          placeholder="Enter test name"
          className="border p-2 w-full rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Test auth()
        </button>
      </form>
    </div>
  );
}
