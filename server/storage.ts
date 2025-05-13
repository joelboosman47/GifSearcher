import { users, favorites, type User, type InsertUser, type Favorite, type InsertFavorite } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Favorites related methods
  getFavorites(userId: number): Promise<Favorite[]>;
  getFavorite(userId: number, gifId: string): Promise<Favorite | undefined>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, gifId: string): Promise<boolean>;
  isFavorite(userId: number, gifId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getFavorites(userId: number): Promise<Favorite[]> {
    return await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId))
      .orderBy(favorites.createdAt);
  }

  async getFavorite(userId: number, gifId: string): Promise<Favorite | undefined> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.gifId, gifId)
      ));
    
    return favorite || undefined;
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    // Check if already exists
    const existing = await this.getFavorite(favorite.userId, favorite.gifId);
    if (existing) {
      return existing;
    }
    
    const [newFavorite] = await db
      .insert(favorites)
      .values(favorite)
      .returning();
    
    return newFavorite;
  }

  async removeFavorite(userId: number, gifId: string): Promise<boolean> {
    const result = await db
      .delete(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.gifId, gifId)
      ))
      .returning({ id: favorites.id });
    
    return result.length > 0;
  }

  async isFavorite(userId: number, gifId: string): Promise<boolean> {
    const favorite = await this.getFavorite(userId, gifId);
    return !!favorite;
  }
}

export const storage = new DatabaseStorage();
