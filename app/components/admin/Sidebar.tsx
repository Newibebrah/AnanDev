"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/cn";
import { Button } from "@/app/components/ui/button";
import { signOut } from "next-auth/react";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/projects", label: "Projects", icon: "📁" },
  { href: "/admin/blog", label: "Blog", icon: "📝" },
  { href: "/admin/comments", label: "Comments", icon: "💬" },
  { href: "/admin/messages", label: "Messages", icon: "✉️" },
  { href: "/admin/errors", label: "Error Logs", icon: "⚠️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card min-h-screen flex flex-col">
      <div className="p-4 border-b">
        <Link href="/admin/dashboard" className="font-bold text-lg">
          Admin Panel
        </Link>
      </div>

      <nav className="flex-1 p-2 space-y-1">
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
            <Link href={link.href}>
              <span>{link.icon}</span>
              {link.label}
            </Link>
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/">View Site</Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full text-destructive hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
