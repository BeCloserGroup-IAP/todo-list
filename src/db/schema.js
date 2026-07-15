const { pgTable, serial, text, boolean, timestamp } = require("drizzle-orm/pg-core");

const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

module.exports = { todos };
