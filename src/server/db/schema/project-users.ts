import { pgEnum, primaryKey, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../create-table";
import { projects } from "./projects";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { PROJECT_USER_ROLES } from "~/server/types";

export const roleEnum = pgEnum("roles", PROJECT_USER_ROLES);

export const projectUsers = createTable(
  "project_user",
  {
    projectId: varchar("project_id", { length: 255 })
      .notNull()
      .references(() => projects.id),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    role: roleEnum("role"),
  },
  (table) => {
    return { pk: primaryKey({ columns: [table.userId, table.projectId] }) };
  },
);

// Relations
export const projectUserRelations = relations(projectUsers, ({ one }) => ({
  user: one(users, {
    fields: [projectUsers.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [projectUsers.projectId],
    references: [projects.id],
  }),
}));
