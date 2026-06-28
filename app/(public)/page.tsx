import type { Metadata } from "next";
import { Button } from "@/app/components/ui/button";
import ProjectCard from "@/app/components/public/ProjectCard";
import BlogCard from "@/app/components/public/BlogCard";
import HeroCarousel from "@/app/components/public/HeroCarousel";
import { getPublishedProjects } from "@/app/actions/project.actions";
import { getPublishedPosts } from "@/app/actions/post.actions";
import Link from "next/link";

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
      <HeroCarousel />

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
              <div key={project.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties}>
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
              <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties}>
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
