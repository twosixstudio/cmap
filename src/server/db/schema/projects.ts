import { relations, sql } from "drizzle-orm";
import { index, timestamp, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../create-table";
import { projectUsers } from "./project-users";
import { tasks } from "./tasks";
import { notes } from "./notes";

export const projects = createTable(
  "project",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("projects_idx").on(example.name),
  }),
);

export const projectsRelations = relations(projects, ({ many }) => ({
  users: many(projectUsers),
  tasks: many(tasks),
  notes: many(notes),
}));
