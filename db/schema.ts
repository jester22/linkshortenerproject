import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  url: text().notNull(),
  slug: text().unique().notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
