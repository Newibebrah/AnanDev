import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/app/actions/project.actions";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { formatDate } from "@/app/lib/utils";
import type { Metadata } from "next";
import MarkdownContent from "@/app/components/public/MarkdownContent";
import Link from "next/link";
import { BreadcrumbStructuredData } from "@/app/components/seo/BreadcrumbStructuredData";
import { siteConfig } from "@/app/lib/site-config";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Proyek Tidak Ditemukan",
      description: "Maaf, proyek yang Anda cari tidak tersedia.",
    };
  }

  return {
    title: `${project.title} | Proyek`,
    description: project.description || `Lihat proyek ${project.title}`,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "website",
      images: project.thumbnail
        ? [{ url: project.thumbnail, width: 1200, height: 630, alt: project.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
    alternates: {
      canonical: `${siteConfig.url}/projects/${project.slug}`,
    },
  };
}

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
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Projects", url: `${siteConfig.url}/projects` },
          { name: project.title, url: `${siteConfig.url}/projects/${project.slug}` },
        ]}
      />

      <article className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
        <Link
          href="/projects"
          className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to projects
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

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{project.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
            <time dateTime={project.createdAt.toISOString()}>{formatDate(project.createdAt)}</time>
          </div>

          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="font-normal">{tech}</Badge>
              ))}
            </div>
          )}

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{project.description}</p>
        </header>

        {(project.demoUrl || project.githubUrl) && (
          <div className="flex gap-3 mb-8">
            {project.demoUrl && (
              <Button asChild>
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                  Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="outline" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-1.5"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  Source Code
                </a>
              </Button>
            )}
          </div>
        )}

        <Separator className="mb-8" />

        <MarkdownContent content={project.content} />
      </article>
    </>
  );
}
