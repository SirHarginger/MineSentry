import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface Hotspot {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  riskScore: number;
  lastUpdated: string;
  description: string;
}

export interface CommunityReport {
  id: string;
  userId: string;
  userName: string;
  location: {
    lat: number;
    lng: number;
  };
  photoUrl?: string;
  description: string;
  category: 'Water Pollution' | 'Deforestation' | 'Land Degradation' | 'Other';
  timestamp: string;
  validationVotes: number;
}

export interface AlertSubscription {
  id: string;
  userId: string;
  region: {
    name: string;
    coordinates: [number, number][];
  };
  frequency: 'daily' | 'weekly';
  delivery: ('in-app' | 'email' | 'sms')[];
}

export interface PredictionResult {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  riskScore: number;
  confidenceBreakdown: {
    optical: number;
    sar: number;
  };
  changeMask: string;
  saliencyMap: string;
  timestamp: string;
  features: {
    ndviDrop: number;
    sarBackscatter: number;
    thermalAnomaly: number;
  };
}

export const insertReportSchema = z.object({
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  photoUrl: z.string().optional(),
  description: z.string().min(1).max(500),
  category: z.enum(['Water Pollution', 'Deforestation', 'Land Degradation', 'Other']),
});

export type InsertReport = z.infer<typeof insertReportSchema>;

export const insertAlertSchema = z.object({
  region: z.object({
    name: z.string(),
    coordinates: z.array(z.tuple([z.number(), z.number()])),
  }),
  frequency: z.enum(['daily', 'weekly']),
  delivery: z.array(z.enum(['in-app', 'email', 'sms'])),
});

export type InsertAlert = z.infer<typeof insertAlertSchema>;
