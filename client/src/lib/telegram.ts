export interface TelegramMessage {
  text: string;
  parse_mode?: 'Markdown' | 'HTML';
  disable_web_page_preview?: boolean;
  reply_markup?: {
    inline_keyboard?: Array<Array<{
      text: string;
      url?: string;
      callback_data?: string;
    }>>;
  };
}

export interface TelegramWebhookUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
      title?: string;
    };
    date: number;
    text?: string;
  };
  callback_query?: {
    id: string;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    data: string;
  };
}

export class TelegramAPI {
  private botToken: string;
  private baseUrl: string;

  constructor(botToken: string) {
    this.botToken = botToken;
    this.baseUrl = `https://api.telegram.org/bot${botToken}`;
  }

  async sendMessage(chatId: string | number, message: TelegramMessage): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          ...message,
        }),
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
      return false;
    }
  }

  async setWebhook(webhookUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query'],
        }),
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('Failed to set webhook:', error);
      return false;
    }
  }

  async getMe(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/getMe`);
      const result = await response.json();
      return result.ok ? result.result : null;
    } catch (error) {
      console.error('Failed to get bot info:', error);
      return null;
    }
  }

  async getChatMemberCount(chatId: string | number): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/getChatMemberCount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
        }),
      });

      const result = await response.json();
      return result.ok ? result.result : 0;
    } catch (error) {
      console.error('Failed to get chat member count:', error);
      return 0;
    }
  }

  formatDealMessage(deal: any, platformName: string): TelegramMessage {
    const savings = parseFloat(deal.originalPrice) - parseFloat(deal.salePrice);
    
    const text = `🔥 *HOT DEAL ALERT* 🔥

📱 *${deal.title}*

💰 *Price:* ₹${parseFloat(deal.salePrice).toLocaleString()} (was ₹${parseFloat(deal.originalPrice).toLocaleString()})
💸 *You Save:* ₹${savings.toLocaleString()} (${deal.discountPercentage}% OFF)
🏪 *Platform:* ${platformName}
📦 *Category:* ${deal.category}

${deal.description || ''}

⚡ Limited time offer! Grab it before it's gone!

#Deal #${platformName.replace(/\s+/g, '')} #${deal.category.replace(/\s+/g, '')}`;

    return {
      text,
      parse_mode: 'Markdown',
      disable_web_page_preview: false,
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🛒 Buy Now',
            url: deal.affiliateUrl,
          },
          {
            text: '🔗 Original Link',
            url: deal.productUrl,
          }
        ]]
      }
    };
  }

  extractPurchaseInfo(message: string): {
    dealId?: number;
    amount?: string;
    userId?: string;
  } {
    const dealIdMatch = message.match(/deal_id:(\d+)/);
    const amountMatch = message.match(/amount:([\d.]+)/);
    const userIdMatch = message.match(/user_id:(\d+)/);

    return {
      dealId: dealIdMatch ? parseInt(dealIdMatch[1]) : undefined,
      amount: amountMatch ? amountMatch[1] : undefined,
      userId: userIdMatch ? userIdMatch[1] : undefined,
    };
  }
}

export const createTelegramAPI = (botToken?: string): TelegramAPI | null => {
  if (!botToken) {
    console.warn('Telegram bot token not provided');
    return null;
  }
  return new TelegramAPI(botToken);
};
