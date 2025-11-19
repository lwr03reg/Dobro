# 🚂 Railway Deployment через GitHub

**Важно**: Railway trial закончился, но вы можете:
1. Оплатить подписку Railway ($5-20/мес)
2. Использовать бесплатную альтернативу Render.com (см. DEPLOY_RENDER.txt)

Если вы решили продолжить с Railway, следуйте этой инструкции:

---

## 📋 Шаг 1: Подготовка

### Проверьте, что код в GitHub актуален

```bash
git status
git log --oneline -3
```

Последний коммит должен быть:
```
8b4d5b9 🐛 Fix: Resolve all TypeScript compilation errors and update to Gemini API
```

✅ **Готово!** Все изменения уже в GitHub.

---

## 🚂 Шаг 2: Создание проекта на Railway

### 2.1 Откройте Railway

1. Перейдите на [railway.app](https://railway.app)
2. Войдите через GitHub
3. Нажмите **"New Project"**

### 2.2 Выберите репозиторий

1. Выберите **"Deploy from GitHub repo"**
2. Найдите репозиторий: **lwr03reg/Dobro**
3. Нажмите **"Deploy Now"**

### 2.3 Настройте проект

Railway автоматически обнаружит:
- ✅ `backend/Dockerfile` - для сборки
- ✅ `docker-compose.yml` - для зависимостей

---

## 🗄️ Шаг 3: Добавление PostgreSQL

### 3.1 Добавьте базу данных

1. В проекте нажмите **"+ New"**
2. Выберите **"Database"** → **"Add PostgreSQL"**
3. Railway создаст базу данных автоматически

### 3.2 Получите DATABASE_URL

1. Откройте PostgreSQL сервис
2. Перейдите на вкладку **"Connect"**
3. Скопируйте **"Postgres Connection URL"**

Формат:
```
postgresql://postgres:password@host:port/railway
```

---

## 🔴 Шаг 4: Добавление Redis (опционально)

### 4.1 Добавьте Redis

1. В проекте нажмите **"+ New"**
2. Выберите **"Database"** → **"Add Redis"**
3. Railway создаст Redis автоматически

### 4.2 Получите REDIS_URL

1. Откройте Redis сервис
2. Перейдите на вкладку **"Connect"**
3. Скопируйте **"Redis Connection URL"**

Формат:
```
redis://default:password@host:port
```

---

## ⚙️ Шаг 5: Environment Variables

### 5.1 Откройте настройки backend

1. Выберите сервис **backend** (или **Dobro**)
2. Перейдите на вкладку **"Variables"**
3. Нажмите **"+ New Variable"**

### 5.2 Добавьте переменные

**Обязательные:**

```env
# AI Provider
GEMINI_API_KEY=AIzaSyCAPCpq8-sGBxOcPS3qqrFK2HpuIIHIyTE

# Authentication
JWT_SECRET=P7ZcWqHuvanRFm4dWwoe1OFssJJPo2+Ae83o3DVEwgM=
JWT_EXPIRES_IN=7d

# Application
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-url.railway.app

# Database (скопируйте из PostgreSQL сервиса)
DATABASE_URL=postgresql://postgres:password@host:port/railway

# Redis (скопируйте из Redis сервиса)
REDIS_URL=redis://default:password@host:port
```

**Опциональные (для будущего):**

```env
# OpenAI (если хотите использовать вместо Gemini)
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_MODEL=gpt-4o-mini

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# ЮKassa
YUKASSA_SHOP_ID=your_shop_id
YUKASSA_SECRET_KEY=your_secret_key

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token

# Email
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=noreply@dobro.app

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

### 5.3 Сохраните

Нажмите **"Add"** для каждой переменной.

---

## 🚀 Шаг 6: Настройка деплоя

### 6.1 Настройте Root Directory

1. Перейдите в **"Settings"**
2. Найдите **"Root Directory"**
3. Установите: `backend`
4. Сохраните

### 6.2 Настройте Build Command (если нужно)

Railway автоматически использует Dockerfile, но если нужно:

1. **Build Command**: `docker build -t dobro-backend .`
2. **Start Command**: `npm run start`

### 6.3 Настройте домен

1. Перейдите в **"Settings"** → **"Domains"**
2. Нажмите **"Generate Domain"**
3. Railway создаст домен: `your-app.up.railway.app`

---

## 📦 Шаг 7: Deploy!

### 7.1 Запустите деплой

Railway автоматически начнёт деплой после настройки переменных.

Или вручную:
1. Перейдите в **"Deployments"**
2. Нажмите **"Deploy"**

### 7.2 Следите за логами

1. Откройте вкладку **"Deployments"**
2. Выберите текущий деплой
3. Смотрите логи в реальном времени

Ожидаемые логи:
```
Building Docker image...
Installing dependencies...
Running Prisma migrations...
Starting server...
✅ Server listening on port 3001
```

---

## 🧪 Шаг 8: Тестирование

### 8.1 Проверьте health endpoint

```bash
curl https://your-app.up.railway.app/health
```

Ожидаемый ответ:
```json
{
  "status": "ok",
  "timestamp": "2024-11-19T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### 8.2 Тестируйте регистрацию

```bash
curl -X POST https://your-app.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 8.3 Тестируйте AI генерацию

```bash
# Сначала получите токен из регистрации
TOKEN="your-token-here"

curl https://your-app.up.railway.app/api/ai/trending-topics \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔧 Troubleshooting

### Проблема: Build failed

**Решение:**
1. Проверьте логи деплоя
2. Убедитесь, что Root Directory = `backend`
3. Проверьте, что Dockerfile существует

### Проблема: Database connection error

**Решение:**
1. Проверьте DATABASE_URL в переменных
2. Убедитесь, что PostgreSQL сервис запущен
3. Проверьте, что миграции применились

### Проблема: Gemini API error

**Решение:**
1. Проверьте GEMINI_API_KEY в переменных
2. Убедитесь, что ключ валидный
3. Проверьте лимиты на https://aistudio.google.com/apikey

### Проблема: Port already in use

**Решение:**
1. Railway автоматически назначает порт
2. Убедитесь, что используете `process.env.PORT`
3. В коде уже настроено: `const port = config.PORT || 3001`

---

## 💰 Стоимость Railway

### Trial (закончился)
- ❌ $5 бесплатных кредитов
- ❌ Ограничение по времени

### Hobby Plan ($5/мес)
- ✅ $5 кредитов в месяц
- ✅ Достаточно для небольших проектов
- ✅ PostgreSQL + Redis включены

### Pro Plan ($20/мес)
- ✅ $20 кредитов в месяц
- ✅ Приоритетная поддержка
- ✅ Больше ресурсов

### Расчёт стоимости

**Ваш проект:**
- Backend: ~$3-5/мес
- PostgreSQL: ~$1-2/мес
- Redis: ~$1/мес
- **Итого: ~$5-8/мес**

---

## 🆓 Бесплатная альтернатива

Если Railway trial закончился и не хотите платить:

### Render.com (БЕСПЛАТНО)

1. Откройте [DEPLOY_RENDER.txt](DEPLOY_RENDER.txt)
2. Следуйте инструкциям (5 минут)
3. Получите рабочий URL бесплатно

**Преимущества Render.com:**
- ✅ Полностью бесплатно (750 часов/мес)
- ✅ PostgreSQL включён (90 дней бесплатно)
- ✅ Docker support
- ✅ Auto-deploy из GitHub

**Недостатки:**
- ⚠️ Засыпает после 15 минут неактивности
- ⚠️ Первый запрос медленный (~30 сек)

---

## 📚 Дополнительные ресурсы

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Render.com Alternative](DEPLOY_RENDER.txt)
- [Free Hosting Alternatives](FREE_HOSTING_ALTERNATIVES.md)

---

## ✅ Checklist

Перед деплоем убедитесь:

- [ ] Код в GitHub актуален
- [ ] Railway проект создан
- [ ] PostgreSQL добавлен
- [ ] Redis добавлен (опционально)
- [ ] Environment variables настроены
- [ ] Root Directory = `backend`
- [ ] Домен сгенерирован
- [ ] Деплой запущен
- [ ] Health endpoint работает
- [ ] API endpoints протестированы

---

## 🎉 Готово!

После успешного деплоя:

1. ✅ Backend работает в облаке
2. ✅ База данных подключена
3. ✅ API доступен по URL
4. ✅ Gemini AI работает

**Следующие шаги:**
1. Настроить frontend
2. Подключить custom domain
3. Настроить мониторинг
4. Добавить CI/CD

---

**Railway Deployment Guide**  
**Создано**: 2024-11-19  
**Статус**: ✅ Готово к использованию

DOBRO SYSTEM ☘ - Если помогло, поделись, так добро растёт
