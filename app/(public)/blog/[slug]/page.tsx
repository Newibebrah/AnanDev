import { notFound } from "next/navigation";
import { getPostBySlug } from "@/app/actions/post.actions";
import { formatDate } from "@/app/lib/utils";
import type { Metadata } from "next";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import CommentSection from "@/app/components/comment/CommentSection";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
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
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/blog"
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        &larr; Back to blog
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

      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
        <span>{formatDate(post.createdAt)}</span>
        {post.author && (
          <>
            <span>&middot;</span>
            <span>{post.author.username}</span>
          </>
        )}
      </div>

      {post.excerpt && (
        <p className="text-lg text-muted-foreground mb-6 italic">
          {post.excerpt}
        </p>
      )}

      <Separator className="mb-8" />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <Separator className="my-12" />

      <CommentSection postId={post.id} comments={post.comments} />
    </div>
  );
}
