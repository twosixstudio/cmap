"use client";
import { useRouter } from "next/navigation";
import { deleteProject } from "~/server/services/project-services";
import { Button } from "~/ui/button";

export function ProjectDelete(props: { projectId: string }) {
  const router = useRouter();
  async function handleDelete() {
    const res = await deleteProject(props.projectId);
    if (res.success) {
      router.push("/projects");
      router.refresh();
    }
    if (!res.success) {
      alert("Oh no :/");
    }
  }
  return (
    <div>
      <Button onClick={() => handleDelete()}>Delete Project</Button>
    </div>
  );
}
