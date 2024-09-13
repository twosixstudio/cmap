import Link from "next/link";

export type ProjectListItemProps = {
  name: string | null;
  id: string;
};

export function ProjectListItem(props: ProjectListItemProps) {
  return (
    <Link
      href={`/projects/${props.id}`}
      className="rounded-md bg-slate-100 p-4 transition-colors hover:bg-slate-200 hover:underline"
    >
      {props.name ? props.name : "No name :("}
    </Link>
  );
}
