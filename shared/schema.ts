import { pgTable, text, serial, integer, boolean, timestamp, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
}));

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  gifId: text("gif_id").notNull(),
  gifUrl: text("gif_url").notNull(),
  gifTitle: text("gif_title"),
  thumbnailUrl: text("thumbnail_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (favorites) => {
  return {
    userGifIndex: uniqueIndex("user_gif_idx").on(favorites.userId, favorites.gifId),
  };
});

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  gifId: true,
  gifUrl: true,
  gifTitle: true,
  thumbnailUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

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
