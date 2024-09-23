"use client";
import { Button } from "~/ui/button";
import useSWRMutation from "swr/mutation";
import { deleteProject } from "~/server/services/project-services";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ProjectDelete(props: { projectId: string }) {
  const router = useRouter();
  const test = useSWRMutation(
    `/deleteproject/${props.projectId}`,
    () => deleteProject(props.projectId),
    {
      onSuccess: (res) => {
        if (res.success) {
          router.push("/projects");
          router.refresh();
          toast.success(res.data.message);
        } else {
          toast.error(res.error.message);
        }
      },
    },
  );

  return (
    <div>
      <Button onClick={async () => test.trigger()}>
        {test.isMutating ? "Deleting..." : "Delete Project"}
      </Button>
    </div>
  );
}
