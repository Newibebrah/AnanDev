"use client";

import { useState, useCallback, useRef } from "react";
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
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button asChild size="lg" className="rounded-full px-8 w-full sm:w-auto min-h-[44px] shadow-lg shadow-primary/20">
          <Link href="/projects">View Projects</Link>
        </Button>
        <Button variant="outline" size="lg" asChild className="rounded-full px-8 w-full sm:w-auto min-h-[44px]">
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
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 max-w-2xl mx-auto text-center md:text-left">
        <div className="shrink-0">
          <div className="w-28 h-28 md:w-44 md:h-44 rounded-2xl bg-gradient-to-br from-primary to-[color-mix(in_srgb,var(--primary)_70%,blue)] p-1 mx-auto md:mx-0 shadow-lg shadow-primary/20">
            <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground w-10 h-10 md:w-14 md:h-14">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-2">{siteConfig.fullName}</h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{siteConfig.bio}</p>
        </div>
      </div>
    ),
    cta: (
      <div className="flex items-center justify-center">
        <Button variant="outline" size="lg" asChild className="rounded-full px-8 min-h-[44px]">
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
        <blockquote className="text-base md:text-xl text-muted-foreground italic leading-relaxed border-l-4 border-primary pl-4 md:pl-6 text-left">
          &ldquo;I&apos;m deeply interested in web technologies, open-source contributions, and building tools that make a difference. Always exploring new frontiers in software development.&rdquo;
        </blockquote>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6 md:mt-8">
          <span className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M12 2a4 4 0 0 0-4 4v1H7a4 4 0 0 0-4 4v5a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-5a4 4 0 0 0-4-4h-1V6a4 4 0 0 0-4-4Z"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            Open Source
          </span>
          <span className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Web Dev
          </span>
          <span className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            Problem Solving
          </span>
        </div>
      </div>
    ),
    cta: (
      <div className="flex items-center justify-center">
        <Button asChild size="lg" className="rounded-full px-8 min-h-[44px] shadow-lg shadow-primary/20">
          <Link href="/projects">See My Work</Link>
        </Button>
      </div>
    ),
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  }, [next, prev]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  }, [next, prev]);

  return (
    <section
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured content carousel"
    >
      <div className="glow-dot -top-40 -left-40 w-96 h-96 bg-primary" />
      <div className="glow-dot -bottom-40 -right-40 w-80 h-80" style={{ backgroundColor: "color-mix(in srgb, var(--primary) 70%, transparent)" }} />

      <div className="hero-grid-bg">
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-32 text-center relative">
          <div aria-live="polite" aria-atomic="false">
            {slides.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "transition-all duration-500",
                  i === current ? "block animate-fade-up" : "hidden"
                )}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} of ${slides.length}`}
              >
              {i === current && (
                <>
                  <span className="inline-block text-[10px] md:text-xs font-medium tracking-widest uppercase mb-4 md:mb-6 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {slide.badge}
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 leading-tight">
                    {slide.heading}
                  </h1>
                  {slide.description && (
                    <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-10 px-2">
                      {slide.description}
                    </p>
                  )}
                  {slide.content}
                  <div className="mt-8 md:mt-10">
                    {slide.cta}
                  </div>
                </>
              )}
            </div>
          ))}
          </div>

          <div className="flex items-center justify-center gap-3 md:gap-4 mt-10 md:mt-12">
            <button
              onClick={prev}
              className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 active:bg-primary/10 transition-all flex items-center justify-center text-muted-foreground hover:text-primary touch-manipulation"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>

            <div className="flex items-center gap-2 md:gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "rounded-full transition-all duration-300 touch-manipulation",
                    i === current
                      ? "bg-primary w-6 md:w-8 h-2 md:h-2.5 shadow-sm shadow-primary/50"
                      : "bg-border hover:bg-muted-foreground/50 w-2 md:w-2.5 h-2 md:h-2.5"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 active:bg-primary/10 transition-all flex items-center justify-center text-muted-foreground hover:text-primary touch-manipulation"
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
