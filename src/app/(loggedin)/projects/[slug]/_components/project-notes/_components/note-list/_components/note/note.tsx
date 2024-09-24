"use client";

import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import { deleteNote } from "~/server/services/note-services/delete-note";
import { type Note } from "~/server/types";
import { Button } from "~/ui/button";

export function Note({ note }: { note: Note }) {
  const route = useRouter();
  const noteDelete = useSWRMutation(
    `delete-note/${note.id}`,
    () => deleteNote(note.id),
    {
      onSuccess: (res) => {
        if (res.success) {
          toast.success(res.data.message);
          route.refresh();
        } else {
          toast.error(res.error.message);
        }
      },
    },
  );
  return (
    <div
      className="flex justify-between gap-4 rounded-md border p-4"
      key={note.id}
    >
      <div>
        <p className="font-bold">{note.title}</p>
        <p className="mb-2 text-sm text-muted-foreground">
          {new Date(note.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="whitespace-pre-wrap">{note.content}</p>
      </div>
      <Button
        disabled={noteDelete.isMutating}
        size="icon"
        variant="destructive"
        className="shrink-0"
        onClick={() => noteDelete.trigger()}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
}
