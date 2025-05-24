import { IStorage } from "../storage";

export class TelegramService {
  private botToken: string;

  constructor(private storage: IStorage) {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || "7665352063:AAEDYPpBq9PAjlftIRlOQvtwfXKfAOPWPiU";
  }

  async handleWebhook(update: any): Promise<void> {
    console.log("📱 AGENT: Received Telegram webhook:", update);
    
    // Handle purchase notifications from affiliate links
    if (update.message && update.message.text && update.message.text.includes("purchase_confirmed")) {
      console.log("💰 AGENT: Processing purchase notification...");
      await this.handlePurchaseNotification(update);
    }

    // Handle user interactions with deals
    if (update.callback_query && update.callback_query.data) {
      console.log("👆 AGENT: Processing user interaction...");
      await this.handleCallbackQuery(update.callback_query);
    }
  }

  private async handleCallbackQuery(callbackQuery: any): Promise<void> {
    try {
      const data = callbackQuery.data;
      const userId = callbackQuery.from.id.toString();
      const username = callbackQuery.from.username || "unknown";

      if (data.startsWith("deal_")) {
        const dealId = parseInt(data.split("_")[1]);
        const deal = await this.storage.getDeal(dealId);
        
        if (deal) {
          // Track click
          await this.storage.updateDeal(dealId, { 
            clicks: (deal.clicks || 0) + 1 
          });
          console.log(`🎯 AGENT: User @${username} clicked on deal: ${deal.title}`);
        }
      }
    } catch (error) {
      console.error("❌ AGENT: Failed to handle callback query:", error);
    }
  }

  private async handlePurchaseNotification(update: any): Promise<void> {
    try {
      // Parse purchase notification
      const message = update.message.text;
      const userId = update.message.from.id.toString();
      const username = update.message.from.username || "unknown";
      
      // Extract deal info from message (this would be more sophisticated in real implementation)
      const dealId = this.extractDealIdFromMessage(message);
      const amount = this.extractAmountFromMessage(message);
      
      if (dealId && amount) {
        const commission = parseFloat(amount) * 0.08; // 8% commission
        
        await this.storage.createPurchase({
          dealId,
          userId,
          username,
          amount,
          commission: commission.toString(),
          telegramGroupId: 1 // Would be determined from context
        });

        console.log(`Purchase tracked: ${username} bought deal ${dealId} for ${amount}`);
      }
    } catch (error) {
      console.error("Failed to handle purchase notification:", error);
    }
  }

  private extractDealIdFromMessage(message: string): number | null {
    const match = message.match(/deal_id:(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  private extractAmountFromMessage(message: string): string | null {
    const match = message.match(/amount:(\d+\.?\d*)/);
    return match ? match[1] : null;
  }

  async postDealToGroup(dealId: number, groupId: number): Promise<void> {
    const deal = await this.storage.getDeal(dealId);
    const group = await this.storage.getTelegramGroup(groupId);
    
    if (!deal || !group) {
      throw new Error("Deal or group not found");
    }

    const platform = await this.storage.getPlatform(deal.platformId);
    if (!platform) {
      throw new Error("Platform not found");
    }

    console.log(`📤 AGENT: Posting deal "${deal.title}" to Telegram group "${group.name}"`);

    // Format deal message
    const message = this.formatDealMessage(deal, platform.displayName);
    
    // Send to Telegram
    if (this.botToken) {
      try {
        await this.sendMessage(group.chatId, message);
        console.log(`✅ AGENT: Successfully posted deal to ${group.name}`);
        
        // Notify you about the post
        await this.notifyOwner(`🎯 Deal Posted!\n\n"${deal.title}" was automatically posted to ${group.name}\n💰 ${deal.discountPercentage}% OFF - Save ₹${(parseFloat(deal.originalPrice) - parseFloat(deal.salePrice)).toLocaleString()}`);
      } catch (error) {
        console.error(`❌ AGENT: Failed to send to Telegram:`, error);
        throw error;
      }
    } else {
      console.log(`⚠️ AGENT: No bot token configured, simulating post to ${group.name}`);
    }
    
    // Update deal views
    await this.storage.updateDeal(dealId, { 
      views: (deal.views || 0) + 1 
    });

    // Update group stats
    await this.storage.updateTelegramGroup(groupId, {
      dealsPostedToday: (group.dealsPostedToday || 0) + 1,
      lastPostAt: new Date()
    });
  }

  private async notifyOwner(message: string): Promise<void> {
    const ownerChatId = process.env.OWNER_TELEGRAM_ID;
    if (ownerChatId && this.botToken) {
      try {
        await this.sendMessage(ownerChatId, `🤖 AGENT UPDATE\n\n${message}`);
      } catch (error) {
        console.error(`❌ AGENT: Failed to notify owner:`, error);
      }
    }
  }

  private formatDealMessage(deal: any, platformName: string): string {
    const savings = parseFloat(deal.originalPrice) - parseFloat(deal.salePrice);
    
    return `🔥 *HOT DEAL ALERT* 🔥

📱 *${deal.title}*

💰 *Price:* ₹${deal.salePrice} (was ₹${deal.originalPrice})
💸 *You Save:* ₹${savings.toFixed(0)} (${deal.discountPercentage}% OFF)
🏪 *Platform:* ${platformName}
📦 *Category:* ${deal.category}

${deal.description}

🛒 *Buy Now:* ${deal.affiliateUrl}

⚡ Limited time offer! Grab it before it's gone!

#Deal #${platformName} #${deal.category}`;
  }

  async sendMessage(chatId: string, message: string): Promise<void> {
    if (!this.botToken) {
      console.log("No bot token configured, skipping message send");
      return;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.statusText}`);
      }

      console.log("Message sent successfully to chat:", chatId);
    } catch (error) {
      console.error("Failed to send Telegram message:", error);
      throw error;
    }
  }
}
