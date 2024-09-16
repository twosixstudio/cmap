"use server";
import { db } from "../db";
import { projectUsers } from "../db/schema";

export async function inviteUserToProject(
  projectId: string,
  userId: string,
  role: "owner" | "admin" | "member",
) {
  // Add the user with the selected role
  return await db.insert(projectUsers).values({ projectId, role, userId });
}
