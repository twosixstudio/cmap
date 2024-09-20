"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteProject } from "~/server/services/project-services";
import { Button } from "~/ui/button";
import useSWRMutation from "swr/mutation";

export function ProjectDelete(props: { projectId: string }) {
  const router = useRouter();

  const { trigger, isMutating } = useSWRMutation(
    "/api/user",
    () => deleteProject(props.projectId),
    {
      onSuccess: (res) => {
        router.push("/projects");
        router.refresh();
        if (res.success) {
          toast(res.data.message);
        }
        if (!res.success) {
          alert(res.data.error);
        }
      },
      onError: () => {
        console.log("ok");
      },
    },
  );

  return (
    <Button onClick={() => trigger()}>
      {isMutating ? "Loading..." : "Delete Project"}
    </Button>
  );
}
