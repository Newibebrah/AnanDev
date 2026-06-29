"use client";

import { useState, useEffect, useRef, useActionState, useCallback } from "react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent } from "@/app/components/ui/card";
import { filterProfanity, containsProfanity } from "@/app/lib/profanity-filter";
import { sendMessage, getMessages } from "@/app/actions/chat.actions";
import { toast } from "sonner";
import type { ChatMessageData } from "@/app/actions/chat.actions";

export default function AnonChat({ initial }: { initial: ChatMessageData[] }) {
  const [messages, setMessages] = useState<ChatMessageData[]>(initial);
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  const checkNearBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 100;
    isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }, []);

  const scrollContainerToBottom = useCallback((smooth = true) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? "smooth" : "instant",
    });
  }, []);

  const [_, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await sendMessage(formData);
      if (result.success) {
        const updated = await getMessages();
        setMessages(updated);
        setTimeout(() => scrollContainerToBottom(true), 50);
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
      setMessages((prev) => {
        if (updated.length > prev.length && isNearBottomRef.current) {
          setTimeout(() => scrollContainerToBottom(true), 50);
        }
        return updated;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [scrollContainerToBottom]);

  useEffect(() => {
    scrollContainerToBottom(false);
  }, []);

  return (
    <div className="flex flex-col">
      <Card
        ref={containerRef}
        onScroll={checkNearBottom}
        className="overflow-y-auto mb-4 min-h-[30rem] max-h-[70vh]"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
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
        </CardContent>
      </Card>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const content = fd.get("content") as string;
          if (containsProfanity(content)) {
            toast.error("Pesan mengandung kata kasar, harap gunakan bahasa yang sopan");
            return;
          }
          formAction(fd);
          e.currentTarget.reset();
        }}
        className="flex gap-2"
      >
        <input type="hidden" name="name" value="Anonymous" />
        <Textarea
          name="content"
          placeholder="Tulis pesan..."
          required
          className="flex-1 min-h-[44px] max-h-20"
          rows={1}
          maxLength={500}
          aria-label="Pesan chat"
        />
        <Button type="submit" disabled={pending} className="min-h-[44px] shrink-0">
          {pending ? "..." : "Kirim"}
        </Button>
      </form>
    </div>
  );
}
