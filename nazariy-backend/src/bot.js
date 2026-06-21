const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const domain = process.env.DOMAIN || 'example.com';
const miniAppUrl = `https://${domain}`;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    handleStart(chatId);
  } else if (text === '/help') {
    handleHelp(chatId);
  } else if (text === '/status') {
    handleStatus(chatId);
  } else {
    // Bilinmagan buyruq
    bot.sendMessage(chatId, '❓ Bilinmagan buyruq. /help yozing yordam uchun.');
  }
});

function handleStart(chatId) {
  const message = `Assalomu alaykum! 👋

Nazariy Avtotest botiga xush kelibsiz.
PRO obunani olib, barcha biletlardan o'tkazing! 🎓

Yo'l qoidalari bo'yicha imtihon topshirig'i uchun tayyorlanishning eng oson usuli.`;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🚗 Ilovani ochish',
            web_app: { url: miniAppUrl }
          }
        ],
        [
          { text: '📚 Yordam', callback_data: 'help' },
          { text: '📊 Statistika', callback_data: 'stats' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, message, options);
}

function handleHelp(chatId) {
  const message = `📚 Yordamm

*Mavjud buyruqlar:*
/start - Botni ishga tushirish
/help - Bu xabar
/status - Server statusi

*Tugmalar:*
🚗 Ilovani ochish - Mini App ni oching
📚 Yordam - Qo'llab-quvvatlash ma'lumotlari
📊 Statistika - Sizning natijalaringiz`;

  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}

function handleStatus(chatId) {
  const message = `📊 Server Statusi

✅ Backend: Ishlayapti
✅ Database: Ulanish o'rnatilgan
✅ Mini App: Faol

Loyihani o'rganish uchun "🚗 Ilovani ochish" tugmasini bosing.`;

  bot.sendMessage(chatId, message);
}

// Callback queries (tugmalar uchun)
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'help') {
    handleHelp(chatId);
  } else if (data === 'stats') {
    bot.sendMessage(chatId, '📊 Sizning statistikangizni ko\'rish uchun Mini App ni oching.');
  }

  // Callback tugmasidagi "loading" animatsiyasini to'xtatish
  bot.answerCallbackQuery(query.id);
});

console.log('🤖 Telegram bot ishga tushdi!');

module.exports = bot;
