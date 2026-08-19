import { pgTable, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
});
