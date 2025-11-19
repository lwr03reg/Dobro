import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { logger } from '../utils/logger';

export interface TrendingTopic {
  topic: string;
  category: string;
  icon: string;
  description: string;
}

export interface GuideStep {
  what: string;
  how: string;
  tool: string;
  example: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface Guide {
  topic: string;
  title: string;
  quote: string;
  steps: GuideStep[];
  quick_action: string;
  mistakes: string[];
  bonus: string;
  checklist?: string[];
  quiz?: QuizQuestion[];
}

class GeminiService {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor() {
    // Используем GEMINI_API_KEY если есть, иначе OPENAI_API_KEY для обратной совместимости
    const apiKey = config.GEMINI_API_KEY || config.OPENAI_API_KEY || '';
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY or OPENAI_API_KEY must be provided');
    }
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = 'gemini-1.5-flash'; // Бесплатная модель
  }

  /**
   * Анализ трендов с помощью Gemini
   */
  async getTrendingTopics(): Promise<{ topics: TrendingTopic[] }> {
    const startTime = Date.now();
    
    try {
      const prompt = `Ты - эксперт по анализу трендов в русскоязычном интернете.

Задача: Проанализируй актуальные тренды и выдай 6 самых популярных тем для создания цифровых руководств.

Критерии выбора:
- Высокий спрос (люди активно ищут информацию)
- Практическая польза (можно применить сразу)
- Монетизация (люди готовы платить за решение)
- Актуальность (тренд сейчас на пике)

Категории: Бизнес, Технологии, Маркетинг, Личная эффективность, Финансы, Творчество

Верни JSON массив из 6 объектов:
{
  "topics": [
    {
      "topic": "Конкретная тема (например: Запуск онлайн-школы с нуля)",
      "category": "Бизнес",
      "icon": "🚀",
      "description": "Краткое описание почему это актуально (1-2 предложения)"
    }
  ]
}

ВАЖНО: Верни ТОЛЬКО валидный JSON, без дополнительного текста.`;

      const model = this.client.getGenerativeModel({ 
        model: this.model,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2000,
        }
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Извлекаем JSON из ответа
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const data = JSON.parse(jsonMatch[0]);
      const duration = Date.now() - startTime;

      logger.info('Trending topics generated with Gemini', {
        duration,
        topicsCount: data.topics?.length
      });

      return data;
    } catch (error) {
      logger.error('Failed to get trending topics', { error });
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Генерация черновика руководства
   */
  async generateGuideDraft(topic: string): Promise<Guide> {
    const startTime = Date.now();

    try {
      const prompt = `Ты - эксперт по созданию практических руководств в стиле DOBRO ☘.

Тема: "${topic}"

Создай подробное пошаговое руководство по этой теме.

Структура:
1. Заголовок (в стиле "РЕШЕБНИК ДОБРА: [тема]")
2. Мотивирующая цитата
3. 5-7 конкретных шагов (что делать, как делать, какой инструмент использовать, пример)
4. Первый шаг к результату (quick action)
5. 3-5 частых ошибок
6. Секретный бонус (дополнительная ценность)

Требования:
- Конкретика, а не общие слова
- Реальные инструменты и примеры
- Практическая польза
- Простой язык
- Мотивация к действию

Верни JSON:
{
  "topic": "${topic}",
  "title": "РЕШЕБНИК ДОБРА: ...",
  "quote": "Мотивирующая цитата",
  "steps": [
    {
      "what": "Что делать",
      "how": "Как делать (подробно)",
      "tool": "Конкретный инструмент",
      "example": "Реальный пример"
    }
  ],
  "quick_action": "Первое действие прямо сейчас",
  "mistakes": ["Ошибка 1", "Ошибка 2", ...],
  "bonus": "Секретный бонус или дополнительная ценность"
}

ВАЖНО: Верни ТОЛЬКО валидный JSON.`;

      const model = this.client.getGenerativeModel({ model: this.model });
      const systemPrompt = 'Ты - эксперт по созданию практических руководств. Пишешь конкретно, с примерами и инструментами. Отвечаешь только валидным JSON.';
      const fullPrompt = `${systemPrompt}\n\n${prompt}`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const content = response.text();
      
      if (!content) {
        throw new Error('Empty response from Gemini');
      }

      const guide = JSON.parse(content);
      const duration = Date.now() - startTime;

      logger.info('Guide draft generated', {
        topic,
        duration,
        stepsCount: guide.steps?.length
      });

      return guide;
    } catch (error) {
      logger.error('Failed to generate guide draft', { topic, error });
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Валидация и улучшение руководства
   */
  async validateGuide(guide: Guide): Promise<Guide> {
    const startTime = Date.now();

    try {
      const prompt = `Ты - редактор и эксперт по качеству образовательного контента.

Проверь и улучши это руководство:

${JSON.stringify(guide, null, 2)}

Задачи:
1. Проверь логику и последовательность шагов
2. Убедись, что все шаги конкретные и выполнимые
3. Добавь больше деталей где нужно
4. Улучши примеры (сделай их более реалистичными)
5. Проверь, что инструменты актуальные
6. Усиль мотивационную составляющую

Верни улучшенную версию в том же JSON формате.

ВАЖНО: Верни ТОЛЬКО валидный JSON.`;

      const model = this.client.getGenerativeModel({ model: this.model });
      const systemPrompt = 'Ты - редактор образовательного контента. Улучшаешь качество, добавляешь конкретику. Отвечаешь только валидным JSON.';
      const fullPrompt = `${systemPrompt}\n\n${prompt}`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const content = response.text();
      
      if (!content) {
        throw new Error('Empty response from Gemini');
      }

      const validatedGuide = JSON.parse(content);
      const duration = Date.now() - startTime;

      logger.info('Guide validated', {
        topic: guide.topic,
        duration
      });

      return validatedGuide;
    } catch (error) {
      logger.error('Failed to validate guide', { topic: guide.topic, error });
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Генерация интерактивного контента (чек-лист или тест)
   */
  async generateInteractiveContent(
    guide: Guide,
    type: 'checklist' | 'quiz'
  ): Promise<Partial<Guide>> {
    const startTime = Date.now();

    try {
      let prompt: string;

      if (type === 'checklist') {
        prompt = `На основе этого руководства создай практический чек-лист из 7-10 пунктов:

${JSON.stringify(guide, null, 2)}

Чек-лист должен:
- Быть конкретным и выполнимым
- Следовать логике руководства
- Помогать отслеживать прогресс
- Мотивировать к действию

Верни JSON:
{
  "checklist": ["Пункт 1", "Пункт 2", ...]
}`;
      } else {
        prompt = `На основе этого руководства создай тест для самопроверки из 5 вопросов:

${JSON.stringify(guide, null, 2)}

Каждый вопрос должен:
- Проверять понимание ключевых моментов
- Иметь 3 варианта ответа
- Иметь один правильный ответ

Верни JSON:
{
  "quiz": [
    {
      "question": "Вопрос?",
      "options": ["Вариант 1", "Вариант 2", "Вариант 3"],
      "answer": "Правильный вариант"
    }
  ]
}`;
      }

      const model = this.client.getGenerativeModel({ model: this.model });
      const systemPrompt = 'Ты - эксперт по созданию интерактивного образовательного контента. Отвечаешь только валидным JSON.';
      const fullPrompt = `${systemPrompt}\n\n${prompt}`;
      
      const geminiResult = await model.generateContent(fullPrompt);
      const response = await geminiResult.response;
      const content = response.text();
      
      if (!content) {
        throw new Error('Empty response from Gemini');
      }

      const result = JSON.parse(content);
      const duration = Date.now() - startTime;

      logger.info('Interactive content generated', {
        type,
        topic: guide.topic,
        duration
      });

      return result;
    } catch (error) {
      logger.error('Failed to generate interactive content', { type, topic: guide.topic, error });
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Генерация маркетинговых материалов
   */
  async generateMarketingKit(guide: Guide): Promise<{
    socialPosts: string[];
    email: string;
    ozonDescription: string;
  }> {
    const startTime = Date.now();

    try {
      const prompt = `Создай маркетинговый комплект для этого руководства:

${JSON.stringify(guide, null, 2)}

Нужно:
1. 3 поста для соцсетей (Telegram/VK) - короткие, цепляющие, с призывом к действию
2. Email-рассылка - продающий текст для подписчиков
3. Описание для Ozon - SEO-оптимизированное описание товара

Верни JSON:
{
  "socialPosts": ["Пост 1", "Пост 2", "Пост 3"],
  "email": "Текст email",
  "ozonDescription": "Описание для Ozon"
}`;

      const model = this.client.getGenerativeModel({ model: this.model });
      const systemPrompt = 'Ты - маркетолог и копирайтер. Создаёшь продающие тексты. Отвечаешь только валидным JSON.';
      const fullPrompt = `${systemPrompt}\n\n${prompt}`;
      
      const geminiResult = await model.generateContent(fullPrompt);
      const response = await geminiResult.response;
      const content = response.text();
      
      if (!content) {
        throw new Error('Empty response from Gemini');
      }

      const result = JSON.parse(content);
      const duration = Date.now() - startTime;

      logger.info('Marketing kit generated', {
        topic: guide.topic,
        duration
      });

      return result;
    } catch (error) {
      logger.error('Failed to generate marketing kit', { topic: guide.topic, error });
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Генерация метаданных для Ozon
   */
  async generateOzonMetadata(guide: Guide, price: number): Promise<{
    name: string;
    description_rich: string;
    category_id_suggestions: number[];
    keywords: string[];
    price: number;
    vat: string;
  }> {
    const startTime = Date.now();

    try {
      const prompt = `Создай метаданные для публикации на Ozon:

Руководство: ${guide.title}
Тема: ${guide.topic}
Цена: ${price} ₽

Нужно:
1. Название товара (до 255 символов, SEO-оптимизированное)
2. Расширенное описание (HTML, до 5000 символов)
3. Ключевые слова (10-15 штук)
4. Предложения категорий Ozon (ID категорий для цифровых товаров)

Верни JSON:
{
  "name": "SEO-название",
  "description_rich": "<p>HTML описание</p>",
  "category_id_suggestions": [17036156, 17036157],
  "keywords": ["ключ1", "ключ2", ...],
  "price": ${price},
  "vat": "NOT_APPLICABLE"
}`;

      const model = this.client.getGenerativeModel({ model: this.model });
      const systemPrompt = 'Ты - эксперт по SEO и маркетплейсам. Создаёшь оптимизированные описания товаров. Отвечаешь только валидным JSON.';
      const fullPrompt = `${systemPrompt}\n\n${prompt}`;
      
      const geminiResult = await model.generateContent(fullPrompt);
      const response = await geminiResult.response;
      const content = response.text();
      
      if (!content) {
        throw new Error('Empty response from Gemini');
      }

      const result = JSON.parse(content);
      const duration = Date.now() - startTime;

      logger.info('Ozon metadata generated', {
        topic: guide.topic,
        duration
      });

      return result;
    } catch (error) {
      logger.error('Failed to generate Ozon metadata', { topic: guide.topic, error });
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const geminiService = new GeminiService();
// Экспортируем также как openaiService для обратной совместимости
export const openaiService = geminiService;
