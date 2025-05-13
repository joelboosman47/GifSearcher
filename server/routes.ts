import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchGifs, trendingGifs } from "./giphyService";
import { searchGifsSchema, trendingGifsSchema, insertFavoriteSchema } from "@shared/schema";
import { ZodError } from "zod";
import { z } from "zod";

// Simple middleware for user authentication
// In a real app, this would use proper auth with sessions/JWT
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  // For demo purposes, we'll create a default user if it doesn't exist
  try {
    let user = await storage.getUserByUsername("demo");
    
    if (!user) {
      user = await storage.createUser({
        username: "demo",
        password: "password123" // In a real app, this would be hashed
      });
    }
    
    // Attach the user to the request
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // GIF search API routes
  app.get("/api/gifs/search", async (req, res) => {
    try {
      const params = searchGifsSchema.parse(req.query);
      const data = await searchGifs({
        query: params.q,
        limit: params.limit,
        offset: params.offset,
      });
      
      res.json(data);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          message: "Invalid request parameters", 
          errors: error.errors 
        });
      } else {
        console.error("Error searching gifs:", error);
        res.status(500).json({ message: "Failed to search for GIFs" });
      }
    }
  });

  app.get("/api/gifs/trending", async (req, res) => {
    try {
      const params = trendingGifsSchema.parse(req.query);
      const data = await trendingGifs({
        limit: params.limit,
        offset: params.offset,
      });
      
      res.json(data);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          message: "Invalid request parameters", 
          errors: error.errors 
        });
      } else {
        console.error("Error fetching trending gifs:", error);
        res.status(500).json({ message: "Failed to fetch trending GIFs" });
      }
    }
  });

  // Favorites API routes - all require authentication
  app.get("/api/favorites", authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      const favorites = await storage.getFavorites(user.id);
      
      res.json({ favorites });
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      
      // Validate the request body
      const favoriteData = insertFavoriteSchema.parse({
        ...req.body,
        userId: user.id,
      });
      
      const favorite = await storage.addFavorite(favoriteData);
      
      res.status(201).json({ favorite });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          message: "Invalid favorite data", 
          errors: error.errors 
        });
      } else {
        console.error("Error adding favorite:", error);
        res.status(500).json({ message: "Failed to add favorite" });
      }
    }
  });

  app.delete("/api/favorites/:gifId", authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      const gifId = z.string().parse(req.params.gifId);
      
      const success = await storage.removeFavorite(user.id, gifId);
      
      if (success) {
        res.status(200).json({ message: "Favorite removed successfully" });
      } else {
        res.status(404).json({ message: "Favorite not found" });
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  app.get("/api/favorites/check/:gifId", authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      const gifId = z.string().parse(req.params.gifId);
      
      const isFavorite = await storage.isFavorite(user.id, gifId);
      
      res.json({ isFavorite });
    } catch (error) {
      console.error("Error checking favorite status:", error);
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
