import type { Metadata } from "next";
import { getMessages } from "@/app/actions/chat.actions";
import AnonChat from "@/app/components/public/AnonChat";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Anonymous Chat",
  description: "Chat anonim dengan pengunjung lain secara real-time",
};

export default async function ChatPage() {
  const messages = await getMessages();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Anonymous Chat</h1>
        <p className="text-sm text-muted-foreground">
          Ngobrol santai tanpa login. Pesan akan hilang setelah 50 pesan terbaru.
        </p>
      </div>
      <AnonChat initial={messages} />
    </div>
  );
}
