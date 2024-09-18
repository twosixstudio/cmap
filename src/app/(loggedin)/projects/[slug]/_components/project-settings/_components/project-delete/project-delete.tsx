"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteProject } from "~/server/services/project-services";
import { Button } from "~/ui/button";

export function ProjectDelete(props: { projectId: string }) {
  const router = useRouter();
  async function handleDelete() {
    const res = await deleteProject(props.projectId);
    console.log(res);
    if (res.success) {
      router.push("/projects");
      router.refresh();
      toast(res.data.message);
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
