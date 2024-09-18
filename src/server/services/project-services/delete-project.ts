"use server";
import { auth } from "@/auth";
import { eq, inArray } from "drizzle-orm";
import { db } from "~/server/db";
import { projects, projectUsers, tasks, taskUsers } from "~/server/db/schema";
import type { ServerReponse } from "~/server/types";
import { handleError } from "~/utils/handle-error";

/**
 * Deletes a project along with all its related tasks, task users, and project users,
 * ensuring that the user has the appropriate permissions to do so.
 *
 * This function performs a transactional deletion of:
 * 1. Verifying the user's role in the project.
 * 2. All task users associated with the tasks belonging to the project.
 * 3. All tasks that are part of the project.
 * 4. All users associated with the project (via the `projectUsers` table).
 * 5. The project itself.
 *
 * The operation is wrapped in a transaction to ensure that either all the deletions
 * occur, or none do, thereby maintaining data consistency in case of errors.
 *
 * @param {string} projectId - The unique identifier of the project to be deleted.
 * @returns {Promise<ServerReponse<unknown>>} - A response object indicating the success or failure of the operation.
 *
 * @throws {Error} If the user is not authenticated, not authorized, or any part of the transaction fails.
 */
const DEFAULT_ALLOWED_ROLES = ["owner"]; // Define default roles for deletion

export async function deleteProject(
  projectId: string,
): Promise<ServerReponse<unknown>> {
  try {
    // Step 1: Authenticate the user
    const session = await auth();
    if (!session) throw Error("Authentication failed");

    // Step 2: Check if the user has the correct role to delete the project
    await checkUserRoleForProject(
      session.user.id,
      projectId,
      DEFAULT_ALLOWED_ROLES,
    );

    // Step 3: Perform deletion in a transaction
    const res = await db.transaction(async (tx) => {
      // Fetch all task IDs related to the project
      const tasksList = await tx.query.tasks.findMany({
        where: (table, fn) => fn.eq(table.projectId, projectId),
        columns: { id: true },
      });

      const taskIds = tasksList.map((task) => task.id);

      // Delete associated taskUsers if there are tasks
      if (taskIds.length > 0) {
        await tx.delete(taskUsers).where(inArray(taskUsers.taskId, taskIds));
      }

      // Delete tasks, project users, and the project itself
      await tx.delete(tasks).where(eq(tasks.projectId, projectId));
      await tx
        .delete(projectUsers)
        .where(eq(projectUsers.projectId, projectId));
      await tx.delete(projects).where(eq(projects.id, projectId));

      return { message: "Project deleted successfully" };
    });

    return { success: true, data: res };
  } catch (error) {
    // Catch and handle errors, returning the error response
    return handleError(error);
  }
}

/**
 * Checks if the user has one of the specified roles for the given project.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} projectId - The ID of the project.
 * @param {string[]} allowedRoles - A list of roles that are allowed to delete the project.
 * @throws {Error} If the user is not linked to the project or does not have one of the allowed roles.
 */
async function checkUserRoleForProject(
  userId: string,
  projectId: string,
  allowedRoles: string[],
) {
  const user = await db.query.projectUsers.findFirst({
    where: (table, fn) =>
      fn.and(fn.eq(table.projectId, projectId), fn.eq(table.userId, userId)),
  });

  // Ensure the user is part of the project and has a valid role
  if (!user?.role) throw Error("User is not part of this project");

  // Check if the user's role is in the allowedRoles list
  if (!allowedRoles.includes(user.role)) {
    throw Error(
      `User does not have sufficient permissions. Allowed roles: ${allowedRoles.join(", ")}`,
    );
  }
}
