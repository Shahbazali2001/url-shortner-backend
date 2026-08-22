import {
  pgTable,
  serial,
  text,
  integer,
  uuid,
  timestamp,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";

export const urlsTable = pgTable(
  "urls",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shortCode: varchar("short_code", { length: 155 }).notNull(),
    targetUrl: text("target_url").notNull(),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      shortCodeIdx: uniqueIndex("short_code_idx").on(table.shortCode),
    };
  },
);
