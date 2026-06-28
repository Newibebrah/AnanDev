import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/app/components/ui/badge";
import type { Project } from "@prisma/client";

export default function ProjectCard({ project }: { project: Project }) {
  const techStack: string[] = JSON.parse(project.techStack || "[]");

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <article className="h-full rounded-xl border border-border/50 bg-card overflow-hidden transition-all duration-300 card-glow hover:border-primary/30 hover:-translate-y-1">
        {project.thumbnail && (
          <div className="aspect-video w-full overflow-hidden relative">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}
        <div className="p-5">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
            {project.description}
          </p>
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs font-normal">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
