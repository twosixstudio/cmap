import { getProjectNotes } from "~/server/services/note-services";
import { Note } from "./_components/note/note";

export async function NoteList(props: { projectId: string }) {
  const data = await getProjectNotes({ projectId: props.projectId });
  if (!data.success) return <div>Oh no</div>;
  return (
    <div className="flex flex-col gap-4">
      {data.data.map((x) => (
        <Note key={x.id} note={x} />
      ))}
    </div>
  );
}
