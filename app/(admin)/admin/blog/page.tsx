import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { getPosts, deletePost, togglePostStatus } from "@/app/actions/post.actions";
import { formatDate } from "@/app/lib/utils";
import { InlineAction } from "@/app/components/admin/inline-action";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button asChild>
          <Link href="/admin/blog/new">New Post</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4 font-medium text-sm">Title</th>
                <th className="p-4 font-medium text-sm hidden md:table-cell">Status</th>
                <th className="p-4 font-medium text-sm hidden lg:table-cell">Date</th>
                <th className="p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b last:border-0">
                  <td className="p-4">
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-muted-foreground">/{post.slug}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>
                      {post.status}
                    </Badge>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <InlineAction action={togglePostStatus.bind(null, post.id)}>
                        <Button type="submit" variant="ghost" size="sm">
                          {post.status === "PUBLISHED" ? "Draft" : "Publish"}
                        </Button>
                      </InlineAction>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/blog/${post.id}`}>Edit</Link>
                      </Button>
                      <InlineAction action={deletePost.bind(null, post.id)}>
                        <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                          Delete
                        </Button>
                      </InlineAction>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No posts yet. Write your first post!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
