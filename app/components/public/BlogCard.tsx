import Link from "next/link";
import Image from "next/image";
import { formatDate, truncate } from "@/app/lib/utils";
import type { Post } from "@prisma/client";

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="h-full rounded-xl border border-border/50 bg-card overflow-hidden transition-all duration-300 card-glow hover:border-primary/30 hover:-translate-y-1.5 flex flex-col">
        {post.coverImage && (
          <div className="aspect-video w-full overflow-hidden relative">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <p className="text-xs text-muted-foreground mb-2">{formatDate(post.createdAt)}</p>
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
            {post.excerpt || truncate(post.content, 200)}
          </p>
        </div>
      </article>
    </Link>
  );
}
