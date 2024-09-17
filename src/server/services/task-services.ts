"use server";
import { auth } from "@/auth";
import { db } from "../db";
import { tasks, taskUsers } from "../db/schema";
import type { TaskStatusTypes } from "../types";
import { eq } from "drizzle-orm";
import { handleError } from "~/utils/handle-error";

export type Task = {
  id: string;
  name: string;
  status: TaskStatusTypes;
  users: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  }[];
  project: { name: string | null };
};

export async function getTasksForProject(projectId: string): Promise<Task[]> {
  const tasks = await db.query.tasks.findMany({
    where: (table, fn) => fn.eq(table.projectId, projectId),
    with: { users: { with: { user: true } }, project: true },
  });

  return tasks.map((x) => ({
    id: x.id,
    name: x.name,
    status: x.status,
    users: x.users.map((x) => x.user),
    project: {
      name: x.project.name,
    },
  }));
}

export async function getMyTasks(): Promise<Task[]> {
  const session = await auth();
  if (!session) {
    console.error("Authentication failed: no session");
    throw new Error("User authentication failed.");
  }
  const taskList = await db.query.taskUsers.findMany({
    where: (table, fn) => fn.eq(table.userId, session.user.id),
    with: {
      task: { with: { project: true, users: { with: { user: true } } } },
    },
  });

  return taskList.map((x) => ({
    id: x.taskId,
    name: x.task.name,
    status: x.task.status,
    users: x.task.users.map((x) => x.user),
    project: {
      name: x.task.project.name,
    },
  }));
}

interface CreateTaskData {
  name: string;
}

export async function createTask(projectId: string, data: CreateTaskData) {
  const session = await auth();
  if (!session) {
    console.error("Authentication failed: no session");
    throw new Error("User authentication failed.");
  }

  try {
    return await db.transaction(async (trx) => {
      // Validate data
      if (!data.name) {
        throw new Error("Task name is required");
      }

      // Create the task
      const taskList = await trx
        .insert(tasks)
        .values({ ...data, projectId, status: "todo" })
        .returning();

      if (!taskList || taskList.length === 0) {
        throw new Error("Failed to create task: no task returned from insert");
      }

      const taskId = taskList[0]?.id;
      if (!taskId) {
        throw new Error("Failed to create task: taskId is undefined");
      }

      // Assign the task to the user
      await trx.insert(taskUsers).values({
        taskId,
        userId: session.user.id,
      });

      return { success: true, data: taskList[0] };
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function updateTaskStatus(props: {
  taskId: string;
  newStatus: TaskStatusTypes;
}) {
  try {
    const result = await db
      .update(tasks)
      .set({ status: props.newStatus })
      .where(eq(tasks.id, props.taskId))
      .returning();

    if (result.length > 0) {
      return { success: true, data: result[0] }; // Return the updated task
    } else {
      throw new Error("Task not found or update failed.");
    }
  } catch (error) {
    return handleError(error);
  }
}
