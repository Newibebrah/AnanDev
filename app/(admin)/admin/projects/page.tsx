import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { getProjects, deleteProject, toggleProjectFeatured } from "@/app/actions/project.actions";
import { formatDate } from "@/app/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">New Project</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4 font-medium text-sm">Title</th>
                <th className="p-4 font-medium text-sm hidden md:table-cell">Featured</th>
                <th className="p-4 font-medium text-sm hidden lg:table-cell">Date</th>
                <th className="p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b last:border-0">
                  <td className="p-4">
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-muted-foreground">/{project.slug}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {project.isFeatured ? "⭐" : "—"}
                  </td>
                  <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">
                    {formatDate(project.createdAt)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <form action={toggleProjectFeatured.bind(null, project.id)}>
                        <Button type="submit" variant="ghost" size="sm">
                          {project.isFeatured ? "Unfeature" : "Feature"}
                        </Button>
                      </form>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/projects/${project.id}`}>Edit</Link>
                      </Button>
                      <form action={deleteProject.bind(null, project.id)}>
                        <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No projects yet. Create your first project!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
