import { getProjectNotes } from "~/server/services/note-services";

export async function NoteList(props: { projectId: string }) {
  const data = await getProjectNotes({ projectId: props.projectId });
  if (!data.success) return <div>Oh no</div>;
  return (
    <div className="flex flex-col gap-4">
      {data.data.map((x) => (
        <div className="rounded-md border p-4" key={x.id}>
          <p className="font-bold">{x.title}</p>
          <p className="whitespace-pre-wrap">{x.content}</p>
        </div>
      ))}
    </div>
  );
}
