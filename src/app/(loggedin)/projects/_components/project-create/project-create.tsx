"use client";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { createProject } from "~/server/api";

type FormProps = {
  name: string;
};

export function ProjectCreate() {
  const router = useRouter();
  const form = useForm<FormProps>({ defaultValues: { name: "" } });

  async function onSubmit(data: FormProps) {
    await createProject(data.name, "");
    form.reset();
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-10 pt-20">
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
