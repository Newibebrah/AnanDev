import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/app/components/ui/button";
import ProjectCard from "@/app/components/public/ProjectCard";
import BlogCard from "@/app/components/public/BlogCard";
import { getPublishedProjects } from "@/app/actions/project.actions";
import { getPublishedPosts } from "@/app/actions/post.actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
  description: "Full-stack developer portfolio showcasing projects and blog posts",
};

export default async function HomePage() {
  const projects = await getPublishedProjects();
  const posts = await getPublishedPosts();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Hi, I&apos;m a Full-Stack Developer
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          I build modern, scalable web applications with clean code and great user experiences.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/projects">View Projects</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/hire-me">Hire Me</Link>
          </Button>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Featured Projects</h2>
            <Button variant="ghost" asChild>
              <Link href="/projects">View all &rarr;</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.filter(p => p.isFeatured).slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Latest Posts</h2>
            <Button variant="ghost" asChild>
              <Link href="/blog">View all &rarr;</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
