"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import { createNote } from "~/server/services/note-services";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";
import { Textarea } from "~/ui/text-area";

type FormProps = {
  title: string;
  content: string;
};

export function CreateNote(props: { projectId: string }) {
  const router = useRouter();
  const form = useForm({ defaultValues: { title: "", content: "" } });

  const noteCreate = useSWRMutation(
    "note-create",
    (_, { arg }: { arg: FormProps }) =>
      createNote({ projectId: props.projectId, data: arg }),
    {
      onSuccess: (res) => {
        if (res.success) {
          router.refresh();
          form.reset();
          toast.success(res.data.message);
        } else {
          toast.error(res.error.message);
        }
      },
    },
  );

  return (
    <div>
      Create Note
      <form
        className="flex flex-col items-start gap-2"
        onSubmit={form.handleSubmit((d) => noteCreate.trigger(d))}
      >
        <Controller
          control={form.control}
          name="title"
          render={({ field }) => <Input placeholder="Title" {...field} />}
        />
        <Controller
          control={form.control}
          name="content"
          render={({ field }) => <Textarea placeholder="Content" {...field} />}
        />
        <Button>Add note</Button>
      </form>
    </div>
  );
}
