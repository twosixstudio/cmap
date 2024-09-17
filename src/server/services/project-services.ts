"use server";
import { auth } from "@/auth";

import { db } from "../db";
import { projects, tasks, projectUsers } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getProject(id: string) {
  const session = await auth();
  if (!session) throw Error("Oh no");

  const res = await db.query.projects.findFirst({
    where: (table, fn) => fn.eq(table.id, id),
    with: {
      users: {
        with: { user: true },
      },
      tasks: true,
    },
  });

  if (!res) return undefined;

  const owners = res.users.filter((x) => x.role === "owner");
  const members = res.users.filter((x) => x.role === "member");
  const transformed = {
    id: res.id,
    name: res.name,
    amOwner: owners?.map((x) => x.userId).includes(session.user.id),
    owners,
    members,
  };
  return transformed;
}

// Define the function to create a project with multiple owners
export async function createProject(
  name: string,
): Promise<{ message: string } | undefined> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!session || !userId) {
      throw new Error("Not authenticated");
    }
    // Insert a new project and return the ID
    const projectList = await db
      .insert(projects)
      .values({ name })
      .returning({ id: projects.id });

    console.log(projectList, "-------");

    // Explicit check for undefined or empty array
    if (!projectList || projectList.length === 0) {
      throw new Error("Failed to create project");
    }

    // Access the ID with certainty after the check
    const projectId = projectList[0]?.id;
    if (!projectId) {
      throw new Error("Project ID is undefined");
    }

    // Insert into the join table to create the many-to-many relationship
    await db.insert(projectUsers).values({
      projectId, // Using the non-undefined projectId
      userId,
      role: "owner",
    });

    // Return success message
    return { message: "ok" };
  } catch (error) {
    // Log or handle the error appropriately
    return { message: "Failed to create project" };
  }
}

export async function getProjectsWithUsers() {
  try {
    const session = await auth();
    if (!session) throw Error("Oh no");

    const res = await db.query.projectUsers.findMany({
      where: (table, fn) => fn.eq(table.userId, session.user.id),
      with: {
        project: {
          with: { users: { with: { user: true } } },
        },
        user: true,
      },
    });

    const projectsWithUsers = res.map((projectUser) => ({
      id: projectUser.project.id,
      name: projectUser.project.name,
      members: projectUser.project.users
        .filter((x) => x.role === "member")
        .map((x) => x.user),
      owners: projectUser.project.users
        .filter((x) => x.role === "owner")
        .map((x) => x.user),
    }));

    return projectsWithUsers;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function deleteProject(projectId: string) {
  return await db.transaction(async (tx) => {
    await tx.delete(tasks).where(eq(tasks.projectId, projectId));
    await tx.delete(projectUsers).where(eq(projectUsers.projectId, projectId));
    return await tx.delete(projects).where(eq(projects.id, projectId));
  });
}
