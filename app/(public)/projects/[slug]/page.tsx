import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/app/actions/project.actions";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { formatDate } from "@/app/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const techStack: string[] = JSON.parse(project.techStack || "[]");

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/projects"
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        &larr; Back to projects
      </Link>

      {project.thumbnail && (
        <div className="aspect-video w-full overflow-hidden rounded-xl mb-8">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <p className="text-sm text-muted-foreground mb-4">
        {formatDate(project.createdAt)}
      </p>

      {techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      )}

      <p className="text-lg text-muted-foreground mb-6">{project.description}</p>

      {(project.demoUrl || project.githubUrl) && (
        <div className="flex gap-4 mb-8">
          {project.demoUrl && (
            <Button asChild>
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                Live Demo
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button variant="outline" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                Source Code
              </a>
            </Button>
          )}
        </div>
      )}

      <Separator className="mb-8" />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {project.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
