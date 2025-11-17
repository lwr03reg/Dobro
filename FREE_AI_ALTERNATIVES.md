# 🆓 БЕСПЛАТНЫЕ АЛЬТЕРНАТИВЫ OpenAI

> **Вопрос**: Что можно использовать вместо OpenAI API key?

---

## 🎯 ЛУЧШИЕ БЕСПЛАТНЫЕ ВАРИАНТЫ

### ✅ Вариант 1: Ollama (Локальный AI) - РЕКОМЕНДУЕТСЯ

**Полностью бесплатно, работает на твоём компьютере:**

```bash
# 1. Установи Ollama
# Mac/Linux:
curl -fsSL https://ollama.com/install.sh | sh

# Windows:
# Скачай с https://ollama.com/download

# 2. Запусти модель
ollama run llama3.2

# 3. Ollama API будет доступен на http://localhost:11434
```

**Преимущества:**
- ✅ Полностью бесплатно
- ✅ Без лимитов
- ✅ Работает офлайн
- ✅ Приватность (данные не уходят в интернет)

**Недостатки:**
- ⚠️ Нужен мощный компьютер (8GB+ RAM)
- ⚠️ Качество ниже чем GPT-4

**Модели:**
- `llama3.2` - 3B параметров (быстрая, 4GB RAM)
- `llama3.1` - 8B параметров (средняя, 8GB RAM)
- `mistral` - 7B параметров (хорошая для кода)

---

### ✅ Вариант 2: Google AI Studio (Gemini) - БЕСПЛАТНО

**Google дает бесплатный доступ к Gemini:**

```bash
# 1. Зайди на https://aistudio.google.com/
# 2. Получи API key (бесплатно)
# 3. Используй Gemini API
```

**Бесплатный лимит:**
- ✅ 60 запросов в минуту
- ✅ 1500 запросов в день
- ✅ Полностью бесплатно

**Качество:**
- Gemini 1.5 Flash - быстрая, хорошая
- Gemini 1.5 Pro - медленнее, лучше качество

---

### ✅ Вариант 3: Groq (Бесплатный API) - ОЧЕНЬ БЫСТРО

**Groq дает бесплатный доступ к LLaMA:**

```bash
# 1. Зарегистрируйся на https://console.groq.com/
# 2. Получи API key (бесплатно)
# 3. Используй Groq API
```

**Бесплатный лимит:**
- ✅ 30 запросов в минуту
- ✅ Очень быстрая генерация
- ✅ LLaMA 3.1 70B модель

**Преимущества:**
- Самая быстрая генерация
- Хорошее качество
- Бесплатно

---

### ✅ Вариант 4: Hugging Face (Бесплатный API)

**Hugging Face Inference API:**

```bash
# 1. Зарегистрируйся на https://huggingface.co/
# 2. Получи API token (бесплатно)
# 3. Используй любую модель
```

**Бесплатный лимит:**
- ✅ 1000 запросов в день
- ✅ Доступ к тысячам моделей
- ✅ Полностью бесплатно

---

## 🔧 КАК ИНТЕГРИРОВАТЬ В DOBRO

### Для Ollama (локально):

```typescript
// backend/src/services/ollama.service.ts
import axios from 'axios';

const OLLAMA_URL = 'http://localhost:11434/api/generate';

async function generateWithOllama(prompt: string) {
  const response = await axios.post(OLLAMA_URL, {
    model: 'llama3.2',
    prompt: prompt,
    stream: false
  });
  
  return response.data.response;
}
```

### Для Gemini:

```typescript
// backend/src/services/gemini.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function generateWithGemini(prompt: string) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### Для Groq:

```typescript
// backend/src/services/groq.service.ts
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateWithGroq(prompt: string) {
  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.1-70b-versatile',
  });
  
  return completion.choices[0].message.content;
}
```

---

## 📊 СРАВНЕНИЕ

| Вариант | Стоимость | Качество | Скорость | Лимиты |
|---------|-----------|----------|----------|--------|
| **Ollama** | 0₽ | ⭐⭐⭐ | ⭐⭐⭐⭐ | Нет |
| **Gemini** | 0₽ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 1500/день |
| **Groq** | 0₽ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 30/мин |
| **HuggingFace** | 0₽ | ⭐⭐⭐ | ⭐⭐ | 1000/день |
| **OpenAI** | $5 → $$ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Pay-as-go |

---

## 🎯 РЕКОМЕНДАЦИЯ ДЛЯ DOBRO

### Для разработки и тестирования:

**1. Ollama (локально)**
- Полностью бесплатно
- Без лимитов
- Хорошо для тестирования

**2. Gemini (Google)**
- Бесплатно
- Хорошее качество
- 1500 запросов в день (достаточно для тестов)

### Для production:

**1. Groq**
- Бесплатно
- Очень быстро
- Хорошее качество

**2. OpenAI (платно)**
- Лучшее качество
- Стабильно
- ~$0.05 за руководство

---

## 🚀 БЫСТРЫЙ СТАРТ С OLLAMA

### Шаг 1: Установи Ollama

```bash
# Mac/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Скачай с https://ollama.com/download
```

### Шаг 2: Запусти модель

```bash
# Скачай и запусти LLaMA 3.2
ollama run llama3.2

# Проверь, что работает
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Привет, как дела?",
  "stream": false
}'
```

### Шаг 3: Обнови DOBRO backend

```bash
# Установи зависимость
cd backend
npm install axios

# Создай ollama.service.ts (код выше)

# Обнови .env
OLLAMA_URL=http://localhost:11434
AI_PROVIDER=ollama  # вместо openai
```

---

## 🆓 БЫСТРЫЙ СТАРТ С GEMINI

### Шаг 1: Получи API key

1. Зайди на https://aistudio.google.com/
2. Нажми "Get API key"
3. Создай ключ (бесплатно)
4. Скопируй

### Шаг 2: Обнови .env

```bash
# Вместо OPENAI_API_KEY используй
GEMINI_API_KEY=твой-ключ-здесь
AI_PROVIDER=gemini
```

### Шаг 3: Используй существующий код

**У тебя уже есть Gemini в зависимостях!**

```json
// backend/package.json
"dependencies": {
  "@google/genai": "^1.29.0"  // ✅ Уже установлено!
}
```

Просто измени `openai.service.ts` на `gemini.service.ts`

---

## 💡 МОЯ РЕКОМЕНДАЦИЯ

### Для тебя прямо сейчас:

**Используй Gemini (Google AI Studio):**

1. ✅ Полностью бесплатно
2. ✅ Хорошее качество
3. ✅ 1500 запросов в день (достаточно для тестов)
4. ✅ Зависимость уже установлена в проекте
5. ✅ Получить ключ за 2 минуты

**Шаги:**
```bash
# 1. Получи ключ
https://aistudio.google.com/

# 2. Добавь в .env
GEMINI_API_KEY=твой-ключ

# 3. Я создам gemini.service.ts для тебя
```

---

## 🔄 ХОЧЕШЬ, ЧТОБЫ Я СОЗДАЛ GEMINI ИНТЕГРАЦИЮ?

Скажи "да" и я:
1. Создам `backend/src/services/gemini.service.ts`
2. Обновлю routes для использования Gemini
3. Обновлю .env.example
4. Дам инструкцию по получению ключа

**Gemini - лучший бесплатный вариант для старта!**

---

## 📞 ИТОГО

**Вместо OpenAI можешь использовать:**

1. **Gemini** (Google) - РЕКОМЕНДУЮ ДЛЯ ТЕБЯ
   - Бесплатно
   - Хорошее качество
   - Уже есть в зависимостях

2. **Ollama** (локально) - для тестов
   - Полностью бесплатно
   - Без лимитов
   - Нужен мощный ПК

3. **Groq** - для production
   - Бесплатно
   - Очень быстро
   - Хорошее качество

**Что выбираешь?**

*DOBRO SYSTEM ☘ - Работает с любым AI провайдером*
