import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-6 mt-auto">
      <div className="container mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/projects" className="hover:text-foreground transition-colors">
            Projects
          </Link>
          <Link href="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link href="/hire-me" className="hover:text-foreground transition-colors">
            Hire Me
          </Link>
        </div>
      </div>
    </footer>
  );
}
