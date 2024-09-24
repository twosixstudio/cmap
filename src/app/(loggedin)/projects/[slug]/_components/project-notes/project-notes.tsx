import { CreateNote } from "./_components/create-note/create-note";
import { NoteList } from "./_components/note-list/note-list";

export function ProjectNotes(props: { projectId: string }) {
  return (
    <div>
      <CreateNote projectId={props.projectId} />
      <NoteList projectId={props.projectId} />
    </div>
  );
}
