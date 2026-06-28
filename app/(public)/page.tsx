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
    <>
      <section className="relative overflow-hidden">
        <div className="glow-dot -top-40 -left-40 w-96 h-96 bg-primary" />
        <div className="glow-dot -bottom-40 -right-40 w-80 h-80 bg-blue-500" />

        <div className="hero-grid-bg">
          <div className="container mx-auto max-w-5xl px-4 py-24 md:py-32 text-center relative">
            <div className="animate-fade-up">
              <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                Full-Stack Developer
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Hi, I&apos;m a <span className="text-gradient">Full-Stack</span>
              <br />
              Developer
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              I build modern, scalable web applications with clean code and great user experiences.
            </p>

            <div className="flex items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/projects">View Projects</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="rounded-full px-8">
                <Link href="/hire-me">Hire Me</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {projects.filter(p => p.isFeatured).length > 0 && (
        <section className="container mx-auto max-w-5xl px-4 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Projects</h2>
              <p className="text-muted-foreground mt-1">Some of my recent work</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/projects">View all &rarr;</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.filter(p => p.isFeatured).slice(0, 6).map((project, i) => (
              <div key={project.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Button variant="ghost" asChild>
              <Link href="/projects">View all projects &rarr;</Link>
            </Button>
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="container mx-auto max-w-5xl px-4 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Latest Posts</h2>
              <p className="text-muted-foreground mt-1">Thoughts and tutorials</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/blog">View all &rarr;</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 6).map((post, i) => (
              <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Button variant="ghost" asChild>
              <Link href="/blog">View all posts &rarr;</Link>
            </Button>
          </div>
        </section>
      )}
    </>
  );
}
