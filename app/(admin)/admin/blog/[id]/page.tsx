import { notFound } from "next/navigation";
import { getPostById } from "@/app/actions/post.actions";
import { PostForm } from "@/app/components/admin/post-form";

export const dynamic = "force-dynamic";

export default async function AdminBlogFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const post = isNew ? null : await getPostById(id);

  if (!isNew && !post) notFound();

  return <PostForm post={post} />;
}
