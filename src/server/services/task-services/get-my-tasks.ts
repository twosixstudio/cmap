"use server";
import { auth } from "@/auth";
import { eq, inArray } from "drizzle-orm";
import { db } from "~/server/db";
import { projects, tasks, taskUsers, users } from "~/server/db/schema";
import { CustomError, type ServerReponse, type Task } from "~/server/types";
import { handleError } from "~/utils/handle-error";

export async function getMyTasks(): Promise<ServerReponse<Task[]>> {
  try {
    const session = await auth();
    if (!session) {
      throw new CustomError("User authentication failed.", 401);
    }

    return await db.transaction(async (tx) => {
      // Step 1: Get task IDs assigned to the current user
      const userTaskIdsResult = await tx
        .select({ taskId: taskUsers.taskId })
        .from(taskUsers)
        .where(eq(taskUsers.userId, session.user.id));

      const userTaskIds = userTaskIdsResult.map((row) => row.taskId);

      if (userTaskIds.length === 0) {
        // The user has no tasks assigned
        return {
          data: [],
          success: true,
        };
      }

      // Step 2: Fetch tasks and all associated users
      const tasksWithUsers = await tx
        .select({
          id: tasks.id,
          name: tasks.name,
          status: tasks.status,
          createdAt: tasks.createdAt,
          projectName: projects.name,
          userId: users.id,
          userName: users.name,
          userEmail: users.email,
          userEmailVerified: users.emailVerified,
          userImage: users.image,
        })
        .from(tasks)
        .innerJoin(projects, eq(tasks.projectId, projects.id))
        .innerJoin(taskUsers, eq(taskUsers.taskId, tasks.id))
        .innerJoin(users, eq(taskUsers.userId, users.id))
        .where(inArray(tasks.id, userTaskIds));

      // Organize tasks and their associated users
      const taskMap = new Map<string, Task>();

      tasksWithUsers.forEach((row) => {
        const taskId = row.id;
        if (!taskMap.has(taskId)) {
          taskMap.set(taskId, {
            id: row.id,
            name: row.name,
            status: row.status,
            createdAt: row.createdAt,
            project: { name: row.projectName },
            users: [],
          });
        }
        const task = taskMap.get(taskId)!;

        task.users.push({
          id: row.userId,
          name: row.userName,
          email: row.userEmail,
          emailVerified: row.userEmailVerified,
          image: row.userImage,
        });
      });

      const formatted: ServerReponse<Task[]> = {
        data: Array.from(taskMap.values()),
        success: true,
      };

      return formatted;
    });
  } catch (error) {
    return handleError(error);
  }
}
