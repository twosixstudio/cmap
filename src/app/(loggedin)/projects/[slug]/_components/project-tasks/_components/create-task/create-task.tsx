"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import { createTask } from "~/server/services/task-services";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";

type FormProps = {
  name: string;
};

export function CreateTask(props: { projectId: string }) {
  const router = useRouter();
  const form = useForm<FormProps>({ defaultValues: { name: "" } });
  const taskCreate = useSWRMutation(
    "task-create",
    async (_, { arg }: { arg: FormProps }) => createTask(props.projectId, arg),
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
      <h2 className="font-bold">Quick Add</h2>
      <form
        onSubmit={form.handleSubmit((data) => taskCreate.trigger(data))}
        className="flex gap-2"
      >
        <Controller
          name="name"
          control={form.control}
          render={({ field }) => (
            <Input
              type="text"
              placeholder="Name"
              disabled={taskCreate.isMutating}
              {...field}
            />
          )}
        />
        <Button disabled={taskCreate.isMutating}>
          {taskCreate.isMutating ? "Loading..." : "Add Task"}
        </Button>
      </form>
    </div>
  );
}
