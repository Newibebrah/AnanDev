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
    <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Projects</h1>
        <p className="text-muted-foreground">
          Things I have built so far.
        </p>
      </div>

      {projects.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">
          No projects yet. Check back later!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <div key={project.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
