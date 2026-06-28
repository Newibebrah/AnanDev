"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Separator } from "@/app/components/ui/separator";
import { formatDate } from "@/app/lib/utils";
import { createComment } from "@/app/actions/comment.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CommentItem {
  id: string;
  name: string;
  email: string | null;
  content: string;
  isApproved: boolean;
  createdAt: Date;
  parentId: string | null;
  replies?: CommentItem[];
}

export default function CommentSection({
  postId,
  comments,
}: {
  postId: string;
  comments: CommentItem[];
}) {
  const router = useRouter();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    formData.append("postId", postId);
    await createComment(formData);
    toast.success("Comment submitted for approval!");
    router.refresh();
    setReplyingTo(null);
  }

  function renderComment(comment: CommentItem, depth = 0) {
    return (
      <div key={comment.id} className={`${depth > 0 ? "ml-6 pl-4 border-l" : ""}`}>
        <div className="py-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
          >
            Reply
          </Button>

          {replyingTo === comment.id && (
            <form action={handleSubmit} className="mt-3 space-y-2">
              <input type="hidden" name="parentId" value={comment.id} />
              <Input
                name="name"
                placeholder="Your name"
                required
                className="max-w-xs"
              />
              <Input
                name="email"
                type="email"
                placeholder="Email (optional)"
                className="max-w-xs"
              />
              <Textarea
                name="content"
                placeholder="Write your reply..."
                required
                className="max-w-md"
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm">
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {comment.replies?.map((reply) => renderComment(reply, depth + 1))}
        </div>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6">
        Comments ({comments.length})
      </h2>

      <form action={handleSubmit} className="mb-8 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Your name" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email (optional)</Label>
            <Input id="email" name="email" type="email" placeholder="your@email.com" />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="content">Comment</Label>
          <Textarea id="content" name="content" placeholder="Write your comment..." required />
        </div>
        <Button type="submit">Post Comment</Button>
      </form>

      <Separator className="mb-6" />

      {comments.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </section>
  );
}
