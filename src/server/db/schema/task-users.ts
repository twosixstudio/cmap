import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../create-table";
import { tasks } from "./tasks";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const taskUsers = createTable(
  "task_user",
  {
    taskId: varchar("task_id", { length: 255 })
      .notNull()
      .references(() => tasks.id),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
  },
  (table) => {
    return { pk: primaryKey({ columns: [table.userId, table.taskId] }) };
  },
);

// Relations
export const taskUsersRelations = relations(taskUsers, ({ one }) => ({
  user: one(users, {
    fields: [taskUsers.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [taskUsers.taskId],
    references: [tasks.id],
  }),
}));
