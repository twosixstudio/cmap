"use server";
import { db } from "../db";
import { auth } from "auth";

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
          },
        },
      },
    });

    return res;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
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
