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
 * 1. Verifying user authentication and checking their association and role in the project.
 * 2. All task users associated with the tasks belonging to the project.
 * 3. All tasks that are part of the project.
 * 4. All users associated with the project (via the `projectUsers` table).
 * 5. The project itself.
 *
 * The operation is wrapped in a transaction to ensure that either all the deletions
 * occur, or none do, thereby maintaining data consistency in case of errors.
 *
 * Steps involved:
 * - Authenticate the user.
 * - Check if the authenticated user is linked to the project.
 * - Ensure the user has the `owner` role to authorize deletion.
 * - Fetch all task IDs associated with the given project.
 * - If there are any tasks, delete the corresponding task users.
 * - Delete all tasks linked to the project.
 * - Delete all users linked to the project.
 * - Finally, delete the project itself.
 *
 * @param {string} projectId - The unique identifier of the project to be deleted.
 * @returns {Promise<ServerReponse<unknown>>} - A response object indicating the success or failure of the operation.
 *
 * @throws Will propagate any error encountered during the transaction. Errors are caught and handled through `handleError`.
 *          - Throws "No auth" if the user is not authenticated.
 *          - Throws "User not linked to project" if the user is not part of the project.
 *          - Throws "User not allowed" if the user does not have the `owner` role.
 */
export async function deleteProject(
  projectId: string,
): Promise<ServerReponse<unknown>> {
  try {
    // Step 1: Authenticate the user
    const session = await auth();
    if (!session) throw Error("No auth");

    // Step 2: Verify the user is linked to the project and has the 'owner' role
    const res = await db.transaction(async (tx) => {
      // Find the user in the projectUsers table, making sure they belong to this project
      const user = await tx.query.projectUsers.findFirst({
        where: (table, fn) =>
          fn.and(
            fn.eq(table.projectId, projectId),
            fn.eq(table.userId, session.user.id), // Ensure the user is part of the project
          ),
      });

      // If the user is not linked to the project, throw an error
      if (!user) throw Error("User not linked to project");

      // If the user is linked but is not the owner, throw an error
      if (user.role !== "owner") throw Error("User not allowed");

      // Step 3: Fetch all task IDs related to the project
      const tasksList = await tx.query.tasks.findMany({
        where: (table, fn) => fn.eq(table.projectId, projectId),
        columns: { id: true },
      });

      // Extract the task IDs into an array
      const taskIds = tasksList.map((task) => task.id);

      // Step 4: If there are tasks, delete associated taskUsers
      if (taskIds.length > 0) {
        // Bulk delete all taskUsers associated with the fetched task IDs
        await tx.delete(taskUsers).where(inArray(taskUsers.taskId, taskIds));
      }

      // Step 5: Delete all tasks linked to the project
      await tx.delete(tasks).where(eq(tasks.projectId, projectId));

      // Step 6: Delete all users linked to the project from the projectUsers table
      await tx
        .delete(projectUsers)
        .where(eq(projectUsers.projectId, projectId));

      // Step 7: Finally, delete the project itself from the projects table
      await tx.delete(projects).where(eq(projects.id, projectId));

      // Return the user object to indicate success (or other relevant info)
      return user;
    });

    // Return a success response with the transaction result
    return { success: true, data: res };
  } catch (error) {
    // Catch any errors and handle them appropriately, returning the error response
    return handleError(error);
  }
}
