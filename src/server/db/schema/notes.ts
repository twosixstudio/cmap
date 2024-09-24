import { timestamp, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../create-table";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const notes = createTable("note", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  content: varchar("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
});

export const notesRelations = relations(notes, ({ one }) => ({
  users: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));
