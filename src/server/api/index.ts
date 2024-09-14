"use server";
import { auth } from "auth";
import { db } from "../db";
import { projects, ProjectUserTable } from "../db/schema";

// TypeScript type for the Project table
export type Project = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
};

// TypeScript type for the User table (owners)
export type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
};

// TypeScript type for the ProjectOwners join table
export type ProjectOwner = {
  projectId: number;
  userId: string;
};

// Combined type for Project with Owners
export type ProjectWithOwners = Project & {
  owners: User[];
};

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
    await db.insert(ProjectUserTable).values({
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
