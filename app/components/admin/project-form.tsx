"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { CancelButton } from "@/app/components/ui/cancel-button";
import { MarkdownToolbar } from "@/app/components/admin/markdown-toolbar";
import { createProject, updateProject } from "@/app/actions/project.actions";
import { validateProject } from "@/app/lib/client-validate";
import type { Project } from "@prisma/client";
import type { ActionResult } from "@/app/lib/form-types";
import { toast } from "sonner";

interface ProjectFormProps {
  project?: Project | null;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const isNew = !project;
  const router = useRouter();
  const action = isNew
    ? createProject
    : updateProject.bind(null, project.id);

  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const clientErrors = validateProject(formData);
      if (clientErrors) return clientErrors;
      return action(formData);
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/projects");
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">
        {isNew ? "New Project" : "Edit Project"}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); formAction(new FormData(e.currentTarget)); }} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={project?.title}
                placeholder="Project title"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="slug">Slug (optional)</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={project?.slug}
                placeholder="auto-generated from title"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={project?.description}
                placeholder="Brief description"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="project-content">Content (Markdown)</Label>
              <MarkdownToolbar textareaId="project-content" />
              <Textarea
                id="project-content"
                name="content"
                defaultValue={project?.content}
                placeholder="Full project details in Markdown..."
                rows={12}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                defaultValue={project?.thumbnail || ""}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="techStack">Tech Stack (JSON array)</Label>
              <Input
                id="techStack"
                name="techStack"
                defaultValue={project?.techStack || "[]"}
                placeholder='["React", "Node.js", "PostgreSQL"]'
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="demoUrl">Demo URL</Label>
                <Input
                  id="demoUrl"
                  name="demoUrl"
                  defaultValue={project?.demoUrl || ""}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  defaultValue={project?.githubUrl || ""}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={project?.isFeatured || false}
              />
              <span className="text-sm">Featured</span>
            </label>

            <div className="flex gap-4 pt-2">
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : isNew ? "Create Project" : "Update Project"}
              </Button>
              <CancelButton />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
