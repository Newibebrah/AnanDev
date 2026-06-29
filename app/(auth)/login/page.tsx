"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Invalid username or password");
      setLoading(false);
    } else {
      let redirectTo = "/admin/dashboard";
      const callbackUrl = searchParams.get("callbackUrl");
      if (callbackUrl) {
        try {
          const parsed = new URL(callbackUrl, window.location.origin);
          const allowed = ["/admin", "/admin/dashboard", "/admin/projects", "/admin/blog", "/admin/comments", "/admin/messages", "/admin/errors", "/admin/chat"];
          if (allowed.some((p) => parsed.pathname.startsWith(p))) {
            redirectTo = callbackUrl;
          }
        } catch {}
      }
      router.push(redirectTo);
      router.refresh();
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="admin" required autoComplete="off" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="off"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
