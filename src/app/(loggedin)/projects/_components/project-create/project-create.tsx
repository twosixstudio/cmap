"use client";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import { createProject } from "~/server/services/project-services";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";

type FormProps = {
  name: string;
};

export function ProjectCreate() {
  const router = useRouter();
  const form = useForm<FormProps>({ defaultValues: { name: "" } });
  const projectCreate = useSWRMutation(
    "project-create",
    async (_, props: { arg: FormProps }) => {
      return createProject(props.arg.name);
    },
    {
      onSuccess: (res) => {
        if (res.success) {
          form.reset();
          router.refresh();
          toast.success(res.data.message);
        } else {
          toast.error(res.error.message);
        }
      },
    },
  );

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold">Add Project</h2>
      <form
        onSubmit={form.handleSubmit((data) => projectCreate.trigger(data))}
        className="flex gap-2"
      >
        <Controller
          name="name"
          control={form.control}
          render={({ field }) => (
            <Input
              type="text"
              placeholder="Name"
              disabled={projectCreate.isMutating}
              {...field}
            />
          )}
        />
        <Button disabled={projectCreate.isMutating}>Add</Button>
      </form>
    </div>
  );
}
