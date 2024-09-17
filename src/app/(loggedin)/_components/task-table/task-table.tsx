"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  CircleCheckIcon,
  CircleEllipsisIcon,
  CircleIcon,
  Clock3Icon,
  LucideIcon,
  Trash2Icon,
} from "lucide-react";
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
import { cn } from "~/utils/cn";

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
    size: 10,
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

  const info: Record<
    TaskStatusTypes,
    { label: string; icon: (props: { className: string }) => React.ReactNode }
  > = {
    todo: {
      label: "Todo",
      icon: (props) => (
        <CircleIcon
          className={cn(
            "fill-slate-100 stroke-slate-400 group-hover:fill-slate-200 group-hover:stroke-slate-500",
            props.className,
          )}
        />
      ),
    },
    in_progress: {
      label: "In Progress",
      icon: (props) => (
        <Clock3Icon
          className={cn(
            "fill-yellow-100 stroke-yellow-600 group-hover:fill-yellow-200 group-hover:stroke-yellow-700",
            props.className,
          )}
        />
      ),
    },
    done: {
      label: "Done",
      icon: (props) => (
        <CircleCheckIcon
          className={cn(
            "fill-green-100 stroke-green-600 group-hover:fill-green-200 group-hover:stroke-green-700",
            props.className,
          )}
        />
      ),
    },
  };

  async function handleStatusUpdate(status: TaskStatusTypes) {
    await updateTaskStatus({
      newStatus: status,
      taskId: props.taskId,
    });
    router.refresh();
  }
  const Icon = info[props.currentStatus].icon;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" size="sm" className="group -ml-3">
          <Icon className="w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        align="start"
      >
        <DropdownMenuLabel>Change status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(
          Object.entries(info) as [
            TaskStatusTypes,
            {
              label: string;
              icon: (props: { className: string }) => React.ReactNode;
            },
          ][]
        ).map(([key, value]) => {
          const Icon = value.icon;
          return (
            <DropdownMenuItem
              className="flex gap-1 text-sm text-muted-foreground"
              key={key}
              onClick={() => handleStatusUpdate(key)}
            >
              <Icon className="w-5" /> {value.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
