import { 
  platforms, deals, telegramGroups, purchases, scraperConfigs, 
  affiliatePrograms, systemSettings,
  type Platform, type InsertPlatform,
  type Deal, type InsertDeal,
  type TelegramGroup, type InsertTelegramGroup,
  type Purchase, type InsertPurchase,
  type ScraperConfig, type InsertScraperConfig,
  type AffiliateProgram, type InsertAffiliateProgram,
  type SystemSettings, type InsertSystemSettings
} from "@shared/schema";

export interface IStorage {
  // Platforms
  getPlatforms(): Promise<Platform[]>;
  getPlatform(id: number): Promise<Platform | undefined>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;
  updatePlatform(id: number, platform: Partial<Platform>): Promise<Platform>;

  // Deals
  getDeals(): Promise<Deal[]>;
  getDeal(id: number): Promise<Deal | undefined>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: number, deal: Partial<Deal>): Promise<Deal>;
  getActiveDeals(): Promise<Deal[]>;
  getDealsByPlatform(platformId: number): Promise<Deal[]>;

  // Telegram Groups
  getTelegramGroups(): Promise<TelegramGroup[]>;
  getTelegramGroup(id: number): Promise<TelegramGroup | undefined>;
  createTelegramGroup(group: InsertTelegramGroup): Promise<TelegramGroup>;
  updateTelegramGroup(id: number, group: Partial<TelegramGroup>): Promise<TelegramGroup>;
  getActiveTelegramGroups(): Promise<TelegramGroup[]>;

  // Purchases
  getPurchases(): Promise<Purchase[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getPurchasesByDateRange(startDate: Date, endDate: Date): Promise<Purchase[]>;
  getTodaysPurchases(): Promise<Purchase[]>;

  // Scraper Configs
  getScraperConfigs(): Promise<ScraperConfig[]>;
  getScraperConfig(id: number): Promise<ScraperConfig | undefined>;
  createScraperConfig(config: InsertScraperConfig): Promise<ScraperConfig>;
  updateScraperConfig(id: number, config: Partial<ScraperConfig>): Promise<ScraperConfig>;

  // Affiliate Programs
  getAffiliatePrograms(): Promise<AffiliateProgram[]>;
  getAffiliateProgramByPlatform(platformId: number): Promise<AffiliateProgram | undefined>;
  createAffiliateProgram(program: InsertAffiliateProgram): Promise<AffiliateProgram>;
  updateAffiliateProgram(id: number, program: Partial<AffiliateProgram>): Promise<AffiliateProgram>;

  // System Settings
  getSystemSettings(): Promise<SystemSettings | undefined>;
  createSystemSettings(settings: InsertSystemSettings): Promise<SystemSettings>;
  updateSystemSettings(id: number, settings: Partial<SystemSettings>): Promise<SystemSettings>;

  // Analytics
  getDashboardStats(): Promise<{
    activeDeals: number;
    todayRevenue: number;
    clickThroughRate: number;
    telegramGroups: number;
    todayClicks: number;
    todayViews: number;
  }>;
}

export class MemStorage implements IStorage {
  private platforms: Map<number, Platform> = new Map();
  private deals: Map<number, Deal> = new Map();
  private telegramGroups: Map<number, TelegramGroup> = new Map();
  private purchases: Map<number, Purchase> = new Map();
  private scraperConfigs: Map<number, ScraperConfig> = new Map();
  private affiliatePrograms: Map<number, AffiliateProgram> = new Map();
  private systemSettings: SystemSettings | null = null;
  
  private platformIdCounter = 1;
  private dealIdCounter = 1;
  private telegramGroupIdCounter = 1;
  private purchaseIdCounter = 1;
  private scraperConfigIdCounter = 1;
  private affiliateProgramIdCounter = 1;
  private systemSettingsIdCounter = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed platforms
    const platformsData: InsertPlatform[] = [
      { name: "amazon", displayName: "Amazon", icon: "fab fa-amazon", color: "orange-600", isActive: true, status: "active" },
      { name: "flipkart", displayName: "Flipkart", icon: "fas fa-shopping-cart", color: "blue-600", isActive: true, status: "active" },
      { name: "zepto", displayName: "Zepto", icon: "fas fa-bolt", color: "purple-600", isActive: true, status: "active" },
      { name: "swiggy", displayName: "Swiggy", icon: "fas fa-utensils", color: "orange-600", isActive: true, status: "rate_limited" },
      { name: "zomato", displayName: "Zomato", icon: "fas fa-concierge-bell", color: "red-600", isActive: true, status: "active" },
      { name: "ajio", displayName: "Ajio", icon: "fas fa-tshirt", color: "pink-600", isActive: true, status: "active" },
    ];

    platformsData.forEach(platform => {
      this.createPlatform(platform);
    });

    // Seed telegram groups
    const telegramGroupsData: InsertTelegramGroup[] = [
      { name: "Deal Hunters India", chatId: "-1001234567890", memberCount: 2300, isActive: true },
      { name: "Tech Deals Pro", chatId: "-1001234567891", memberCount: 1800, isActive: true },
      { name: "Fashion Deals Central", chatId: "-1001234567892", memberCount: 950, isActive: false },
    ];

    telegramGroupsData.forEach(group => {
      this.createTelegramGroup(group);
    });

    // Seed some sample deals
    const dealsData: InsertDeal[] = [
      {
        title: "Wireless Bluetooth Headphones",
        description: "Premium quality wireless headphones with noise cancellation",
        originalPrice: "3999",
        salePrice: "1999",
        discountPercentage: 50,
        productUrl: "https://amazon.in/product/123",
        affiliateUrl: "https://amazon.in/affiliate/123",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300",
        category: "Electronics",
        platformId: 1,
        isActive: true
      },
      {
        title: "Samsung Galaxy S23 Ultra",
        description: "Latest flagship smartphone with advanced camera",
        originalPrice: "124999",
        salePrice: "89999",
        discountPercentage: 28,
        productUrl: "https://flipkart.com/product/456",
        affiliateUrl: "https://flipkart.com/affiliate/456",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300",
        category: "Mobile",
        platformId: 2,
        isActive: true,
        views: 89,
        clicks: 12
      },
      {
        title: "Designer Leather Jacket",
        description: "Premium leather jacket for men",
        originalPrice: "8999",
        salePrice: "4499",
        discountPercentage: 50,
        productUrl: "https://ajio.com/product/789",
        affiliateUrl: "https://ajio.com/affiliate/789",
        imageUrl: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300&h=300",
        category: "Fashion",
        platformId: 6,
        isActive: true,
        views: 234,
        clicks: 45
      }
    ];

    dealsData.forEach(deal => {
      this.createDeal(deal);
    });

    // Seed some purchases
    const purchasesData: InsertPurchase[] = [
      { dealId: 1, userId: "123456789", username: "john_doe", amount: "1999", commission: "120", telegramGroupId: 1 },
      { dealId: 3, userId: "987654321", username: "fashionista", amount: "4499", commission: "315", telegramGroupId: 3 },
      { dealId: 1, userId: "456789123", username: "coffee_lover", amount: "850", commission: "68", telegramGroupId: 2 },
    ];

    purchasesData.forEach(purchase => {
      this.createPurchase(purchase);
    });

    // Seed system settings
    this.createSystemSettings({
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "your_bot_token_here",
      webhookUrl: process.env.WEBHOOK_URL || "https://your-domain.com/webhook",
      defaultPostingInterval: 30,
      maxDealsPerDay: 50,
      settings: { theme: "light", notifications: true }
    });
  }

  // Platform methods
  async getPlatforms(): Promise<Platform[]> {
    return Array.from(this.platforms.values());
  }

  async getPlatform(id: number): Promise<Platform | undefined> {
    return this.platforms.get(id);
  }

  async createPlatform(platform: InsertPlatform): Promise<Platform> {
    const id = this.platformIdCounter++;
    const newPlatform: Platform = { 
      ...platform, 
      id, 
      lastScanAt: new Date(),
      isActive: platform.isActive ?? true,
      status: platform.status ?? "active",
      apiKey: platform.apiKey ?? null,
      baseUrl: platform.baseUrl ?? null
    };
    this.platforms.set(id, newPlatform);
    return newPlatform;
  }

  async updatePlatform(id: number, platform: Partial<Platform>): Promise<Platform> {
    const existing = this.platforms.get(id);
    if (!existing) throw new Error("Platform not found");
    const updated = { ...existing, ...platform };
    this.platforms.set(id, updated);
    return updated;
  }

  // Deal methods
  async getDeals(): Promise<Deal[]> {
    return Array.from(this.deals.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getDeal(id: number): Promise<Deal | undefined> {
    return this.deals.get(id);
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const id = this.dealIdCounter++;
    const newDeal: Deal = { 
      ...deal, 
      id, 
      views: 0, 
      clicks: 0, 
      conversions: 0,
      createdAt: new Date()
    };
    this.deals.set(id, newDeal);
    return newDeal;
  }

  async updateDeal(id: number, deal: Partial<Deal>): Promise<Deal> {
    const existing = this.deals.get(id);
    if (!existing) throw new Error("Deal not found");
    const updated = { ...existing, ...deal };
    this.deals.set(id, updated);
    return updated;
  }

  async getActiveDeals(): Promise<Deal[]> {
    return Array.from(this.deals.values()).filter(deal => deal.isActive);
  }

  async getDealsByPlatform(platformId: number): Promise<Deal[]> {
    return Array.from(this.deals.values()).filter(deal => deal.platformId === platformId);
  }

  // Telegram Group methods
  async getTelegramGroups(): Promise<TelegramGroup[]> {
    return Array.from(this.telegramGroups.values());
  }

  async getTelegramGroup(id: number): Promise<TelegramGroup | undefined> {
    return this.telegramGroups.get(id);
  }

  async createTelegramGroup(group: InsertTelegramGroup): Promise<TelegramGroup> {
    const id = this.telegramGroupIdCounter++;
    const newGroup: TelegramGroup = { ...group, id };
    this.telegramGroups.set(id, newGroup);
    return newGroup;
  }

  async updateTelegramGroup(id: number, group: Partial<TelegramGroup>): Promise<TelegramGroup> {
    const existing = this.telegramGroups.get(id);
    if (!existing) throw new Error("Telegram group not found");
    const updated = { ...existing, ...group };
    this.telegramGroups.set(id, updated);
    return updated;
  }

  async getActiveTelegramGroups(): Promise<TelegramGroup[]> {
    return Array.from(this.telegramGroups.values()).filter(group => group.isActive);
  }

  // Purchase methods
  async getPurchases(): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createPurchase(purchase: InsertPurchase): Promise<Purchase> {
    const id = this.purchaseIdCounter++;
    const newPurchase: Purchase = { ...purchase, id, createdAt: new Date() };
    this.purchases.set(id, newPurchase);
    return newPurchase;
  }

  async getPurchasesByDateRange(startDate: Date, endDate: Date): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).filter(purchase => {
      const createdAt = new Date(purchase.createdAt || 0);
      return createdAt >= startDate && createdAt <= endDate;
    });
  }

  async getTodaysPurchases(): Promise<Purchase[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return this.getPurchasesByDateRange(startOfDay, endOfDay);
  }

  // Scraper Config methods
  async getScraperConfigs(): Promise<ScraperConfig[]> {
    return Array.from(this.scraperConfigs.values());
  }

  async getScraperConfig(id: number): Promise<ScraperConfig | undefined> {
    return this.scraperConfigs.get(id);
  }

  async createScraperConfig(config: InsertScraperConfig): Promise<ScraperConfig> {
    const id = this.scraperConfigIdCounter++;
    const newConfig: ScraperConfig = { ...config, id };
    this.scraperConfigs.set(id, newConfig);
    return newConfig;
  }

  async updateScraperConfig(id: number, config: Partial<ScraperConfig>): Promise<ScraperConfig> {
    const existing = this.scraperConfigs.get(id);
    if (!existing) throw new Error("Scraper config not found");
    const updated = { ...existing, ...config };
    this.scraperConfigs.set(id, updated);
    return updated;
  }

  // Affiliate Program methods
  async getAffiliatePrograms(): Promise<AffiliateProgram[]> {
    return Array.from(this.affiliatePrograms.values());
  }

  async getAffiliateProgramByPlatform(platformId: number): Promise<AffiliateProgram | undefined> {
    return Array.from(this.affiliatePrograms.values()).find(program => program.platformId === platformId);
  }

  async createAffiliateProgram(program: InsertAffiliateProgram): Promise<AffiliateProgram> {
    const id = this.affiliateProgramIdCounter++;
    const newProgram: AffiliateProgram = { ...program, id };
    this.affiliatePrograms.set(id, newProgram);
    return newProgram;
  }

  async updateAffiliateProgram(id: number, program: Partial<AffiliateProgram>): Promise<AffiliateProgram> {
    const existing = this.affiliatePrograms.get(id);
    if (!existing) throw new Error("Affiliate program not found");
    const updated = { ...existing, ...program };
    this.affiliatePrograms.set(id, updated);
    return updated;
  }

  // System Settings methods
  async getSystemSettings(): Promise<SystemSettings | undefined> {
    return this.systemSettings || undefined;
  }

  async createSystemSettings(settings: InsertSystemSettings): Promise<SystemSettings> {
    const id = this.systemSettingsIdCounter++;
    const newSettings: SystemSettings = { ...settings, id };
    this.systemSettings = newSettings;
    return newSettings;
  }

  async updateSystemSettings(id: number, settings: Partial<SystemSettings>): Promise<SystemSettings> {
    if (!this.systemSettings || this.systemSettings.id !== id) {
      throw new Error("System settings not found");
    }
    const updated = { ...this.systemSettings, ...settings };
    this.systemSettings = updated;
    return updated;
  }

  // Analytics methods
  async getDashboardStats(): Promise<{
    activeDeals: number;
    todayRevenue: number;
    clickThroughRate: number;
    telegramGroups: number;
    todayClicks: number;
    todayViews: number;
  }> {
    const activeDeals = Array.from(this.deals.values()).filter(deal => deal.isActive).length;
    const telegramGroups = Array.from(this.telegramGroups.values()).length;
    
    const todaysPurchases = await this.getTodaysPurchases();
    const todayRevenue = todaysPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.commission || "0"), 0);
    
    const totalViews = Array.from(this.deals.values()).reduce((sum, deal) => sum + (deal.views || 0), 0);
    const totalClicks = Array.from(this.deals.values()).reduce((sum, deal) => sum + (deal.clicks || 0), 0);
    
    const clickThroughRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

    return {
      activeDeals,
      todayRevenue,
      clickThroughRate,
      telegramGroups,
      todayClicks: totalClicks,
      todayViews: totalViews,
    };
  }
}

export const storage = new MemStorage();
