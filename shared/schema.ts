import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// GIF search API parameter validation schemas
export const searchGifsSchema = z.object({
  q: z.string().min(1, "Search query is required"),
  limit: z.coerce.number().min(1).max(50).optional().default(25),
  offset: z.coerce.number().min(0).optional().default(0),
});

export const trendingGifsSchema = z.object({
  limit: z.coerce.number().min(1).max(50).optional().default(25),
  offset: z.coerce.number().min(0).optional().default(0),
});
