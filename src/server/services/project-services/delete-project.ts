"use server";
import { eq, inArray } from "drizzle-orm";
import { db } from "~/server/db";
import { projects, projectUsers, tasks, taskUsers } from "~/server/db/schema";
import type { ServerReponse } from "~/server/types";
import { handleError } from "~/utils/handle-error";

/**
 * Deletes a project along with all its related tasks, task users, and project users.
 *
 * This function performs a transactional deletion of:
 * 1. All task users associated with the tasks belonging to the project.
 * 2. All tasks that are part of the project.
 * 3. All users associated with the project (via the `projectUsers` table).
 * 4. The project itself.
 *
 * The operation is wrapped in a transaction to ensure that either all the deletions
 * occur, or none do, thereby maintaining data consistency in case of errors.
 *
 * Steps involved:
 * - Fetch all task IDs associated with the given project.
 * - If there are any tasks, delete the corresponding task users.
 * - Delete all tasks linked to the project.
 * - Delete all users linked to the project.
 * - Finally, delete the project itself.
 *
 * @param {string} projectId - The unique identifier of the project to be deleted.
 * @returns {Promise<ServerReponse<{ message: string }>>} - A response object indicating the success or failure of the operation.
 *
 * @throws Will propagate any error encountered during the transaction. Errors are caught and handled through `handleError`.
 */
export async function deleteProject(
  projectId: string,
): Promise<ServerReponse<{ message: string }>> {
  try {
    await db.transaction(async (tx) => {
      // Step 1: Fetch all task IDs related to the project
      const tasksList = await tx.query.tasks.findMany({
        where: (table, fn) => fn.eq(table.projectId, projectId),
        columns: { id: true },
      });

      // Extract the task IDs into an array
      const taskIds = tasksList.map((task) => task.id);

      // Step 2: If there are tasks, delete associated taskUsers
      if (taskIds.length > 0) {
        // Bulk delete all taskUsers associated with the fetched task IDs
        await tx.delete(taskUsers).where(inArray(taskUsers.taskId, taskIds));
      }

      // Step 3: Delete all tasks linked to the project
      await tx.delete(tasks).where(eq(tasks.projectId, projectId));

      // Step 4: Delete all users linked to the project from the projectUsers table
      await tx
        .delete(projectUsers)
        .where(eq(projectUsers.projectId, projectId));

      // Step 5: Finally, delete the project itself from the projects table
      return await tx.delete(projects).where(eq(projects.id, projectId));
    });

    // Return a success response if all operations are completed successfully
    return { success: true, data: { message: "All good!" } };
  } catch (error) {
    // Catch any errors and handle them appropriately, returning the error response
    return handleError(error);
  }
}
