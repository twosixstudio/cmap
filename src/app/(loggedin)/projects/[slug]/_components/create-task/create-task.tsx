"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { createTask } from "~/server/services/task-services";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";

type FormProps = {
  name: string;
};

export function CreateTask(props: { projectId: string }) {
  const router = useRouter();
  const form = useForm<FormProps>({ defaultValues: { name: "" } });

  async function onSubmit(data: FormProps) {
    await createTask(props.projectId, data);
    form.reset();
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold">Quick Add</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field }) => (
            <Input type="text" placeholder="Name" {...field} />
          )}
        />
        <Button>Add Task</Button>
      </form>
    </div>
  );
}
