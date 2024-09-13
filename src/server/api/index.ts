"use server";
import { db } from "../db";
import { projectOwners, projects, ProjectUserTable, users } from "../db/schema";

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

// Define a custom error type for application-specific errors
class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}

// Helper function to ensure the error is of type `Error`
function assertIsError(error: unknown): asserts error is Error {
  if (!(error instanceof Error)) {
    throw new Error("Caught non-Error object");
  }
}

// Define the function to create a project with multiple owners
export async function createProject(
  name: string,
  userId: string,
): Promise<{ message: string } | undefined> {
  try {
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
    });

    // Return success message
    return { message: "ok" };
  } catch (error) {
    // Log or handle the error appropriately
    console.error("Error creating project:", error);
    return { message: "Failed to create project" };
  }
}

export async function getFirstProjectWithOwners() {
  try {
    const project = await db.query.projects.findFirst({
      with: { projectOwners: true },
    });
    if (!project) throw Error();
  } catch (error) {
    console.log(error);
    throw Error();
  }
  // try {
  //   // Fetch the first project and include its owners
  //   const project = await db
  //     .select(projects)
  //     .leftJoin(projectOwners, eq(projects.id, projectOwners.projectId))
  //     .leftJoin(users, eq(projectOwners.userId, users.id))
  //     .limit(1); // Get the first project

  //   if (!project.length) throw new Error("Oh no"); // Check if no project found

  //   // Format the response to include owners
  //   const formattedProject: ProjectWithOwners = {
  //     ...project[0].projects,
  //     owners: project.map((p) => p.users), // Adjust as needed to properly extract owners
  //   };

  //   return formattedProject;
  // } catch (error: unknown) {
  //   // Safe error handling
  //   if (error instanceof Error) {
  //     throw new Error(`Good: ${error.message}`);
  //   } else {
  //     throw new Error('Good: An unknown error occurred');
  //   }
  // }
}

// /**
//  * Deletes a project and its associated ownerships.
//  * @param {number} projectId - The ID of the project to delete.
//  * @returns {Promise<void>} - Resolves when the project and associations are deleted.
//  */
// export async function deleteProject(projectId: number): Promise<void> {
//   try {
//     // Start a transaction to ensure atomicity
//     await db.transaction(async (tx) => {
//       // Step 1: Delete associated project owners
//       await tx
//         .delete(projectOwners)
//         .where(projectOwners.projectId.equals(projectId));

//       // Step 2: Delete the project
//       const deletedCount = await tx
//         .delete(projects)
//         .where(projects.id.equals(projectId));

//       // Check if the project was deleted successfully
//       if (deletedCount === 0) {
//         throw new AppError("Project not found or already deleted.");
//       }
//     });
//   } catch (error: unknown) {
//     assertIsError(error); // Ensure error is of type Error
//     console.error("Error deleting project:", error.message);
//     throw new AppError("Failed to delete project. Please try again later.");
//   }
// }
