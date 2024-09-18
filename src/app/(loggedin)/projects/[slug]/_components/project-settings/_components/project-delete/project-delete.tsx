"use client";
import { useRouter } from "next/navigation";
import { deleteProject } from "~/server/services/project-services";
import { Button } from "~/ui/button";

export function ProjectDelete(props: { projectId: string }) {
  const router = useRouter();
  async function handleDelete() {
    await deleteProject(props.projectId);
    router.push("/projects");
    router.refresh();
  }
  return (
    <div>
      <Button onClick={() => handleDelete()}>Delete Project</Button>
    </div>
  );
}
