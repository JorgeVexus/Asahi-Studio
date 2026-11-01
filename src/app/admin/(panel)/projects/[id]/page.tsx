import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { listProjects } from "@/lib/content/queries";
import { projectImage } from "@/lib/content/local-images";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") {
    return (
      <>
        <h1 className="mb-6 font-display text-3xl font-semibold">Nuevo proyecto</h1>
        <ProjectForm />
      </>
    );
  }
  const project = (await listProjects()).find((p) => p.id === id);
  if (!project) notFound();
  return (
    <>
      <h1 className="mb-6 font-display text-3xl font-semibold">{project.title_es}</h1>
      <ProjectForm project={project} imageSrc={projectImage(project)} />
    </>
  );
}
