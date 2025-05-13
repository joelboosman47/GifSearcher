import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchGifs, trendingGifs } from "./giphyService";
import { searchGifsSchema, trendingGifsSchema } from "@shared/schema";
import { ZodError } from "zod";

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

  const httpServer = createServer(app);

  return httpServer;
}
