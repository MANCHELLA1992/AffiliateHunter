import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDealSchema, insertTelegramGroupSchema, insertPurchaseSchema } from "@shared/schema";
import { ScraperService } from "./services/scraper";
import { TelegramService } from "./services/telegram";
import { SchedulerService } from "./services/scheduler";

export async function registerRoutes(app: Express): Promise<Server> {
  const scraperService = new ScraperService(storage);
  const telegramService = new TelegramService(storage);
  const schedulerService = new SchedulerService(storage, scraperService, telegramService);

  // Start the scheduler
  schedulerService.start();

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Platforms
  app.get("/api/platforms", async (req, res) => {
    try {
      const platforms = await storage.getPlatforms();
      res.json(platforms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch platforms" });
    }
  });

  app.patch("/api/platforms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const platform = await storage.updatePlatform(id, req.body);
      res.json(platform);
    } catch (error) {
      res.status(500).json({ message: "Failed to update platform" });
    }
  });

  // Deals
  app.get("/api/deals", async (req, res) => {
    try {
      const deals = await storage.getDeals();
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  app.get("/api/deals/active", async (req, res) => {
    try {
      const deals = await storage.getActiveDeals();
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active deals" });
    }
  });

  app.post("/api/deals", async (req, res) => {
    try {
      const validatedData = insertDealSchema.parse(req.body);
      const deal = await storage.createDeal(validatedData);
      res.status(201).json(deal);
    } catch (error) {
      res.status(400).json({ message: "Invalid deal data" });
    }
  });

  app.patch("/api/deals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deal = await storage.updateDeal(id, req.body);
      res.json(deal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update deal" });
    }
  });

  app.post("/api/deals/:id/click", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deal = await storage.getDeal(id);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      await storage.updateDeal(id, { clicks: (deal.clicks || 0) + 1 });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to track click" });
    }
  });

  // Telegram Groups
  app.get("/api/telegram-groups", async (req, res) => {
    try {
      const groups = await storage.getTelegramGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch telegram groups" });
    }
  });

  app.post("/api/telegram-groups", async (req, res) => {
    try {
      const validatedData = insertTelegramGroupSchema.parse(req.body);
      const group = await storage.createTelegramGroup(validatedData);
      res.status(201).json(group);
    } catch (error) {
      res.status(400).json({ message: "Invalid telegram group data" });
    }
  });

  app.patch("/api/telegram-groups/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const group = await storage.updateTelegramGroup(id, req.body);
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Failed to update telegram group" });
    }
  });

  // Purchases
  app.get("/api/purchases", async (req, res) => {
    try {
      const purchases = await storage.getPurchases();
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch purchases" });
    }
  });

  app.get("/api/purchases/today", async (req, res) => {
    try {
      const purchases = await storage.getTodaysPurchases();
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch today's purchases" });
    }
  });

  app.post("/api/purchases", async (req, res) => {
    try {
      const validatedData = insertPurchaseSchema.parse(req.body);
      const purchase = await storage.createPurchase(validatedData);
      res.status(201).json(purchase);
    } catch (error) {
      res.status(400).json({ message: "Invalid purchase data" });
    }
  });

  // Scraper management
  app.post("/api/scrapers/run", async (req, res) => {
    try {
      const { platformId } = req.body;
      if (platformId) {
        await scraperService.runScraper(platformId);
      } else {
        await scraperService.runAllScrapers();
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to run scraper" });
    }
  });

  app.get("/api/scrapers/configs", async (req, res) => {
    try {
      const configs = await storage.getScraperConfigs();
      res.json(configs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scraper configs" });
    }
  });

  // Affiliate programs
  app.get("/api/affiliate-programs", async (req, res) => {
    try {
      const programs = await storage.getAffiliatePrograms();
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch affiliate programs" });
    }
  });

  // System settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSystemSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.patch("/api/settings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const settings = await storage.updateSystemSettings(id, req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Telegram webhook
  app.post("/api/telegram/webhook", async (req, res) => {
    try {
      await telegramService.handleWebhook(req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });

  // Manual actions
  app.post("/api/actions/post-deal", async (req, res) => {
    try {
      const { dealId, groupId } = req.body;
      await telegramService.postDealToGroup(dealId, groupId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to post deal" });
    }
  });

  app.post("/api/actions/refresh-platforms", async (req, res) => {
    try {
      await scraperService.runAllScrapers();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to refresh platforms" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
