import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config';
import { logger } from '../utils/logger';
import { openaiService } from './openai.service';
import { pdfService } from './pdf.service';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

class TelegramService {
  private bot: TelegramBot | null = null;
  private userStates: Map<number, { state: string; data?: any }> = new Map();

  constructor() {
    if (config.TELEGRAM_BOT_TOKEN && config.TELEGRAM_BOT_TOKEN !== 'your_bot_token_from_botfather') {
      this.initializeBot();
    } else {
      logger.warn('Telegram bot token not configured, bot will not start');
    }
  }

  private getWebAppUrl(): string {
    // Telegram Web App requires HTTPS
    if (config.FRONTEND_URL.startsWith('http://localhost')) {
      return 'https://3000--019a8dc5-1fb2-75da-b2ec-6a6e78647597.us-east-1-01.gitpod.dev';
    }
    return config.FRONTEND_URL;
  }

  private initializeBot() {
    try {
      this.bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN!, { polling: true });
      this.setupHandlers();
      logger.info('Telegram bot initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Telegram bot', { error });
    }
  }

  private setupHandlers() {
    if (!this.bot) return;

    // Command handlers
    this.bot.onText(/\/start/, (msg) => this.handleStart(msg));
    this.bot.onText(/\/new/, (msg) => this.handleNew(msg));
    this.bot.onText(/\/list/, (msg) => this.handleList(msg));
    this.bot.onText(/\/trending/, (msg) => this.handleTrending(msg));
    this.bot.onText(/\/settings/, (msg) => this.handleSettings(msg));
    this.bot.onText(/\/help/, (msg) => this.handleHelp(msg));
    this.bot.onText(/\/cancel/, (msg) => this.handleCancel(msg));
    this.bot.onText(/\/stats/, (msg) => this.handleStats(msg));

    // Callback query handler (for inline buttons)
    this.bot.on('callback_query', (query) => this.handleCallbackQuery(query));

    // Message handler (for text input)
    this.bot.on('message', (msg) => this.handleMessage(msg));

    // Error handler
    this.bot.on('polling_error', (error) => {
      logger.error('Telegram polling error', { error });
    });
  }

  private async handleStart(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const firstName = msg.from?.first_name || 'друг';

    logger.info('Received /start command', { 
      chatId, 
      firstName, 
      username: msg.from?.username 
    });

    // Check if user exists, create if not
    const telegramId = msg.from?.id.toString();
    if (telegramId) {
      await this.getOrCreateUser(telegramId, msg.from!);
    }

    const welcomeMessage = `
╔═══════════════════════════════╗
║   🌟 *DOBRO GUIDE CREATOR*   ║
╚═══════════════════════════════╝

Привет, *${firstName}*! 👋

Я твой AI-помощник для создания профессиональных благотворительных гайдов.

┌─────────────────────────────┐
│  ✨ *МОИ ВОЗМОЖНОСТИ*        │
└─────────────────────────────┘

🎯 *Генерация гайдов* за 15 секунд
📊 *Трендовые темы* для вдохновения
📄 *PDF экспорт* профессионального качества
🎨 *Маркетинг-киты* для продвижения
📈 *Аналитика* эффективности

┌─────────────────────────────┐
│  🚀 *БЫСТРЫЙ СТАРТ*          │
└─────────────────────────────┘

Выбери действие ниже или используй команды:

• /new - Создать гайд
• /list - Мои гайды  
• /trending - Тренды
• /help - Помощь

_Создано с ❤️ для благотворительности_
    `;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '✨ Создать гайд', callback_data: 'new_guide' },
        ],
        [
          { text: '📚 Мои гайды', callback_data: 'my_guides' },
          { text: '🔥 Тренды', callback_data: 'trending' },
        ],
        [
          { text: '📊 Статистика', callback_data: 'stats' },
          { text: '⚙️ Настройки', callback_data: 'settings' },
        ],
        [
          { text: '🌐 Открыть Web App', web_app: { url: this.getWebAppUrl() } },
        ],
        [
          { text: '❓ Помощь', callback_data: 'help' },
        ],
      ],
    };

    await this.sendMessage(chatId, welcomeMessage, { reply_markup: keyboard });
  }

  private async handleNew(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;

    if (!userId) return;

    // Set user state to waiting for topic
    this.userStates.set(userId, { state: 'waiting_topic' });

    const message = `
╔═══════════════════════════════╗
║  ✨ *СОЗДАНИЕ ГАЙДА*          ║
╚═══════════════════════════════╝

*Шаг 1 из 3* • Выбор темы

┌─────────────────────────────┐
│  💡 *КАК ЭТО РАБОТАЕТ*       │
└─────────────────────────────┘

1️⃣ Напиши тему своими словами
2️⃣ Или выбери из трендов (/trending)
3️⃣ AI создаст профессиональный гайд

┌─────────────────────────────┐
│  🎯 *ПРИМЕРЫ ТЕМ*            │
└─────────────────────────────┘

🏠 Помощь детским домам
🏃 Организация благотворительного забега  
🐾 Сбор средств для приюта животных
🏥 Волонтёрство в больницах
🎓 Помощь студентам из малообеспеченных семей

┌─────────────────────────────┐
│  ✍️ *ТВОЯ ТЕМА*              │
└─────────────────────────────┘

Напиши тему гайда ниже ⬇️

_Или нажми /cancel для отмены_
    `;

    await this.sendMessage(chatId, message);
  }

  private async handleList(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const telegramId = msg.from?.id.toString();

    if (!telegramId) return;

    try {
      const user = await this.getOrCreateUser(telegramId, msg.from!);
      const guides = await prisma.guide.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      if (guides.length === 0) {
        await this.sendMessage(
          chatId,
          '📚 *Мои гайды*\n\nУ тебя пока нет созданных гайдов.\n\nСоздай первый гайд командой /new! ✨'
        );
        return;
      }

      let message = '📚 *Твои гайды:*\n\n';
      const keyboard: TelegramBot.InlineKeyboardButton[][] = [];

      guides.forEach((guide, index) => {
        message += `${index + 1}. ${guide.title || guide.topic}\n`;
        message += `   📅 ${new Date(guide.createdAt).toLocaleDateString('ru-RU')}\n`;
        message += `   📊 Статус: ${this.getStatusEmoji(guide.status)} ${guide.status}\n\n`;

        keyboard.push([
          {
            text: `📄 ${guide.title?.substring(0, 30) || guide.topic}`,
            callback_data: `view_guide_${guide.id}`,
          },
        ]);
      });

      keyboard.push([{ text: '✨ Создать новый', callback_data: 'new_guide' }]);

      await this.sendMessage(chatId, message, {
        reply_markup: { inline_keyboard: keyboard },
      });
    } catch (error) {
      logger.error('Error fetching guides', { error, telegramId });
      await this.sendMessage(chatId, '❌ Ошибка при загрузке гайдов. Попробуй позже.');
    }
  }

  private async handleTrending(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;

    await this.sendMessage(chatId, '🔥 Загружаю трендовые темы...');

    try {
      const topics = await openaiService.getTrendingTopics();

      let message = '🔥 *Трендовые темы для гайдов:*\n\n';
      const keyboard: TelegramBot.InlineKeyboardButton[][] = [];

      topics.topics.forEach((topic: string, index: number) => {
        message += `${index + 1}. ${topic}\n`;
        keyboard.push([
          {
            text: `✨ ${topic.substring(0, 40)}`,
            callback_data: `create_from_topic_${index}`,
          },
        ]);
      });

      message += '\nВыбери тему или напиши свою командой /new';

      await this.sendMessage(chatId, message, {
        reply_markup: { inline_keyboard: keyboard },
      });

      // Store topics in user state
      if (msg.from?.id) {
        this.userStates.set(msg.from.id, { state: 'trending', data: { topics } });
      }
    } catch (error) {
      logger.error('Error fetching trending topics', { error });
      await this.sendMessage(chatId, '❌ Ошибка при загрузке трендов. Попробуй позже.');
    }
  }

  private async handleStats(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const telegramId = msg.from?.id.toString();

    if (!telegramId) return;

    try {
      const user = await this.getOrCreateUser(telegramId, msg.from!);
      const guides = await prisma.guide.findMany({
        where: { userId: user.id },
      });

      const subscription = await prisma.subscription.findFirst({
        where: { userId: user.id },
      });

      const completedGuides = guides.filter(g => g.status === 'COMPLETED').length;
      const draftGuides = guides.filter(g => g.status === 'DRAFT').length;

      const message = `
╔═══════════════════════════════╗
║  📊 *ТВОЯ СТАТИСТИКА*        ║
╚═══════════════════════════════╝

┌─────────────────────────────┐
│  📈 *ОБЩАЯ СТАТИСТИКА*       │
└─────────────────────────────┘

📝 Всего гайдов: *${guides.length}*
✅ Завершённых: *${completedGuides}*
📋 Черновиков: *${draftGuides}*

┌─────────────────────────────┐
│  💎 *ПОДПИСКА*               │
└─────────────────────────────┘

📦 План: *${subscription?.tier || 'FREE'}*
🎯 Использовано: *${subscription?.guidesUsed || 0}* / *${subscription?.guidesLimit || 5}*
📅 Статус: *${subscription?.status || 'ACTIVE'}*

┌─────────────────────────────┐
│  🏆 *ДОСТИЖЕНИЯ*             │
└─────────────────────────────┘

${guides.length >= 1 ? '🌟 Первый гайд создан!' : ''}
${guides.length >= 5 ? '⭐ 5 гайдов создано!' : ''}
${guides.length >= 10 ? '💫 10 гайдов - ты профи!' : ''}

_Продолжай создавать добро! ❤️_
      `;

      const keyboard = {
        inline_keyboard: [
          [
            { text: '✨ Создать гайд', callback_data: 'new_guide' },
          ],
          [
            { text: '💎 Улучшить план', callback_data: 'upgrade' },
          ],
          [
            { text: '🏠 Главное меню', callback_data: 'start' },
          ],
        ],
      };

      await this.sendMessage(chatId, message, { reply_markup: keyboard });
    } catch (error) {
      logger.error('Error fetching stats', { error, telegramId });
      await this.sendMessage(chatId, '❌ Ошибка при загрузке статистики');
    }
  }

  private async handleSettings(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;

    const message = `
⚙️ *Настройки*

*Текущие настройки:*
🌐 Язык: Русский
🎨 Стиль: Тёплый и дружелюбный
📊 Уведомления: Включены

*Доступные команды:*
/new - Создать гайд
/list - Мои гайды
/trending - Тренды
/help - Помощь

*Подписка:*
📦 План: Free
📝 Гайдов создано: 0 / 5

Хочешь больше возможностей? Открой Web App! 🌐
    `;

    const keyboard = {
      inline_keyboard: [
        [{ text: '🌐 Открыть Web App', web_app: { url: this.getWebAppUrl() } }],
        [{ text: '🔙 Назад', callback_data: 'start' }],
      ],
    };

    await this.sendMessage(chatId, message, { reply_markup: keyboard });
  }

  private async handleHelp(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;

    const message = `
❓ *Помощь*

*Основные команды:*
/start - Начать работу
/new - Создать новый гайд
/list - Посмотреть мои гайды
/trending - Трендовые темы
/settings - Настройки
/help - Эта справка
/cancel - Отменить текущее действие

*Как создать гайд:*
1️⃣ Нажми /new
2️⃣ Напиши тему гайда
3️⃣ Выбери целевую аудиторию
4️⃣ Выбери тон повествования
5️⃣ Получи готовый гайд!

*Возможности:*
✨ AI генерация контента
📄 Экспорт в PDF
🎨 Маркетинг-киты
🔥 Трендовые темы
📊 Статистика

*Нужна помощь?*
Напиши @support или открой Web App для полного функционала.

*Web App:*
Для расширенных возможностей используй Web App - нажми кнопку ниже! 🌐
    `;

    const keyboard = {
      inline_keyboard: [
        [{ text: '🌐 Открыть Web App', web_app: { url: this.getWebAppUrl() } }],
        [{ text: '✨ Создать гайд', callback_data: 'new_guide' }],
      ],
    };

    await this.sendMessage(chatId, message, { reply_markup: keyboard });
  }

  private async handleCancel(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;

    if (userId) {
      this.userStates.delete(userId);
    }

    await this.sendMessage(chatId, '❌ Действие отменено.\n\nЧто дальше? /new /list /help');
  }

  private async handleCallbackQuery(query: TelegramBot.CallbackQuery) {
    const chatId = query.message?.chat.id;
    const userId = query.from.id;
    const data = query.data;

    if (!chatId || !data) return;

    // Answer callback query to remove loading state
    await this.bot?.answerCallbackQuery(query.id);

    // Handle different callback actions
    if (data === 'new_guide') {
      await this.handleNew(query.message!);
    } else if (data === 'trending') {
      await this.handleTrending(query.message!);
    } else if (data === 'my_guides') {
      await this.handleList(query.message!);
    } else if (data === 'help') {
      await this.handleHelp(query.message!);
    } else if (data === 'start') {
      await this.handleStart(query.message!);
    } else if (data === 'stats') {
      await this.handleStats(query.message!);
    } else if (data === 'settings') {
      await this.handleSettings(query.message!);
    } else if (data.startsWith('create_from_topic_')) {
      const index = parseInt(data.replace('create_from_topic_', ''));
      const userState = this.userStates.get(userId);
      if (userState?.data?.topics) {
        const topic = userState.data.topics[index];
        await this.startGuideCreation(chatId, userId, topic);
      }
    } else if (data.startsWith('view_guide_')) {
      const guideId = data.replace('view_guide_', '');
      await this.viewGuide(chatId, guideId);
    } else if (data.startsWith('download_pdf_')) {
      const guideId = data.replace('download_pdf_', '');
      await this.downloadPDF(chatId, userId, guideId);
    } else if (data.startsWith('audience_')) {
      const audience = data.replace('audience_', '');
      await this.setAudience(chatId, userId, audience);
    } else if (data.startsWith('tone_')) {
      const tone = data.replace('tone_', '');
      await this.setTone(chatId, userId, tone);
    } else if (data.startsWith('marketing_')) {
      const guideId = data.replace('marketing_', '');
      await this.sendMessage(chatId, '🎨 Функция создания маркетинг-кита будет доступна в следующей версии!');
    } else if (data === 'upgrade') {
      await this.sendMessage(chatId, '💎 Функция улучшения плана будет доступна в следующей версии!');
    } else if (data === 'back_to_audience') {
      // Return to audience selection
      const userState = this.userStates.get(userId);
      if (userState?.data?.topic) {
        await this.startGuideCreation(chatId, userId, userState.data.topic);
      }
    }
  }

  private async handleMessage(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;
    const text = msg.text;

    if (!userId || !text) return;

    // Ignore commands
    if (text.startsWith('/')) return;

    // Check user state
    const userState = this.userStates.get(userId);

    if (userState?.state === 'waiting_topic') {
      await this.startGuideCreation(chatId, userId, text);
    } else if (userState?.state === 'waiting_audience') {
      await this.setAudience(chatId, userId, text);
    }
  }

  private async startGuideCreation(chatId: number, userId: number, topic: string) {
    this.userStates.set(userId, { state: 'waiting_audience', data: { topic } });

    const message = `
╔═══════════════════════════════╗
║  ✨ *СОЗДАНИЕ ГАЙДА*          ║
╚═══════════════════════════════╝

*Шаг 2 из 3* • Целевая аудитория

┌─────────────────────────────┐
│  📝 *ТВОЯ ТЕМА*              │
└─────────────────────────────┘

${topic}

┌─────────────────────────────┐
│  👥 *ДЛЯ КОГО ЭТОТ ГАЙД?*    │
└─────────────────────────────┘

Выбери целевую аудиторию ниже ⬇️

_Это поможет AI адаптировать контент_
    `;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '👨‍👩‍👧‍👦 Семьи с детьми', callback_data: 'audience_Семьи с детьми' },
        ],
        [
          { text: '👨‍💼 Предприниматели', callback_data: 'audience_Предприниматели' },
        ],
        [
          { text: '🎓 Студенты и молодёжь', callback_data: 'audience_Студенты' },
        ],
        [
          { text: '👴 Пенсионеры', callback_data: 'audience_Пенсионеры' },
        ],
        [
          { text: '🌍 Широкая аудитория', callback_data: 'audience_Широкая аудитория' },
        ],
        [
          { text: '🔙 Назад', callback_data: 'new_guide' },
          { text: '❌ Отмена', callback_data: 'start' },
        ],
      ],
    };

    await this.sendMessage(chatId, message, { reply_markup: keyboard });
  }

  private async setAudience(chatId: number, userId: number, audience: string) {
    const userState = this.userStates.get(userId);
    if (!userState?.data?.topic) return;

    this.userStates.set(userId, {
      state: 'waiting_tone',
      data: { ...userState.data, audience },
    });

    const message = `
╔═══════════════════════════════╗
║  ✨ *СОЗДАНИЕ ГАЙДА*          ║
╚═══════════════════════════════╝

*Шаг 3 из 3* • Тон повествования

┌─────────────────────────────┐
│  📝 *ПАРАМЕТРЫ ГАЙДА*        │
└─────────────────────────────┘

📌 *Тема:* ${userState.data.topic}
👥 *Аудитория:* ${audience}

┌─────────────────────────────┐
│  🎨 *ВЫБЕРИ СТИЛЬ*           │
└─────────────────────────────┘

Какой тон повествования предпочитаешь?

_Это последний шаг перед генерацией!_
    `;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '😊 Тёплый и дружелюбный', callback_data: 'tone_warm' },
        ],
        [
          { text: '💼 Деловой и профессиональный', callback_data: 'tone_professional' },
        ],
        [
          { text: '🎉 Вдохновляющий и мотивирующий', callback_data: 'tone_inspiring' },
        ],
        [
          { text: '📚 Образовательный и информативный', callback_data: 'tone_educational' },
        ],
        [
          { text: '🔙 Назад', callback_data: 'back_to_audience' },
          { text: '❌ Отмена', callback_data: 'start' },
        ],
      ],
    };

    await this.sendMessage(chatId, message, { reply_markup: keyboard });
  }

  private async setTone(chatId: number, userId: number, tone: string) {
    const userState = this.userStates.get(userId);
    if (!userState?.data?.topic) return;

    const { topic, audience } = userState.data;

    await this.sendMessage(
      chatId,
      `╔═══════════════════════════════╗
║  🤖 *AI ГЕНЕРАЦИЯ*            ║
╚═══════════════════════════════╝

⏳ *Создаю твой гайд...*

┌─────────────────────────────┐
│  🔄 *ПРОЦЕСС*                │
└─────────────────────────────┘

▰▰▰▱▱▱▱▱▱▱ 30%

✨ Анализирую тему...
📊 Подбираю структуру...
🎯 Генерирую контент...

_Это займёт 10-15 секунд_

☕ Можешь налить чай!`
    );

    try {
      // Generate guide
      const guide = await openaiService.generateGuideDraft(topic, audience, tone);

      // Save to database
      const telegramId = userId.toString();
      const user = await this.getOrCreateUser(telegramId, { id: userId } as any);

      const savedGuide = await prisma.guide.create({
        data: {
          userId: user.id,
          topic,
          title: guide.title,
          quote: guide.quote,
          steps: guide.steps,
          quickAction: guide.quick_action,
          mistakes: guide.mistakes,
          bonus: guide.bonus,
          status: 'DRAFT',
        },
      });

      // Clear user state
      this.userStates.delete(userId);

      // Send success message
      let message = `
╔═══════════════════════════════╗
║  ✅ *ГАЙД ГОТОВ!*            ║
╚═══════════════════════════════╝

*${guide.title}*

┌─────────────────────────────┐
│  💭 *ЦИТАТА*                 │
└─────────────────────────────┘

_"${guide.quote}"_

┌─────────────────────────────┐
│  📊 *СТАТИСТИКА*             │
└─────────────────────────────┘

📝 Шагов: *${guide.steps.length}*
⚠️ Частых ошибок: *${guide.mistakes.length}*
🎁 Бонусов: *1*

┌─────────────────────────────┐
│  🎯 *ЧТО ДАЛЬШЕ?*            │
└─────────────────────────────┘

Выбери действие ниже ⬇️
      `;

      const keyboard = {
        inline_keyboard: [
          [
            { text: '📄 Скачать PDF', callback_data: `download_pdf_${savedGuide.id}` },
          ],
          [
            { text: '👁️ Просмотреть гайд', callback_data: `view_guide_${savedGuide.id}` },
          ],
          [
            { text: '🎨 Создать маркетинг-кит', callback_data: `marketing_${savedGuide.id}` },
          ],
          [
            { text: '✨ Создать ещё один', callback_data: 'new_guide' },
            { text: '📚 Все гайды', callback_data: 'my_guides' },
          ],
          [
            { text: '🏠 Главное меню', callback_data: 'start' },
          ],
        ],
      };

      await this.sendMessage(chatId, message, { reply_markup: keyboard });
    } catch (error) {
      logger.error('Error generating guide', { error, topic });
      await this.sendMessage(
        chatId,
        '❌ Ошибка при генерации гайда. Попробуй ещё раз командой /new'
      );
      this.userStates.delete(userId);
    }
  }

  private async viewGuide(chatId: number, guideId: string) {
    try {
      const guide = await prisma.guide.findUnique({ where: { id: guideId } });

      if (!guide) {
        await this.sendMessage(chatId, '❌ Гайд не найден');
        return;
      }

      const steps = (guide.steps as any[]) || [];
      const mistakes = (guide.mistakes as any[]) || [];

      let message = `
📄 *${guide.title || guide.topic}*

${guide.quote ? `_${guide.quote}_\n` : ''}

*Шаги (${steps.length}):*
${steps.slice(0, 3).map((step: any, i: number) => `${i + 1}. ${step.what}`).join('\n')}
${steps.length > 3 ? `\n... и ещё ${steps.length - 3} шагов` : ''}

*Частые ошибки (${mistakes.length}):*
${mistakes.slice(0, 2).map((m: string, i: number) => `${i + 1}. ${m}`).join('\n')}
${mistakes.length > 2 ? `\n... и ещё ${mistakes.length - 2}` : ''}

*Статус:* ${this.getStatusEmoji(guide.status)} ${guide.status}
*Создан:* ${new Date(guide.createdAt).toLocaleDateString('ru-RU')}
      `;

      const keyboard = {
        inline_keyboard: [
          [{ text: '📄 Скачать PDF', callback_data: `download_pdf_${guide.id}` }],
          [{ text: '🔙 К списку', callback_data: 'my_guides' }],
        ],
      };

      await this.sendMessage(chatId, message, { reply_markup: keyboard });
    } catch (error) {
      logger.error('Error viewing guide', { error, guideId });
      await this.sendMessage(chatId, '❌ Ошибка при загрузке гайда');
    }
  }

  private async downloadPDF(chatId: number, userId: number, guideId: string) {
    try {
      await this.sendMessage(chatId, '📄 Генерирую PDF... Подожди немного.');

      const guide = await prisma.guide.findUnique({ where: { id: guideId } });

      if (!guide) {
        await this.sendMessage(chatId, '❌ Гайд не найден');
        return;
      }

      // Generate PDF
      const pdfPath = await pdfService.generatePDF(guide as any, guide.userId);

      // Update guide with PDF URL
      await prisma.guide.update({
        where: { id: guideId },
        data: { pdfUrl: pdfPath, status: 'COMPLETED' },
      });

      // Send PDF file
      if (fs.existsSync(pdfPath)) {
        await this.bot?.sendDocument(chatId, pdfPath, {
          caption: `📄 ${guide.title || guide.topic}\n\n✅ Твой гайд готов!`,
        });

        await this.sendMessage(
          chatId,
          '✅ PDF отправлен!\n\nСоздать ещё один гайд? /new'
        );
      } else {
        await this.sendMessage(chatId, '❌ Ошибка при создании PDF');
      }
    } catch (error) {
      logger.error('Error downloading PDF', { error, guideId });
      await this.sendMessage(chatId, '❌ Ошибка при создании PDF. Попробуй позже.');
    }
  }

  private async getOrCreateUser(telegramId: string, telegramUser: any) {
    let user = await prisma.user.findFirst({
      where: { email: `telegram_${telegramId}@dobro.app` },
    });

    if (!user) {
      // Create user
      user = await prisma.user.create({
        data: {
          email: `telegram_${telegramId}@dobro.app`,
          name: telegramUser.first_name || 'Telegram User',
          passwordHash: 'telegram_auth_not_used', // Placeholder, not used for Telegram auth
          role: 'USER',
        },
      });

      // Create free subscription
      await prisma.subscription.create({
        data: {
          userId: user.id,
          tier: 'FREE',
          status: 'ACTIVE',
          guidesLimit: 5,
          guidesUsed: 0,
        },
      });

      logger.info('Created new user from Telegram', { telegramId, userId: user.id });
    }

    return user;
  }

  private async sendMessage(
    chatId: number,
    text: string,
    options?: TelegramBot.SendMessageOptions
  ) {
    if (!this.bot) return;

    try {
      logger.info('Sending message to Telegram', { chatId, textLength: text.length });
      await this.bot.sendMessage(chatId, text, {
        parse_mode: 'Markdown',
        ...options,
      });
      logger.info('Message sent successfully', { chatId });
    } catch (error) {
      logger.error('Error sending Telegram message', { error, chatId });
    }
  }

  private getStatusEmoji(status: string): string {
    const emojis: Record<string, string> = {
      DRAFT: '📝',
      COMPLETED: '✅',
      PUBLISHED: '🌐',
      ARCHIVED: '📦',
    };
    return emojis[status] || '📄';
  }

  public async setWebhook(url: string) {
    if (!this.bot) {
      throw new Error('Bot not initialized');
    }

    try {
      await this.bot.setWebHook(url);
      logger.info('Telegram webhook set', { url });
    } catch (error) {
      logger.error('Error setting webhook', { error, url });
      throw error;
    }
  }

  public async deleteWebhook() {
    if (!this.bot) return;

    try {
      await this.bot.deleteWebHook();
      logger.info('Telegram webhook deleted');
    } catch (error) {
      logger.error('Error deleting webhook', { error });
    }
  }

  public getBot(): TelegramBot | null {
    return this.bot;
  }
}

export const telegramService = new TelegramService();
