"use server";
import { auth } from "@/auth";
import { db } from "../../db";
import { tasks, taskUsers } from "../../db/schema";
import type { ServerReponse, Task, TaskStatusTypes } from "../../types";
import { eq } from "drizzle-orm";
import { handleError } from "~/utils/handle-error";

export async function getTasksForProject(projectId: string): Promise<Task[]> {
  const tasks = await db.query.tasks.findMany({
    where: (table, fn) => fn.eq(table.projectId, projectId),
    with: { users: { with: { user: true } }, project: true },
    orderBy: (tasks, { asc }) => [asc(tasks.createdAt)],
  });

  return tasks.map((x) => ({
    id: x.id,
    name: x.name,
    status: x.status,
    users: x.users.map((x) => x.user),
    project: {
      name: x.project.name,
    },
    createdAt: x.createdAt,
  }));
}

interface CreateTaskData {
  name: string;
}

export async function createTask(
  projectId: string,
  data: CreateTaskData,
): Promise<ServerReponse<{ message: string }>> {
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

      return { success: true, data: { message: "Task created" } };
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

export async function deleteTask(taskId: string) {
  // Start a transaction to ensure data consistency
  try {
    await db.transaction(async (tx) => {
      // First, delete related records in the taskUsers table
      await tx.delete(taskUsers).where(eq(taskUsers.taskId, taskId));
      // Then, delete the task itself
      await tx.delete(tasks).where(eq(tasks.id, taskId));
    });
  } catch (error) {
    return handleError(error);
  }
}
