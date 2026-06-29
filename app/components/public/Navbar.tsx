"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/cn";
import { AccentSwitcher } from "@/app/components/ui/accent-switcher";
import { useEffect, useRef, useCallback, useState, useSyncExternalStore } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/hire-me", label: "Hire Me" },
  { href: "/chat", label: "Chat" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setMobileOpen(false);
      toggleRef.current?.focus();
      return;
    }
    if (e.key === "Tab" && menuRef.current) {
      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full glass-nav">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-bold text-lg md:text-xl min-h-[44px] flex items-center gap-1.5 group"
        >
          <span className="text-gradient text-glow animate-glow-pulse">&lt;AnanDev</span>
          <span className="text-muted-foreground/40 font-mono text-xs md:text-sm transition-all duration-300 group-hover:text-primary/60 group-hover:text-glow">
            /&gt;
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Button
                key={link.href}
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  "relative px-4 transition-colors min-h-[44px]",
                  isActive && "text-primary"
                )}
              >
                <Link href={link.href} aria-current={isActive ? "page" : undefined}>
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-primary" />
                  )}
                </Link>
              </Button>
            );
          })}

          <span className="w-px h-6 bg-border mx-2" aria-hidden="true" />

          <AccentSwitcher />

          <Button
            variant="ghost"
            size="icon"
            className="min-h-[44px] min-w-[44px]"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </Button>
        </nav>

        <button
          ref={toggleRef}
          className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] touch-manipulation"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>
            ) : (
              <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-in"
          role="region"
          aria-label="Mobile navigation"
          onKeyDown={handleKeyDown}
        >
          <nav className="container mx-auto max-w-5xl px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Button
                  key={link.href}
                  variant="ghost"
                  asChild
                  className={cn(
                    "w-full justify-start min-h-[48px] text-base",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link href={link.href} onClick={closeMobile} aria-current={isActive ? "page" : undefined}>{link.label}</Link>
                </Button>
              );
            })}
            <div className="pt-4 border-t border-border mt-2 space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs text-muted-foreground font-medium">Accent</span>
                <AccentSwitcher />
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 min-h-[48px] text-base"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {mounted && theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
                {mounted && theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
