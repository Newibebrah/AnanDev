import { notFound } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { getPostById } from "@/app/actions/post.actions";
import { createPost, updatePost } from "@/app/actions/post.actions";

export default async function AdminBlogFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const post = isNew ? null : await getPostById(id);

  if (!isNew && !post) notFound();

  const action = isNew ? createPost : updatePost.bind(null, id);

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
          <form action={action} className="space-y-4">
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
              <Button type="submit">
                {isNew ? "Create Post" : "Update Post"}
              </Button>
              <Button variant="outline" type="button" onClick={() => window.history.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
