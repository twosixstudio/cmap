import { pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { createTable } from "../create-table";
import { relations } from "drizzle-orm";
import { TASK_STATUSES } from "~/server/types";
import { taskUsers } from "./task-users";

export const taskStatusEnum = pgEnum("task_status", TASK_STATUSES);

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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  users: many(taskUsers),
}));
