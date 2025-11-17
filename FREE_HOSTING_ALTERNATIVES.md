# 🆓 БЕСПЛАТНЫЕ АЛЬТЕРНАТИВЫ RAILWAY

> **Railway trial закончился? Используй эти бесплатные варианты!**

---

## 🎯 ЛУЧШИЕ БЕСПЛАТНЫЕ ХОСТИНГИ

### ✅ Вариант 1: Render.com (РЕКОМЕНДУЕТСЯ)

**Бесплатный план:**
- ✅ Полностью бесплатно (навсегда)
- ✅ PostgreSQL included (90 дней, потом $7/мес)
- ✅ 750 часов в месяц
- ⚠️ "Засыпает" после 15 минут неактивности
- ⚠️ Холодный старт ~30 секунд

**Как deploy:**

1. Открой: https://render.com
2. Войди через GitHub
3. "New" → "Web Service"
4. Выбери репозиторий: `lwr03reg/Dobro`
5. Настройки:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
6. Добавь Environment Variables:
   ```
   GEMINI_API_KEY=AIzaSyCAPCpq8-sGBxOcPS3qqrFK2HpuIIHIyTE
   JWT_SECRET=P7ZcWqHuvanRFm4dWwoe1OFssJJPo2+Ae83o3DVEwgM=
   NODE_ENV=production
   PORT=3001
   ```
7. Добавь PostgreSQL:
   - "New" → "PostgreSQL"
   - Скопируй Internal Database URL
   - Добавь как `DATABASE_URL`
8. Deploy!

**Время:** 5 минут | **Стоимость:** 0₽

---

### ✅ Вариант 2: Fly.io

**Бесплатный план:**
- ✅ 3 VM бесплатно
- ✅ 3GB persistent storage
- ✅ Не засыпает
- ✅ PostgreSQL included

**Как deploy:**

```bash
# 1. Установи Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Логин
fly auth login

# 3. Создай app
cd backend
fly launch

# 4. Добавь PostgreSQL
fly postgres create

# 5. Подключи к app
fly postgres attach <postgres-app-name>

# 6. Добавь secrets
fly secrets set GEMINI_API_KEY=AIzaSyCAPCpq8-sGBxOcPS3qqrFK2HpuIIHIyTE
fly secrets set JWT_SECRET=P7ZcWqHuvanRFm4dWwoe1OFssJJPo2+Ae83o3DVEwgM=

# 7. Deploy
fly deploy
```

**Время:** 10 минут | **Стоимость:** 0₽

---

### ✅ Вариант 3: Vercel (только для frontend)

**Бесплатный план:**
- ✅ Полностью бесплатно
- ✅ Автоматический deploy из GitHub
- ⚠️ Только для frontend (нужен отдельный backend)

**Для backend используй Render.com + для frontend Vercel**

---

### ✅ Вариант 4: Koyeb

**Бесплатный план:**
- ✅ 1 web service бесплатно
- ✅ Не засыпает
- ✅ PostgreSQL через Neon (бесплатно)

**Как deploy:**

1. Открой: https://koyeb.com
2. Войди через GitHub
3. "Create Service"
4. Выбери GitHub repo: `lwr03reg/Dobro`
5. Настройки:
   - **Builder**: Dockerfile
   - **Dockerfile path**: `backend/Dockerfile`
6. Добавь Environment Variables
7. Deploy!

**Время:** 5 минут | **Стоимость:** 0₽

---

### ✅ Вариант 5: Cyclic.sh

**Бесплатный план:**
- ✅ Полностью бесплатно
- ✅ Автоматический deploy
- ⚠️ Только Node.js (без Docker)

---

## 🎯 МОЯ РЕКОМЕНДАЦИЯ

### Для тебя прямо сейчас:

**Используй Render.com:**

1. ✅ Полностью бесплатно
2. ✅ Простой deploy (5 минут)
3. ✅ PostgreSQL included
4. ✅ Не нужна кредитная карта
5. ✅ Поддержка Docker

**Единственный минус:** засыпает после 15 минут неактивности (первый запрос будет медленным)

---

## 🚀 БЫСТРЫЙ СТАРТ С RENDER.COM

### ШАГ 1: Зарегистрируйся

1. Открой: https://render.com
2. Войди через GitHub

### ШАГ 2: Создай Web Service

1. Нажми "New" → "Web Service"
2. Выбери репозиторий: `lwr03reg/Dobro`
3. Настройки:
   - **Name**: `dobro-backend`
   - **Region**: Frankfurt (ближе к России)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Docker
   - **Instance Type**: Free

### ШАГ 3: Добавь Environment Variables

Нажми "Advanced" → "Add Environment Variable":

```
GEMINI_API_KEY=AIzaSyCAPCpq8-sGBxOcPS3qqrFK2HpuIIHIyTE
JWT_SECRET=P7ZcWqHuvanRFm4dWwoe1OFssJJPo2+Ae83o3DVEwgM=
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://твой-домен.onrender.com
```

### ШАГ 4: Добавь PostgreSQL

1. Нажми "New" → "PostgreSQL"
2. Настройки:
   - **Name**: `dobro-db`
   - **Database**: `dobro`
   - **User**: `dobro`
   - **Region**: Frankfurt
   - **Plan**: Free
3. Создай
4. Скопируй "Internal Database URL"
5. Добавь в Web Service как `DATABASE_URL`

### ШАГ 5: Добавь Redis (опционально)

Для Redis используй бесплатный Upstash:

1. Открой: https://upstash.com
2. Создай Redis database
3. Скопируй URL
4. Добавь как `REDIS_URL`

### ШАГ 6: Deploy!

1. Нажми "Create Web Service"
2. Подожди 3-5 минут
3. Render соберёт Docker образ

### ШАГ 7: Проверь

Открой: `https://твой-домен.onrender.com/health`

Должен вернуть:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123.45,
  "environment": "production"
}
```

✅ **РАБОТАЕТ!**

---

## 📊 СРАВНЕНИЕ

| Хостинг | Бесплатно | PostgreSQL | Засыпает | Docker | Сложность |
|---------|-----------|------------|----------|--------|-----------|
| **Render.com** | ✅ | ✅ (90 дней) | Да | ✅ | ⭐ |
| **Fly.io** | ✅ | ✅ | Нет | ✅ | ⭐⭐ |
| **Koyeb** | ✅ | Через Neon | Нет | ✅ | ⭐⭐ |
| **Railway** | ❌ Trial | ✅ | Нет | ✅ | ⭐ |
| **Vercel** | ✅ | ❌ | Нет | ❌ | ⭐ |

---

## 💡 СОВЕТ

**Для production:**

Используй комбинацию:
- **Backend**: Render.com (бесплатно)
- **Database**: Neon.tech (бесплатно, не истекает)
- **Redis**: Upstash (бесплатно)
- **Frontend**: Vercel (бесплатно)

**Итого:** 0₽ навсегда!

---

## 🎯 СЛЕДУЮЩИЙ ШАГ

**Открой Render.com и начни deploy:**
→ https://render.com

Займёт 5 минут, полностью бесплатно!

---

*DOBRO SYSTEM ☘ - Бесплатные альтернативы Railway*
