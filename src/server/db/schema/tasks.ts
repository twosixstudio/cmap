import { pgEnum, varchar } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { createTable } from "../create-table";
import { relations } from "drizzle-orm";
import { TASK_STATUSES } from "~/server/types";

export const taskStatusEnum = pgEnum("type", TASK_STATUSES);

export const tasks = createTable("task", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  projectId: varchar("project_id", { length: 255 })
    .notNull()
    .references(() => projects.id),
  status: taskStatusEnum("task_status").notNull(),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));
