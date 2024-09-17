"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Task } from "~/server/services/task-services";
import { Button } from "~/ui/button";
import { DataTable } from "~/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/ui/dropdown-menu";

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "users",
    header: "Assignees",
    cell: ({ cell }) => <div>{cell.row.original.users.map((x) => x.name)}</div>,
  },
  {
    accessorKey: "project.name",
    header: "Project",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ cell }) => {
      const label = {
        todo: "Todo",
        done: "Done",
        in_progress: "In Progress",
      };
      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {label[cell.row.original.status]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Change status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(label).map((x) => (
                <DropdownMenuItem key={x[0]}>{x[1]}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export function TaskTable(props: { tasks: Task[] }) {
  return <DataTable columns={columns} data={props.tasks} />;
}
