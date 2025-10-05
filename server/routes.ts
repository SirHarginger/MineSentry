import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReportSchema, insertAlertSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  app.get("/api/reports/:id", async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertReportSchema.parse(req.body);
      const userId = req.body.userId || "anonymous";
      const userName = req.body.userName || "Anonymous User";
      
      const report = await storage.createReport(validatedData, userId, userName);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid report data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create report" });
    }
  });

  app.patch("/api/reports/:id/vote", async (req, res) => {
    try {
      const { votes } = req.body;
      await storage.updateReportVotes(req.params.id, votes);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update votes" });
    }
  });

  app.get("/api/alerts/:userId", async (req, res) => {
    try {
      const alerts = await storage.getAlerts(req.params.userId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const userId = req.body.userId || "anonymous";
      
      const alert = await storage.createAlert(validatedData, userId);
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid alert data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create alert" });
    }
  });

  app.delete("/api/alerts/:id", async (req, res) => {
    try {
      await storage.deleteAlert(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete alert" });
    }
  });

  app.post("/api/predict", async (req, res) => {
    try {
      const { location, tileSize } = req.body;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPrediction = {
        id: Math.random().toString(36).substr(2, 9),
        location,
        riskScore: Math.floor(Math.random() * 100),
        confidenceBreakdown: {
          optical: 70 + Math.random() * 20,
          sar: 30 - Math.random() * 20,
        },
        changeMask: 'data:image/png;base64,mock',
        saliencyMap: 'data:image/png;base64,mock',
        timestamp: new Date().toISOString(),
        features: {
          ndviDrop: Math.floor(30 + Math.random() * 40),
          sarBackscatter: Math.floor(25 + Math.random() * 35),
          thermalAnomaly: Math.floor(15 + Math.random() * 30),
        },
      };
      
      res.json(mockPrediction);
    } catch (error) {
      res.status(500).json({ error: "ML prediction failed" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
