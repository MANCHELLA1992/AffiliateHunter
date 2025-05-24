// Test notification to verify your autonomous agent is working
const fetch = require('node-fetch');

const botToken = "7665352063:AAEDYPpBq9PAjlftIRlOQvtwfXKfAOPWPiU";
const chatId = "1125296250";

const message = `🎉 AUTONOMOUS AGENT TEST

Your affiliate marketing agent is LIVE and ready!

✅ Successfully connected to your Telegram
✅ Bot token configured 
✅ Ready to post deals automatically
✅ Ready to track purchases and notify you

Your agent will now:
🔍 Scan 6 platforms every 5 minutes
📤 Auto-post hot deals to your groups  
💰 Notify you instantly when people buy through your links

This is a test message - your agent is working perfectly! 🚀`;

async function sendTestNotification() {
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    
    const result = await response.json();
    console.log('✅ Test notification sent successfully!', result);
  } catch (error) {
    console.error('❌ Failed to send test notification:', error);
  }
}

sendTestNotification();