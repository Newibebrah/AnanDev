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
        <h1 className="text-3xl md:text-4xl font-bold">
          Projects
          <span className="block mt-1.5 w-12 h-1 rounded-full bg-gradient-to-r from-primary to-transparent" />
        </h1>
        <p className="text-muted-foreground mt-3">
          Things I have built so far.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4 opacity-20">&#128187;</div>
          <p className="text-muted-foreground">
            No projects yet. Check back later!
          </p>
        </div>
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
