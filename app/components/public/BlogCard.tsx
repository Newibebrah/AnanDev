import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { formatDate, truncate } from "@/app/lib/utils";
import type { Post } from "@prisma/client";

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
        {post.coverImage && (
          <div className="aspect-video w-full overflow-hidden rounded-t-xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {formatDate(post.createdAt)}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.excerpt || truncate(post.content, 200)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
