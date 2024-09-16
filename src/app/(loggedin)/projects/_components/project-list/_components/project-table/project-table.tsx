"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/ui/table";

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
  const table = useReactTable({
    data: props.projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
