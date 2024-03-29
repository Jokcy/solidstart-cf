import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull(),
    title: text("title").notNull(),
    completed: integer("completed").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
