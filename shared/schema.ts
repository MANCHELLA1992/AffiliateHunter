import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const platforms = pgTable("platforms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  lastScanAt: timestamp("last_scan_at"),
  status: text("status").notNull().default("active"), // active, paused, error, rate_limited
  apiKey: text("api_key"),
  baseUrl: text("base_url"),
});

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }).notNull(),
  discountPercentage: integer("discount_percentage").notNull(),
  productUrl: text("product_url").notNull(),
  affiliateUrl: text("affiliate_url").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  platformId: integer("platform_id").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  views: integer("views").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  conversions: integer("conversions").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const telegramGroups = pgTable("telegram_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  chatId: text("chat_id").notNull().unique(),
  memberCount: integer("member_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  dealsPostedToday: integer("deals_posted_today").notNull().default(0),
  lastPostAt: timestamp("last_post_at"),
  settings: jsonb("settings"), // posting frequency, filters, etc.
});

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  dealId: integer("deal_id").notNull(),
  telegramGroupId: integer("telegram_group_id"),
  userId: text("user_id"), // telegram user id
  username: text("username"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  commission: decimal("commission", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const scraperConfigs = pgTable("scraper_configs", {
  id: serial("id").primaryKey(),
  platformId: integer("platform_id").notNull(),
  isEnabled: boolean("is_enabled").notNull().default(true),
  frequency: integer("frequency").notNull().default(60), // minutes
  selectors: jsonb("selectors"), // CSS selectors for scraping
  filters: jsonb("filters"), // price ranges, categories, etc.
  lastRun: timestamp("last_run"),
  nextRun: timestamp("next_run"),
});

export const affiliatePrograms = pgTable("affiliate_programs", {
  id: serial("id").primaryKey(),
  platformId: integer("platform_id").notNull(),
  programName: text("program_name").notNull(),
  apiKey: text("api_key"),
  secretKey: text("secret_key"),
  trackingId: text("tracking_id"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  telegramBotToken: text("telegram_bot_token"),
  webhookUrl: text("webhook_url"),
  defaultPostingInterval: integer("default_posting_interval").notNull().default(30), // minutes
  maxDealsPerDay: integer("max_deals_per_day").notNull().default(50),
  settings: jsonb("settings"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertPlatformSchema = createInsertSchema(platforms).omit({ id: true });
export const insertDealSchema = createInsertSchema(deals).omit({ id: true, views: true, clicks: true, conversions: true, createdAt: true });
export const insertTelegramGroupSchema = createInsertSchema(telegramGroups).omit({ id: true, dealsPostedToday: true, lastPostAt: true });
export const insertPurchaseSchema = createInsertSchema(purchases).omit({ id: true, createdAt: true });
export const insertScraperConfigSchema = createInsertSchema(scraperConfigs).omit({ id: true, lastRun: true, nextRun: true });
export const insertAffiliateProgramSchema = createInsertSchema(affiliatePrograms).omit({ id: true });
export const insertSystemSettingsSchema = createInsertSchema(systemSettings).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Platform = typeof platforms.$inferSelect;
export type InsertPlatform = z.infer<typeof insertPlatformSchema>;

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;

export type TelegramGroup = typeof telegramGroups.$inferSelect;
export type InsertTelegramGroup = z.infer<typeof insertTelegramGroupSchema>;

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;

export type ScraperConfig = typeof scraperConfigs.$inferSelect;
export type InsertScraperConfig = z.infer<typeof insertScraperConfigSchema>;

export type AffiliateProgram = typeof affiliatePrograms.$inferSelect;
export type InsertAffiliateProgram = z.infer<typeof insertAffiliateProgramSchema>;

export type SystemSettings = typeof systemSettings.$inferSelect;
export type InsertSystemSettings = z.infer<typeof insertSystemSettingsSchema>;
