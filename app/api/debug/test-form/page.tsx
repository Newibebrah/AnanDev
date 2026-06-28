import { testServerAction } from "../test-action";

export const dynamic = "force-dynamic";

export default function TestFormPage() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Test Server Action (no Prisma)</h1>
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
      <p className="mt-4 text-sm text-yellow-600 bg-yellow-50 border p-3 rounded">
        ⚠️ This server action has ZERO imports — no Prisma, no logger.
        If this works, the issue is Prisma bundling in server actions.
      </p>
    </div>
  );
}
