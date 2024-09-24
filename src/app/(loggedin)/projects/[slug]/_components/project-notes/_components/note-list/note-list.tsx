import { getProjectNotes } from "~/server/services/note-services";

export async function NoteList(props: { projectId: string }) {
  const data = await getProjectNotes({ projectId: props.projectId });
  if (!data.success) return <div>Oh no</div>;
  return (
    <div>
      {data.data.map((x) => (
        <div key={x.id}>{x.title}</div>
      ))}
    </div>
  );
}
