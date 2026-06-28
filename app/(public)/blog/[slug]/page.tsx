import { notFound } from "next/navigation";
import { getPostBySlug } from "@/app/actions/post.actions";
import { formatDate } from "@/app/lib/utils";
import type { Metadata } from "next";
import { Separator } from "@/app/components/ui/separator";
import CommentSection from "@/app/components/comment/CommentSection";
import MarkdownContent from "@/app/components/public/MarkdownContent";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "PUBLISHED") notFound();

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link
        href="/blog"
        className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to blog
      </Link>

      {post.coverImage && (
        <div className="aspect-video w-full overflow-hidden rounded-xl mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
          <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
          {post.author && (
            <>
              <span className="text-border">&middot;</span>
              <span>{post.author.username}</span>
            </>
          )}
        </div>
      </header>

      {post.excerpt && (
        <p className="text-base md:text-lg text-muted-foreground italic mb-8 leading-relaxed border-l-4 border-primary/20 pl-4">
          {post.excerpt}
        </p>
      )}

      <Separator className="mb-8" />

      <MarkdownContent content={post.content} />

      <Separator className="my-12" />

      <CommentSection postId={post.id} comments={post.comments} />
    </article>
  );
}
