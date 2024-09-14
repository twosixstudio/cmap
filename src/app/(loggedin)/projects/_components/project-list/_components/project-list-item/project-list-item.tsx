import Link from "next/link";

export type ProjectListItemProps = {
  name: string | null;
  id: string;
  role: "admin" | "member" | "owner" | null;
};

export function ProjectListItem(props: ProjectListItemProps) {
  return (
    <Link
      href={`/projects/${props.id}`}
      className="flex flex-col items-start rounded-md bg-slate-100 p-4 transition-colors hover:bg-slate-200 hover:underline"
    >
      {props.role && (
        <div className="rounded-md bg-slate-700 px-2 py-1 text-xs font-bold uppercase text-white">
          {props.role}
        </div>
      )}
      {props.name ? props.name : "No name :("}
    </Link>
  );
}
