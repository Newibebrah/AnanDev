"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/cn";
import { Button } from "@/app/components/ui/button";
import { signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/projects", label: "Projects", icon: "📁" },
  { href: "/admin/blog", label: "Blog", icon: "📝" },
  { href: "/admin/comments", label: "Comments", icon: "💬" },
  { href: "/admin/messages", label: "Messages", icon: "✉️" },
  { href: "/admin/errors", label: "Error Logs", icon: "⚠️" },
  { href: "/admin/chat", label: "Chat", icon: "💭" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const sidebarContent = (
    <>
      <div className="p-4 border-b flex items-center justify-between">
        <Link href="/admin/dashboard" className="font-bold text-lg">
          Admin Panel
        </Link>
      </div>

      <nav className="flex-1 p-2 space-y-1" aria-label="Admin navigation">
        {sidebarLinks.map((link) => (
          <Button
            key={link.href}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3",
              pathname === link.href && "bg-accent text-accent-foreground"
            )}
            asChild
          >
            <Link href={link.href} onClick={closeMobile}>
              <span aria-hidden="true">{link.icon}</span>
              {link.label}
            </Link>
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/" onClick={closeMobile}>View Site</Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full text-destructive hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md border border-input bg-background shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-expanded={mobileOpen}
        aria-controls="admin-sidebar"
        aria-label={mobileOpen ? "Close admin menu" : "Open admin menu"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {mobileOpen ? (
            <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>
          ) : (
            <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>
          )}
        </svg>
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="admin-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r bg-card flex flex-col transition-transform duration-300 md:static md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
