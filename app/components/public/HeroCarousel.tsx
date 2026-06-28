"use client";

import { useState, useCallback } from "react";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { siteConfig } from "@/app/lib/site-config";
import { cn } from "@/app/lib/cn";

const slides = [
  {
    badge: "Full-Stack Developer",
    heading: (<>Hi, I&apos;m a <span className="text-gradient">Full-Stack</span><br />Developer</>),
    description: siteConfig.aboutSlides[0].description,
    cta: (
      <div className="flex items-center justify-center gap-4">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/projects">View Projects</Link>
        </Button>
        <Button variant="outline" size="lg" asChild className="rounded-full px-8">
          <Link href="/hire-me">Hire Me</Link>
        </Button>
      </div>
    ),
  },
  {
    badge: "About Me",
    heading: <>Get to <span className="text-gradient">Know Me</span></>,
    description: null,
    content: (
      <div className="flex flex-col md:flex-row items-center gap-8 max-w-2xl mx-auto text-left">
        <div className="shrink-0">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl bg-gradient-to-br from-primary to-blue-500 p-1">
            <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center text-5xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">{siteConfig.fullName}</h3>
          <p className="text-muted-foreground leading-relaxed">{siteConfig.bio}</p>
        </div>
      </div>
    ),
    cta: (
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="lg" asChild className="rounded-full px-8">
          <Link href="/hire-me">Contact Me</Link>
        </Button>
      </div>
    ),
  },
  {
    badge: "My Interests",
    heading: <>What <span className="text-gradient">Drives Me</span></>,
    description: null,
    content: (
      <div className="max-w-xl mx-auto">
        <blockquote className="text-lg md:text-xl text-muted-foreground italic leading-relaxed border-l-4 border-primary pl-6 text-left">
          &ldquo;I&apos;m deeply interested in web technologies, open-source contributions, and building tools that make a difference. Always exploring new frontiers in software development.&rdquo;
        </blockquote>
        <div className="flex justify-center gap-6 mt-8">
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 0-4 4v1H7a4 4 0 0 0-4 4v5a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-5a4 4 0 0 0-4-4h-1V6a4 4 0 0 0-4-4Z"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            Open Source
          </span>
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Web Dev
          </span>
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            Problem Solving
          </span>
        </div>
      </div>
    ),
    cta: (
      <div className="flex items-center justify-center gap-4">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/projects">See My Work</Link>
        </Button>
      </div>
    ),
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="glow-dot -top-40 -left-40 w-96 h-96 bg-primary" />
      <div className="glow-dot -bottom-40 -right-40 w-80 h-80 bg-blue-500" />

      <div className="hero-grid-bg">
        <div className="container mx-auto max-w-5xl px-4 py-24 md:py-32 text-center relative">
          {slides.map((_, i) => (
            <div
              key={i}
              className={cn(
                "transition-all duration-500",
                i === current ? "block animate-fade-up" : "hidden"
              )}
            >
              {i === current && (
                <>
                  <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    {slide.badge}
                  </span>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
                    {slide.heading}
                  </h1>
                  {slide.description && (
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                      {slide.description}
                    </p>
                  )}
                  {slide.content}
                  <div className="mt-10">
                    {slide.cta}
                  </div>
                </>
              )}
            </div>
          ))}

          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center text-muted-foreground hover:text-primary"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>

            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    i === current ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center text-muted-foreground hover:text-primary"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
