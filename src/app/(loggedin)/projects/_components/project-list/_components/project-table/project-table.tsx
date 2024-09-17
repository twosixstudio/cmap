"use client";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
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
        {row.getValue("name") ? row.getValue("name") : "No name"}
      </Link>
    ),
  },
  {
    accessorKey: "owners",
    header: "Owners",
    cell: ({ cell }) => (
      <div>
        {cell.row.original.owners.map((x) => (
          <Image
            className="rounded-full"
            key={x.id}
            height={30}
            width={30}
            src={x.image ?? ""}
            alt={x.name ?? ""}
          />
        ))}
      </div>
    ),
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ cell }) => (
      <div>
        {cell.row.original.members.map((x) => (
          <Image
            className="rounded-full"
            key={x.id}
            height={30}
            width={30}
            src={x.image ?? ""}
            alt={x.name ?? ""}
          />
        ))}
      </div>
    ),
  },
];

export function ProjectTable(props: { projects: Project[] }) {
  return <DataTable columns={columns} data={props.projects} />;
}
