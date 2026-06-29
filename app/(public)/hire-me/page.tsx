"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { submitMessage } from "@/app/actions/message.actions";
import { validateMessage } from "@/app/lib/client-validate";
import type { ActionResult } from "@/app/lib/form-types";
import { toast } from "sonner";

export default function HireMePage() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const clientErrors = validateMessage(formData);
      if (clientErrors) return clientErrors;
      return submitMessage(formData);
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Hire Me</h1>
      <p className="text-muted-foreground mb-8">
        Have a project in mind? Let&apos;s work together.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Email</p>
              <a
                href="mailto:lionasananta@gmail.com"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                lionasananta@gmail.com
              </a>
            </div>
            <div>
              <p className="text-sm font-medium">Instagram</p>
              <a
                href="https://instagram.com/anandcaprio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                @yourhandle
              </a>
            </div>
            <div>
              <p className="text-sm font-medium">GitHub</p>
              <a
                href="https://github.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                github.com/yourhandle
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              I am currently open to freelance projects and full-time opportunities.
              Feel free to reach out and let&apos;s discuss your project!
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Send a Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); formAction(new FormData(e.currentTarget)); }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your name" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="your@email.com" required />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="content">Message</Label>
              <Textarea id="content" name="content" placeholder="Tell me about your project..." required rows={6} />
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
