"use client";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable } from "~/ui/data-table";

type Project = {
  id: string;
  name: string | null;
  members: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  }[];
  owners: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  }[];
};

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link href={`/projects/${row.original.id}`} className="underline">
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "owners",
    header: "Owners",
    cell: ({ cell }) => (
      <pre>{cell.row.original.owners.map((x) => x.name)}</pre>
    ),
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ cell }) => (
      <pre>{cell.row.original.members.map((x) => x.name)}</pre>
    ),
  },
];

export function ProjectTable(props: { projects: Project[] }) {
  return <DataTable columns={columns} data={props.projects} />;
}
