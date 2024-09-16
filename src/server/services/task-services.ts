"use server";
import { db } from "../db";
import { tasks } from "../db/schema";

export async function getTasksForProject(projectId: string) {
  return await db.query.tasks.findMany({
    where: (table, fn) => fn.eq(table.projectId, projectId),
  });
}

export async function createTask(projectId: string, data: { name: string }) {
  return await db.insert(tasks).values({ ...data, projectId, status: "todo" });
}
