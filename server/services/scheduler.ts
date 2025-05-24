import * as cron from "node-cron";
import { IStorage } from "../storage";
import { ScraperService } from "./scraper";
import { TelegramService } from "./telegram";

export class SchedulerService {
  private scraperJob?: cron.ScheduledTask;
  private dealPostingJob?: cron.ScheduledTask;

  constructor(
    private storage: IStorage,
    private scraperService: ScraperService,
    private telegramService: TelegramService
  ) {}

  start(): void {
    console.log("🤖 AUTONOMOUS AGENT: Starting automated affiliate marketing system...");

    // Run scrapers every 5 minutes for real-time deal detection
    this.scraperJob = cron.schedule("*/5 * * * *", async () => {
      console.log("🔍 AGENT: Scanning all platforms for new deals...");
      try {
        await this.scraperService.runAllScrapers();
      } catch (error) {
        console.error("❌ AGENT: Scraping failed:", error);
      }
    });

    // Post deals every 3 minutes for maximum engagement
    this.dealPostingJob = cron.schedule("*/3 * * * *", async () => {
      console.log("📤 AGENT: Auto-posting deals to Telegram groups...");
      try {
        await this.postScheduledDeals();
      } catch (error) {
        console.error("❌ AGENT: Deal posting failed:", error);
      }
    });

    console.log("✅ AUTONOMOUS AGENT: Successfully started! Now monitoring platforms and auto-posting deals.");
    console.log("🎯 AGENT: Will scan every 5 minutes and post every 3 minutes");
    
    // Run initial scan immediately
    setTimeout(async () => {
      console.log("🚀 AGENT: Running initial platform scan...");
      await this.scraperService.runAllScrapers();
    }, 5000);
  }

  stop(): void {
    if (this.scraperJob) {
      this.scraperJob.stop();
    }
    if (this.dealPostingJob) {
      this.dealPostingJob.stop();
    }
    console.log("Scheduler service stopped");
  }

  private async postScheduledDeals(): Promise<void> {
    const activeGroups = await this.storage.getActiveTelegramGroups();
    const activeDeals = await this.storage.getActiveDeals();

    for (const group of activeGroups) {
      try {
        // Check if group hasn't reached daily limit
        const settings = await this.storage.getSystemSettings();
        const maxDealsPerDay = settings?.maxDealsPerDay || 50;
        
        if ((group.dealsPostedToday || 0) >= maxDealsPerDay) {
          continue;
        }

        // Find deals that haven't been posted to this group recently
        const unpostedDeals = activeDeals.filter(deal => {
          // Simple logic: post deals from the last hour
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
          return new Date(deal.createdAt || 0) > oneHourAgo;
        });

        if (unpostedDeals.length > 0) {
          // Post one random deal
          const randomDeal = unpostedDeals[Math.floor(Math.random() * unpostedDeals.length)];
          await this.telegramService.postDealToGroup(randomDeal.id, group.id);
          
          // Add some delay between posts
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`Failed to post deal to group ${group.name}:`, error);
      }
    }
  }
}
