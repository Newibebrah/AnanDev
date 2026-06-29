import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/hire-me", label: "Hire Me" },
  { href: "/chat", label: "Chat" },
];

const socialLinks = [
  {
    href: "https://github.com/Newibebrah",
    label: "GitHub",
    ariaLabel: "GitHub profile",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
    ),
  },
  {
    href: "https://instagram.com/yourhandle",
    label: "Instagram",
    ariaLabel: "Instagram profile",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
    ),
  },
  {
    href: "mailto:hello@example.com",
    label: "Email",
    ariaLabel: "Send email",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-b from-transparent to-muted/30 mt-auto overflow-hidden">
      <div className="glow-dot -bottom-20 -right-20 w-72 h-72 bg-primary/20" />
      <div className="glow-dot -top-20 -left-20 w-60 h-60 bg-blue-500/10" />

      <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16 relative">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-bold text-xl text-gradient">
              Portfolio
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-xs">
              Full-stack developer crafting modern web experiences with clean code and great design.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Navigation
            </h4>
            <div className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-0.5 inline-block"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Connect
            </h4>
            <div className="flex flex-col gap-2.5">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 group"
                  aria-label={link.ariaLabel}
                >
                  <span className="w-9 h-9 rounded-lg border border-border/60 bg-background/50 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-200">
                    {link.svg}
                  </span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-12 md:mt-16 pt-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
            <p className="text-[11px]">
              Built with Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
