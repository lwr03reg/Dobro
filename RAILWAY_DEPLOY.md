# 🚂 ДЕПЛОЙ НА RAILWAY.APP

## 🎯 Преимущества Railway

- ✅ **Быстрый деплой** - автоматический deploy из GitHub
- ✅ **Бесплатный план** - $5 кредитов в месяц
- ✅ **Простая настройка** - минимум конфигурации
- ✅ **Автоматические миграции** - Prisma migrate при деплое
- ✅ **Встроенные базы данных** - PostgreSQL и Redis в один клик

---

## 📋 Шаг 1: Создание аккаунта

1. Откройте: **[https://railway.app](https://railway.app)**
2. Нажмите: **"Start a New Project"**
3. Выберите: **"Login with GitHub"**
4. Авторизуйте Railway доступ к GitHub

---

## 🚀 Шаг 2: Создание проекта

### Вариант A: Через Web UI (РЕКОМЕНДУЕТСЯ)

1. **Создайте новый проект**:
   - Нажмите **"New Project"**
   - Выберите **"Deploy from GitHub repo"**
   - Найдите репозиторий: **lwr03reg/Dobro**
   - Нажмите **"Deploy Now"**

2. **Добавьте базы данных**:
   - В проекте нажмите **"+ New"**
   - Выберите **"Database"** → **"Add PostgreSQL"**
   - Снова **"+ New"** → **"Database"** → **"Add Redis"**

3. **Создайте сервисы**:

   **Backend Service**:
   - **"+ New"** → **"GitHub Repo"** → выберите **backend/** директорию
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npx prisma migrate deploy && npm start`

   **Frontend Service**:
   - **"+ New"** → **"GitHub Repo"** → выберите корень
   - Root Directory: `/`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`

---

### Вариант B: Через Railway CLI

#### 1. Установка CLI

```bash
# macOS/Linux
curl -fsSL https://railway.app/install.sh | sh

# Windows (PowerShell)
iwr https://railway.app/install.ps1 | iex

# Или через npm
npm install -g @railway/cli
```

#### 2. Авторизация

```bash
railway login
```

Откроется браузер для авторизации через GitHub.

#### 3. Инициализация проекта

```bash
# В корне проекта
railway init

# Выберите:
# - Create a new project
# - Название: dobro-system
```

#### 4. Добавление баз данных

```bash
# PostgreSQL
railway add --database postgres

# Redis
railway add --database redis
```

#### 5. Деплой Backend

```bash
cd backend

# Создать сервис
railway up

# Или с указанием имени
railway up --service backend

# Установить переменные окружения
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set GEMINI_API_KEY=AIzaSyCAPCpq8-sGBxOcPS3qqrFK2HpuIIHIyTE
railway variables set TELEGRAM_BOT_TOKEN=8480665448:AAElJ5EmARXqJI5sbyAKtBAenMTOPUP1X94
```

#### 6. Деплой Frontend

```bash
cd ..

# Создать сервис для frontend
railway up --service frontend

# Установить переменные
railway variables set VITE_API_URL=https://backend-production-xxxx.up.railway.app
```

---

## 🔑 Шаг 3: Настройка переменных окружения

### Backend переменные:

```bash
# Обязательные
NODE_ENV=production
PORT=3001
DATABASE_URL=<автоматически из PostgreSQL>
REDIS_URL=<автоматически из Redis>

# Ваши ключи
GEMINI_API_KEY=AIzaSyCAPCpq8-sGBxOcPS3qqrFK2HpuIIHIyTE
TELEGRAM_BOT_TOKEN=8480665448:AAElJ5EmARXqJI5sbyAKtBAenMTOPUP1X94

# Генерируется автоматически
JWT_SECRET=<Railway сгенерирует>

# Frontend URL (после создания frontend сервиса)
FRONTEND_URL=https://frontend-production-xxxx.up.railway.app
```

### Frontend переменные:

```bash
# Backend URL (после создания backend сервиса)
VITE_API_URL=https://backend-production-xxxx.up.railway.app
```

---

## 📦 Шаг 4: Настройка через Web UI

### Backend Service:

1. Откройте сервис **backend**
2. Перейдите в **Variables**
3. Добавьте переменные (см. выше)
4. Перейдите в **Settings**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma migrate deploy && npm start`
   - **Healthcheck Path**: `/health`
5. Нажмите **"Deploy"**

### Frontend Service:

1. Откройте сервис **frontend**
2. Перейдите в **Variables**
3. Добавьте `VITE_API_URL`
4. Перейдите в **Settings**:
   - **Root Directory**: `/`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview`
5. Нажмите **"Deploy"**

---

## 🔗 Шаг 5: Связывание сервисов

Railway автоматически создаст внутренние URL для сервисов:

1. **Backend**: `https://backend-production-xxxx.up.railway.app`
2. **Frontend**: `https://frontend-production-xxxx.up.railway.app`
3. **PostgreSQL**: Внутренний URL (автоматически в `DATABASE_URL`)
4. **Redis**: Внутренний URL (автоматически в `REDIS_URL`)

### Обновите переменные:

**Backend** → Variables → `FRONTEND_URL`:
```
https://frontend-production-xxxx.up.railway.app
```

**Frontend** → Variables → `VITE_API_URL`:
```
https://backend-production-xxxx.up.railway.app
```

---

## 🤖 Шаг 6: Настройка Telegram Webhook

После деплоя backend, обновите webhook:

```bash
curl -X POST "https://api.telegram.org/bot8480665448:AAElJ5EmARXqJI5sbyAKtBAenMTOPUP1X94/setWebhook" \
  -d "url=https://backend-production-xxxx.up.railway.app/api/webhooks/telegram"
```

Замените `backend-production-xxxx.up.railway.app` на ваш реальный URL.

---

## ✅ Шаг 7: Проверка деплоя

### 1. Проверка Backend

```bash
# Health check
curl https://backend-production-xxxx.up.railway.app/health

# Ожидаемый ответ:
{
  "status": "ok",
  "timestamp": "2024-11-20T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### 2. Проверка Frontend

Откройте в браузере:
```
https://frontend-production-xxxx.up.railway.app
```

Должен загрузиться дашборд.

### 3. Проверка базы данных

```bash
# Через Railway CLI
railway run npx prisma studio

# Или проверка миграций
railway run npx prisma migrate status
```

### 4. Проверка Telegram бота

1. Откройте Telegram
2. Найдите бота: **@DobroGuideBot**
3. Отправьте: `/start`
4. Бот должен ответить

---

## 📊 Мониторинг

### Railway Dashboard:

1. **Deployments** - история деплоев
2. **Metrics** - CPU, Memory, Network
3. **Logs** - логи в реальном времени
4. **Usage** - использование кредитов

### CLI команды:

```bash
# Логи
railway logs

# Статус
railway status

# Список сервисов
railway service

# Переменные окружения
railway variables
```

---

## 🔄 Автоматический деплой

Railway автоматически деплоит при push в GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main

# Railway автоматически:
# 1. Обнаружит изменения
# 2. Запустит build
# 3. Задеплоит новую версию
```

---

## 💰 Стоимость

### Free Plan:
- **$5 кредитов** в месяц
- **500 часов** выполнения
- **100 GB** исходящего трафика
- **Unlimited** проектов

### Примерное использование:
- Backend: ~$3/месяц
- Frontend: ~$1/месяц
- PostgreSQL: ~$0.5/месяц
- Redis: ~$0.5/месяц

**Итого**: ~$5/месяц (покрывается бесплатным планом)

---

## ❌ Частые проблемы

### 1. Build failed

**Проблема**: Ошибки при сборке

**Решение**:
```bash
# Проверьте логи
railway logs --service backend

# Проверьте build локально
cd backend && npm run build
```

### 2. Database connection failed

**Проблема**: Не удаётся подключиться к БД

**Решение**:
- Убедитесь что PostgreSQL сервис создан
- Проверьте переменную `DATABASE_URL`
- Проверьте что миграции применены:
  ```bash
  railway run npx prisma migrate deploy
  ```

### 3. Port already in use

**Проблема**: Конфликт портов

**Решение**:
```bash
# Railway автоматически назначает PORT
# Убедитесь что используете process.env.PORT

# В backend/src/index.ts:
const PORT = process.env.PORT || 3001;
```

### 4. Environment variables not set

**Проблема**: Переменные окружения не установлены

**Решение**:
```bash
# Проверьте переменные
railway variables

# Установите недостающие
railway variables set KEY=value
```

### 5. Webhook not working

**Проблема**: Telegram бот не отвечает

**Решение**:
```bash
# Проверьте webhook
curl "https://api.telegram.org/bot8480665448:AAElJ5EmARXqJI5sbyAKtBAenMTOPUP1X94/getWebhookInfo"

# Установите заново
curl -X POST "https://api.telegram.org/bot8480665448:AAElJ5EmARXqJI5sbyAKtBAenMTOPUP1X94/setWebhook" \
  -d "url=https://your-backend.up.railway.app/api/webhooks/telegram"
```

---

## 🎯 Быстрый старт (TL;DR)

```bash
# 1. Установить CLI
npm install -g @railway/cli

# 2. Авторизоваться
railway login

# 3. Создать проект
railway init

# 4. Добавить базы данных
railway add --database postgres
railway add --database redis

# 5. Деплой backend
cd backend
railway up --service backend
railway variables set GEMINI_API_KEY=AIzaSyCAPCpq8-sGBxOcPS3qqrFK2HpuIIHIyTE
railway variables set TELEGRAM_BOT_TOKEN=8480665448:AAElJ5EmARXqJI5sbyAKtBAenMTOPUP1X94

# 6. Деплой frontend
cd ..
railway up --service frontend

# 7. Проверить
railway logs
railway status
```

---

## 📚 Дополнительные ресурсы

- **Railway Docs**: [https://docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [https://discord.gg/railway](https://discord.gg/railway)
- **Prisma Deploy Guide**: [https://www.prisma.io/docs/guides/deployment](https://www.prisma.io/docs/guides/deployment)

---

## 🎉 Готово!

После успешного деплоя у вас будет:

- ✅ Backend API на Railway
- ✅ Frontend на Railway
- ✅ PostgreSQL database
- ✅ Redis cache
- ✅ Автоматические деплои
- ✅ Telegram бот работает

**Начните деплой прямо сейчас**: [https://railway.app](https://railway.app) 🚂
