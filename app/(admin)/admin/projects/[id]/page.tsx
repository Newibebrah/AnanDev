import { notFound } from "next/navigation";
import { getProjectById } from "@/app/actions/project.actions";
import { ProjectForm } from "@/app/components/admin/project-form";

export const dynamic = "force-dynamic";

export default async function AdminProjectFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const project = isNew ? null : await getProjectById(id);

  if (!isNew && !project) notFound();

  return <ProjectForm project={project} />;
}
