import type { Metadata } from "next";
import { getPublishedProjects } from "@/app/actions/project.actions";
import ProjectCard from "@/app/components/public/ProjectCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse my portfolio of web development projects",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Projects</h1>
      <p className="text-muted-foreground mb-8">
        Things I have built so far.
      </p>

      {projects.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No projects yet. Check back later!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
