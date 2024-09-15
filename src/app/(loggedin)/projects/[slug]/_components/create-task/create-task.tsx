"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { createTask } from "~/server/api/test";

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
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={form.control}
          render={({ field }) => (
            <input type="text" placeholder="title" {...field} />
          )}
        />
        <button>Add</button>
      </form>
    </div>
  );
}
