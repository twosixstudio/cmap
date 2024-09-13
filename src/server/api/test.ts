"use server";

import { count, eq } from "drizzle-orm";
import { db } from "../db";
import { projects, ProjectUserTable, users } from "../db/schema";
import { auth } from "auth";
// import { getServerAuthSession } from "../auth";

export async function getThing() {
  const session = await auth();
  if (!session) throw Error("Oh no");
  try {
    // await db.select({ count: sql`count(*)`.mapWith(Number) }).from(products);
    // const res = await db
    // .select({
    //   name: users.name,
    //   projects: db
    //     .select({
    //       projectName: projects.name,
    //       projectId: projects.id,
    //     })
    //     .from(ProjectUserTable)
    //     .leftJoin(projects, eq(ProjectUserTable.projectId, projects.id))
    //     .where(eq(ProjectUserTable.userId, users.id))
    //     .as('projects'), // Alias the subquery as 'projects'
    // })
    // .from(users);
    const res = await db.query.users.findMany({
      // Select all fields from the projects table
      where: (table, funcs) => funcs.eq(table.id, session.user.id),
      with: {
        projects: {
          // Navigate through the ProjectUserTable to users
          with: {
            project: true, // Fetch associated user details
          },
        },
      },
    });
    return res;
  } catch (error) {}
}

// "use server";

// import { count, eq } from "drizzle-orm";
// import { db } from "../db";
// import { projects, ProjectUserTable, users } from "../db/schema";

// export async function getThing() {
//   try {
//     const res = await db
//       .select({
//         id: users.id,
//         name: users.name,
//         projectCount: count(ProjectUserTable.projectId).as("projectCount"),
//       })
//       .from(users)
//       .leftJoin(ProjectUserTable, eq(users.id, ProjectUserTable.userId))
//       .groupBy(users.id, users.name); // Ensure all selected fields are in groupBy

//     return res;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }
