import { type User, type InsertUser, type CommunityReport, type AlertSubscription, type InsertReport, type InsertAlert } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getReports(): Promise<CommunityReport[]>;
  getReport(id: string): Promise<CommunityReport | undefined>;
  createReport(report: InsertReport, userId: string, userName: string): Promise<CommunityReport>;
  updateReportVotes(id: string, votes: number): Promise<void>;
  
  getAlerts(userId: string): Promise<AlertSubscription[]>;
  createAlert(alert: InsertAlert, userId: string): Promise<AlertSubscription>;
  deleteAlert(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private reports: Map<string, CommunityReport>;
  private alerts: Map<string, AlertSubscription>;

  constructor() {
    this.users = new Map();
    this.reports = new Map();
    this.alerts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getReports(): Promise<CommunityReport[]> {
    return Array.from(this.reports.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getReport(id: string): Promise<CommunityReport | undefined> {
    return this.reports.get(id);
  }

  async createReport(report: InsertReport, userId: string, userName: string): Promise<CommunityReport> {
    const id = randomUUID();
    const newReport: CommunityReport = {
      id,
      userId,
      userName,
      location: report.location,
      photoUrl: report.photoUrl,
      description: report.description,
      category: report.category,
      timestamp: new Date().toISOString(),
      validationVotes: 0,
    };
    this.reports.set(id, newReport);
    return newReport;
  }

  async updateReportVotes(id: string, votes: number): Promise<void> {
    const report = this.reports.get(id);
    if (report) {
      report.validationVotes = votes;
      this.reports.set(id, report);
    }
  }

  async getAlerts(userId: string): Promise<AlertSubscription[]> {
    return Array.from(this.alerts.values()).filter(
      (alert) => alert.userId === userId
    );
  }

  async createAlert(alert: InsertAlert, userId: string): Promise<AlertSubscription> {
    const id = randomUUID();
    const newAlert: AlertSubscription = {
      id,
      userId,
      region: alert.region,
      frequency: alert.frequency,
      delivery: alert.delivery,
    };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  async deleteAlert(id: string): Promise<void> {
    this.alerts.delete(id);
  }
}

export const storage = new MemStorage();
