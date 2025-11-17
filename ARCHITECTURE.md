# DOBRO SYSTEM - Production Architecture

## 🎯 Цель проекта
AI-powered платформа для автоматизации создания и продажи цифровых руководств на основе трендов.

## 🏗️ Архитектура системы

### Текущее состояние (❌ НЕ ГОТОВО К PRODUCTION)
- ✅ Frontend React SPA (690 строк в одном файле)
- ❌ Нет backend
- ❌ Нет базы данных
- ❌ Нет Telegram бота
- ❌ Нет системы аутентификации
- ❌ Нет системы оплаты
- ❌ 28+ отсутствующих файлов (компоненты, сервисы)
- ❌ API ключи в клиенте (небезопасно)
- ❌ Gemini API (нужна замена на OpenAI)

### Целевая архитектура (✅ PRODUCTION-READY)

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  React SPA (Vite)                                           │
│  ├── Dashboard (создание гайдов)                            │
│  ├── Auth (регистрация/логин)                               │
│  ├── Billing (подписки/оплата)                              │
│  └── Analytics (статистика)                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS/REST API
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Node.js/Express API Server                                 │
│  ├── /api/auth (JWT authentication)                         │
│  ├── /api/guides (CRUD операции)                            │
│  ├── /api/ai (OpenAI интеграция)                            │
│  ├── /api/pdf (генерация PDF)                               │
│  ├── /api/payment (Stripe/ЮKassa)                           │
│  └── /api/webhooks (Telegram, платежи)                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      SERVICES LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  ├── OpenAI Service (GPT-4 mini)                            │
│  ├── PDF Service (puppeteer/pdfkit)                         │
│  ├── Telegram Bot Service                                   │
│  ├── Payment Service (Stripe/ЮKassa)                        │
│  ├── Email Service (SendGrid/Resend)                        │
│  └── Storage Service (S3/Cloudflare R2)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL (основная БД)                                   │
│  ├── users (пользователи)                                   │
│  ├── guides (созданные гайды)                               │
│  ├── subscriptions (подписки)                               │
│  ├── transactions (платежи)                                 │
│  └── analytics (метрики)                                    │
│                                                             │
│  Redis (кэш и очереди)                                      │
│  ├── session cache                                          │
│  ├── rate limiting                                          │
│  └── job queue (Bull)                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
├─────────────────────────────────────────────────────────────┤
│  ├── OpenAI API (GPT-4 mini)                                │
│  ├── Telegram Bot API                                       │
│  ├── Stripe/ЮKassa (платежи)                                │
│  ├── SendGrid/Resend (email)                                │
│  ├── Cloudflare R2/S3 (хранение PDF)                        │
│  └── Sentry (мониторинг ошибок)                             │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Технологический стек

### Frontend
- **Framework**: React 19 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **State**: Zustand (легче Redux)
- **API Client**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **PDF Preview**: react-pdf

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: Zod
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **Rate Limiting**: express-rate-limit + Redis

### AI & Generation
- **LLM**: OpenAI GPT-4 mini (замена Gemini)
- **PDF**: Puppeteer (HTML → PDF) + custom templates
- **Image**: DALL-E 3 или Stable Diffusion (обложки)

### Database
- **Primary**: PostgreSQL 16
- **Cache**: Redis 7
- **Queue**: Bull (Redis-based)

### Telegram
- **Bot**: node-telegram-bot-api
- **Mini App**: Telegram Web App SDK

### Payment
- **International**: Stripe
- **Russia**: ЮKassa (YooMoney)

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: Railway/Render/DigitalOcean
- **Monitoring**: Sentry + Prometheus + Grafana
- **Logs**: Winston + Loki

## 🔐 Безопасность

### Критические улучшения
1. **API Keys** - переместить в backend (env variables)
2. **Authentication** - JWT с refresh tokens
3. **Rate Limiting** - защита от DDoS
4. **Input Validation** - Zod schemas на всех endpoints
5. **CORS** - правильная настройка
6. **HTTPS** - обязательно в production
7. **SQL Injection** - Prisma ORM (параметризованные запросы)
8. **XSS Protection** - sanitize HTML в PDF
9. **CSRF Protection** - tokens для форм
10. **Secrets Management** - .env + Vault в production

## 📊 Мониторинг и аналитика

### Метрики
- **User Metrics**: регистрации, активность, retention
- **Business Metrics**: созданные гайды, продажи, revenue
- **Technical Metrics**: API latency, error rate, uptime
- **AI Metrics**: tokens used, cost per guide, generation time

### Инструменты
- **Errors**: Sentry
- **Logs**: Winston → Loki → Grafana
- **Metrics**: Prometheus → Grafana
- **Uptime**: UptimeRobot
- **Analytics**: PostHog (self-hosted) или Mixpanel

## 💰 Монетизация

### Модели
1. **Freemium**
   - Free: 3 гайда/месяц
   - Pro: 50 гайдов/месяц - 990₽
   - Business: unlimited - 2990₽

2. **Pay-per-guide**
   - 1 гайд = 99₽
   - 10 гайдов = 790₽ (скидка 20%)

3. **Marketplace**
   - Продажа готовых гайдов на Ozon
   - Комиссия 30% с продаж

### Интеграция платежей
- **Stripe** - международные карты
- **ЮKassa** - российские карты, СБП
- **Crypto** (опционально) - USDT/TON

## 🚀 Deployment

### Development
```bash
docker-compose up -d
npm run dev
```

### Production
```bash
# Build
docker build -t dobro-system .

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Migrations
npm run prisma:migrate:deploy

# Health check
curl https://api.dobro.app/health
```

### Environment Variables
```env
# App
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://dobro.app

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dobro
REDIS_URL=redis://host:6379

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-mini

# Auth
JWT_SECRET=...
JWT_EXPIRES_IN=7d

# Payment
STRIPE_SECRET_KEY=sk_live_...
YUKASSA_SHOP_ID=...
YUKASSA_SECRET_KEY=...

# Telegram
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_URL=https://api.dobro.app/webhooks/telegram

# Storage
S3_BUCKET=dobro-pdfs
S3_ACCESS_KEY=...
S3_SECRET_KEY=...

# Monitoring
SENTRY_DSN=...
```

## 📈 Roadmap

### Phase 1: MVP (2 недели)
- [x] Анализ текущего состояния
- [ ] Backend API + PostgreSQL
- [ ] OpenAI интеграция
- [ ] Базовая аутентификация
- [ ] Улучшенная PDF генерация
- [ ] Deploy на Railway

### Phase 2: Core Features (2 недели)
- [ ] Telegram Bot
- [ ] Система оплаты (ЮKassa)
- [ ] Email уведомления
- [ ] Dashboard с аналитикой
- [ ] Мониторинг (Sentry)

### Phase 3: Growth (1 месяц)
- [ ] Telegram Mini App
- [ ] Marketplace интеграция (Ozon API)
- [ ] Реферальная программа
- [ ] A/B тестирование
- [ ] SEO оптимизация

### Phase 4: Scale (ongoing)
- [ ] Multi-language support
- [ ] White-label решение
- [ ] API для партнеров
- [ ] Mobile apps (React Native)
- [ ] AI fine-tuning на своих данных

## 🎯 Success Metrics

### Technical
- ✅ 99.9% uptime
- ✅ < 2s API response time
- ✅ < 30s guide generation time
- ✅ 0 critical security issues

### Business
- 🎯 100 users в первый месяц
- 🎯 10% conversion free → paid
- 🎯 $1000 MRR в 3 месяца
- 🎯 4.5+ rating на отзывах

## 📚 Документация

### Для разработчиков
- API Documentation (Swagger)
- Database Schema (Prisma)
- Architecture Decision Records (ADR)
- Contributing Guidelines

### Для пользователей
- Getting Started Guide
- Video Tutorials
- FAQ
- Best Practices

## 🤝 Команда и роли

### Необходимые роли
- **Tech Lead** - архитектура, code review
- **Backend Dev** - API, интеграции
- **Frontend Dev** - UI/UX, React
- **DevOps** - deployment, мониторинг
- **Product Manager** - roadmap, метрики
- **Marketing** - growth, контент

### Текущий статус
- 1 человек (AI Agent) - делает всё 😅
- Нужна команда для масштабирования

---

**Версия**: 1.0.0  
**Дата**: 2024-11-16  
**Автор**: Ona AI Agent  
**Статус**: 🚧 В разработке
