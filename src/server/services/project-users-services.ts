"use server";
import { handleError } from "~/utils/handle-error";
import { db } from "../db";
import { projectUsers } from "../db/schema";
import { and, eq } from "drizzle-orm";

export async function inviteUserToProject(
  projectId: string,
  userId: string,
  role: "owner" | "admin" | "member",
) {
  // Add the user with the selected role
  return await db.insert(projectUsers).values({ projectId, role, userId });
}

export async function removeUserFromProject({
  projectId,
  userId,
}: {
  userId: string;
  projectId: string;
}) {
  try {
    // await db.delete(projectUsers).where(eq(projectUsers.userId, userId));
    await db
      .delete(projectUsers)
      .where(
        and(
          eq(projectUsers.userId, userId),
          eq(projectUsers.projectId, projectId),
        ),
      );
  } catch (error) {
    return handleError(error);
  }
}
