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
    <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          Blog
          <span className="block mt-1.5 w-12 h-1 rounded-full bg-gradient-to-r from-primary to-transparent" />
        </h1>
        <p className="text-muted-foreground mt-3">
          Thoughts, tutorials, and insights.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4 opacity-20">&#128221;</div>
          <p className="text-muted-foreground">
            No posts yet. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
