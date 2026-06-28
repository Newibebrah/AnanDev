"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { CancelButton } from "@/app/components/ui/cancel-button";
import { createPost, updatePost } from "@/app/actions/post.actions";
import { validatePost } from "@/app/lib/client-validate";
import type { Post } from "@prisma/client";
import type { ActionResult } from "@/app/lib/form-types";
import { toast } from "sonner";

interface PostFormProps {
  post?: Post | null;
}

export function PostForm({ post }: PostFormProps) {
  const isNew = !post;
  const router = useRouter();
  const action = isNew
    ? createPost
    : updatePost.bind(null, post.id);

  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const clientErrors = validatePost(formData);
      if (clientErrors) return clientErrors;
      return action(formData);
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/blog");
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">
        {isNew ? "New Post" : "Edit Post"}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={post?.title}
                placeholder="Post title"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="slug">Slug (optional)</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={post?.slug}
                placeholder="auto-generated from title"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                defaultValue={post?.excerpt || ""}
                placeholder="Short summary (optional)"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                name="coverImage"
                defaultValue={post?.coverImage || ""}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea
                id="content"
                name="content"
                defaultValue={post?.content}
                placeholder="Write your post in Markdown..."
                rows={16}
                required
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="status"
                value="PUBLISHED"
                defaultChecked={post?.status === "PUBLISHED"}
              />
              <span className="text-sm">Published</span>
            </label>

            <div className="flex gap-4 pt-2">
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : isNew ? "Create Post" : "Update Post"}
              </Button>
              <CancelButton />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
