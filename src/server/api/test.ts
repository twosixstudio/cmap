"use server";
import { db } from "../db";
import { auth } from "auth";
import { projects, ProjectUserTable, tasks } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getThing() {
  try {
    const session = await auth();
    if (!session) throw Error("Oh no");

    const res = await db.query.users.findMany({
      where: (table, funcs) => funcs.eq(table.id, session.user.id),
      with: {
        projects: {
          // Navigate through the ProjectUserTable to users
          with: {
            project: true, // Fetch associated user details
            user: true,
          },
        },
      },
    });

    return res;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function createTask(projectId: string, data: { name: string }) {
  return await db.insert(tasks).values({ ...data, projectId, status: "todo" });
}

// Example of inviting a member or admin
export async function inviteUserToProject(
  projectId: string,
  userId: string,
  role: "owner" | "admin" | "member",
) {
  // Add the user with the selected role
  return await db.insert(ProjectUserTable).values({ projectId, role, userId });
}

export async function getUsers() {
  return await db.query.users.findMany();
}

export async function getProject(id: string) {
  return await db.query.projects.findFirst({
    where: (table, fn) => fn.eq(table.id, id),
    with: {
      users: {
        with: { user: true },
      },
      tasks: true,
    },
  });
}

export async function getProjectTasks(projectId: string) {
  return await db.query.tasks.findMany({
    where: (table, fn) => fn.eq(table.projectId, projectId),
  });
}

export async function deleteProject(projectId: string) {
  return await db.transaction(async (tx) => {
    await tx.delete(tasks).where(eq(tasks.projectId, projectId));
    await tx
      .delete(ProjectUserTable)
      .where(eq(ProjectUserTable.projectId, projectId));
    return await tx.delete(projects).where(eq(projects.id, projectId));
  });
}
