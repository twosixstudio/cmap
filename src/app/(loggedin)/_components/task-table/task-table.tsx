"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  deleteTask,
  updateTaskStatus,
  type Task,
} from "~/server/services/task-services";
import type { TaskStatusTypes } from "~/server/types";
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
    cell: ({ cell }) => (
      <div>
        {cell.row.original.users.map((x) => (
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
    accessorKey: "project.name",
    header: "Project",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <TaskStatusButton
        taskId={row.original.id}
        currentStatus={row.original.status}
      />
    ),
  },
  {
    accessorKey: "delete",
    header: "Delete",
    cell: ({ row }) => {
      return <DeleteTaskButton taskId={row.original.id} />;
    },
  },
];

export function TaskTable(props: { tasks: Task[] }) {
  return <DataTable columns={columns} data={props.tasks} />;
}

function DeleteTaskButton(props: { taskId: string }) {
  const router = useRouter();
  async function handleDelete() {
    await deleteTask(props.taskId);
    router.refresh();
  }
  return (
    <Button variant="destructive" size="sm" onClick={() => handleDelete()}>
      <Trash2Icon className="w-5" />
    </Button>
  );
}

function TaskStatusButton(props: {
  currentStatus: TaskStatusTypes;
  taskId: string;
}) {
  const router = useRouter();
  const label: Record<TaskStatusTypes, string> = {
    todo: "Todo",
    in_progress: "In Progress",
    done: "Done",
  };

  async function handleStatusUpdate(status: TaskStatusTypes) {
    await updateTaskStatus({
      newStatus: status,
      taskId: props.taskId,
    });
    router.refresh();
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {label[props.currentStatus]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Change status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.entries(label) as [TaskStatusTypes, string][]).map(
          ([key, value]) => (
            <DropdownMenuItem key={key} onClick={() => handleStatusUpdate(key)}>
              {value}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
