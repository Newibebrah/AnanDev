"use client";

import { useState, useEffect, useRef, useActionState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent } from "@/app/components/ui/card";
import { sendMessage, getMessages } from "@/app/actions/chat.actions";
import { toast } from "sonner";
import type { ChatMessageData } from "@/app/actions/chat.actions";

export default function AnonChat({ initial }: { initial: ChatMessageData[] }) {
  const [messages, setMessages] = useState<ChatMessageData[]>(initial);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");

  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await sendMessage(formData);
      if (result.success) {
        const updated = await getMessages();
        setMessages(updated);
      } else if (result.message) {
        toast.error(result.message);
      }
      return result;
    },
    null
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      const updated = await getMessages();
      setMessages(updated);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <Card className="flex-1 overflow-y-auto mb-4">
        <CardContent className="p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              Belum ada pesan. Jadilah yang pertama!
            </p>
          )}
          {[...messages].reverse().map((msg) => (
            <div key={msg.id} className="animate-fade-in">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-xs font-semibold text-primary">
                  {msg.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm leading-relaxed break-words">{msg.content}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </CardContent>
      </Card>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          formAction(fd);
          e.currentTarget.reset();
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <Input
          name="name"
          placeholder="Nama (opsional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="sm:w-44"
          maxLength={20}
        />
        <Textarea
          name="content"
          placeholder="Tulis pesan..."
          required
          className="flex-1 min-h-[44px] max-h-20"
          rows={1}
          maxLength={500}
        />
        <Button type="submit" disabled={pending} className="min-h-[44px] shrink-0">
          {pending ? "..." : "Kirim"}
        </Button>
      </form>
    </div>
  );
}
