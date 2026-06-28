import type { Metadata } from "next";
import { getPublishedPosts } from "@/app/actions/post.actions";
import BlogCard from "@/app/components/public/BlogCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read my latest blog posts about web development and programming",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Blog</h1>
      <p className="text-muted-foreground mb-8">
        Thoughts, tutorials, and insights.
      </p>

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No posts yet. Check back later!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
