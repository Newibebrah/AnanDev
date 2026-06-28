import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import type { Project } from "@prisma/client";

export default function ProjectCard({ project }: { project: Project }) {
  const techStack: string[] = JSON.parse(project.techStack || "[]");

  return (
    <Link href={`/projects/${project.slug}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
        {project.thumbnail && (
          <div className="aspect-video w-full overflow-hidden rounded-t-xl">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2">{project.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {project.description}
          </p>
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
