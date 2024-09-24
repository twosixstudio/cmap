import { CreateNote } from "./_components/create-note/create-note";
import { NoteList } from "./_components/note-list/note-list";

export function ProjectNotes(props: { projectId: string }) {
  return (
    <div className="flex flex-col gap-4">
      <CreateNote projectId={props.projectId} />
      <NoteList projectId={props.projectId} />
    </div>
  );
}
