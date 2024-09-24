import { CreateNote } from "./_components/create-note/create-note";

export function ProjectNotes(props: { projectId: string }) {
  return (
    <div>
      <CreateNote projectId={props.projectId} />
    </div>
  );
}
