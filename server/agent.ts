import { ScraperService } from "./services/scraper";
import { TelegramService } from "./services/telegram";
import { SchedulerService } from "./services/scheduler";
import { storage } from "./storage";

export class AutonomousAffiliateAgent {
  private scraperService: ScraperService;
  private telegramService: TelegramService;
  private schedulerService: SchedulerService;
  private isRunning = false;

  constructor() {
    this.scraperService = new ScraperService(storage);
    this.telegramService = new TelegramService(storage);
    this.schedulerService = new SchedulerService(storage, this.scraperService, this.telegramService);
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log("🤖 AGENT: Already running!");
      return;
    }

    console.log("🚀 AUTONOMOUS AFFILIATE AGENT: Initializing...");
    
    // Check if we have the necessary API keys
    await this.validateConfiguration();
    
    // Start the autonomous operations
    this.schedulerService.start();
    this.isRunning = true;

    console.log("✅ AUTONOMOUS AGENT: Fully operational!");
    console.log("🎯 AGENT: Now automatically:");
    console.log("   • Scanning platforms every 5 minutes");
    console.log("   • Posting hot deals every 3 minutes");
    console.log("   • Tracking all clicks and purchases");
    console.log("   • Sending you instant notifications");
    
    await this.notifyAgentStart();
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    
    console.log("🛑 AGENT: Stopping autonomous operations...");
    this.schedulerService.stop();
    this.isRunning = false;
    console.log("✅ AGENT: Stopped successfully");
  }

  private async validateConfiguration(): Promise<void> {
    const settings = await storage.getSystemSettings();
    const botToken = process.env.TELEGRAM_BOT_TOKEN || settings?.telegramBotToken;
    
    if (!botToken) {
      console.log("⚠️ AGENT: Telegram Bot Token not configured");
      console.log("💡 AGENT: Set TELEGRAM_BOT_TOKEN environment variable or configure in settings");
    } else {
      console.log("✅ AGENT: Telegram Bot configured");
    }

    // Check for platform API keys
    const apiKeys = {
      amazon: process.env.AMAZON_API_KEY,
      flipkart: process.env.FLIPKART_API_KEY,
      affiliateTracking: process.env.AFFILIATE_TRACKING_ID
    };

    if (!apiKeys.affiliateTracking) {
      console.log("⚠️ AGENT: Affiliate tracking ID not set - using default");
    }

    console.log("🔑 AGENT: Configuration validated");
  }

  private async notifyAgentStart(): Promise<void> {
    const ownerChatId = process.env.OWNER_TELEGRAM_ID;
    if (ownerChatId) {
      const message = `🤖 AUTONOMOUS AGENT ACTIVATED!

Your affiliate marketing agent is now running 24/7:

✅ Monitoring: Amazon, Flipkart, Zepto, Swiggy, Zomato, Ajio
✅ Auto-posting deals to your Telegram groups
✅ Tracking clicks and purchases
✅ Generating commission reports

I'll notify you instantly when:
💰 Someone purchases through your links
📈 Hot deals are posted
🎯 Daily/weekly performance reports

Agent Status: ACTIVE 🟢`;

      try {
        await this.telegramService.sendMessage(ownerChatId, message);
      } catch (error) {
        console.log("📱 AGENT: Could not send startup notification (check bot token)");
      }
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      platforms: ['Amazon', 'Flipkart', 'Zepto', 'Swiggy', 'Zomato', 'Ajio'],
      scanFrequency: '5 minutes',
      postFrequency: '3 minutes',
      features: [
        'Autonomous deal scraping',
        'Automatic affiliate link generation', 
        'Smart Telegram posting',
        'Purchase tracking & notifications',
        'Performance analytics'
      ]
    };
  }
}

// Global agent instance
export const autonomousAgent = new AutonomousAffiliateAgent();