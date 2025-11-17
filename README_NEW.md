# DOBRO SYSTEM ☘ - AI-Powered Guide Generation Platform

> **Production-Ready** AI-powered platform for automated creation and monetization of digital guides.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4--mini-purple)](https://openai.com/)

## 🎯 Что это?

DOBRO SYSTEM - это полноценная SaaS платформа для автоматизации создания цифровых руководств с помощью AI:

- 🤖 **AI-генерация** - OpenAI GPT-4 mini создаёт профессиональные руководства
- 📄 **PDF Export** - Красивые PDF с кириллицей, оглавлением, брендингом
- 💰 **Монетизация** - Интеграция с Stripe и ЮKassa
- 📊 **Analytics** - Полная аналитика использования и продаж
- 🔐 **Security** - JWT auth, rate limiting, input validation
- 🚀 **Production Ready** - Docker, PostgreSQL, Redis, мониторинг

## 🏗️ Архитектура

```
Frontend (React + Vite) ←→ Backend API (Express + TypeScript) ←→ PostgreSQL + Redis
                                    ↓
                            OpenAI GPT-4 mini
                            PDF Generation
                            Payment Processing
```

## 📋 Требования

- **Node.js** 20+
- **Docker** & Docker Compose
- **OpenAI API Key** (GPT-4 mini)
- **PostgreSQL** 16+ (через Docker)
- **Redis** 7+ (через Docker)

## 🚀 Быстрый старт

### 1. Клонирование и установка

```bash
git clone https://github.com/your-username/Dobro.git
cd Dobro
```

### 2. Настройка окружения

```bash
# Скопируйте example файл
cp .env.example .env

# Отредактируйте .env и добавьте свои ключи
nano .env
```

**Обязательные переменные:**
```env
OPENAI_API_KEY=sk-proj-your-key-here
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
FRONTEND_URL=http://localhost:3000
```

### 3. Запуск с Docker

```bash
# Запустить все сервисы (PostgreSQL, Redis, Backend, Frontend)
docker-compose up -d

# Применить миграции БД
cd backend
npm run prisma:migrate

# Проверить статус
docker-compose ps
```

### 4. Доступ к приложению

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **API Docs**: [http://localhost:3001/health](http://localhost:3001/health)
- **Prisma Studio**: `npm run prisma:studio` (в папке backend)

## 📁 Структура проекта

```
Dobro/
├── backend/                    # Backend API (Express + TypeScript)
│   ├── src/
│   │   ├── config/            # Конфигурация
│   │   ├── middleware/        # Auth, error handling, logging
│   │   ├── routes/            # API endpoints
│   │   │   ├── auth.routes.ts
│   │   │   ├── guides.routes.ts
│   │   │   ├── ai.routes.ts
│   │   │   └── payments.routes.ts
│   │   ├── services/          # Бизнес-логика
│   │   │   ├── openai.service.ts
│   │   │   ├── pdf.service.ts
│   │   │   └── telegram.service.ts
│   │   ├── utils/             # Утилиты
│   │   └── index.ts           # Entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # React компоненты
│   │   ├── services/          # API клиенты
│   │   ├── hooks/             # Custom hooks
│   │   ├── store/             # State management
│   │   └── pages/             # Страницы
│   └── package.json
│
├── docker-compose.yml          # Docker orchestration
├── .env.example                # Environment template
├── ARCHITECTURE.md             # Подробная архитектура
└── README.md                   # Этот файл
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register      # Регистрация
POST   /api/auth/login         # Вход
GET    /api/auth/me            # Текущий пользователь
```

### AI Generation
```
GET    /api/ai/trending-topics          # Получить тренды
POST   /api/ai/generate-draft           # Создать черновик
POST   /api/ai/validate-guide           # Улучшить руководство
POST   /api/ai/generate-interactive     # Добавить тест/чек-лист
POST   /api/ai/generate-marketing       # Маркетинговые материалы
POST   /api/ai/generate-ozon-metadata   # Метаданные для Ozon
```

### Guides
```
GET    /api/guides             # Список руководств
POST   /api/guides             # Создать руководство
GET    /api/guides/:id         # Получить руководство
PUT    /api/guides/:id         # Обновить руководство
DELETE /api/guides/:id         # Удалить руководство
POST   /api/guides/:id/generate-pdf  # Сгенерировать PDF
```

### Payments
```
POST   /api/payments/create-checkout   # Создать платёж
POST   /api/payments/webhook           # Webhook от платёжной системы
GET    /api/payments/history           # История платежей
```

## 🤖 OpenAI Integration

### Модель: GPT-4 mini

**Преимущества:**
- ✅ Дешевле GPT-4 в 60 раз
- ✅ Быстрее генерация
- ✅ Достаточно для создания руководств
- ✅ JSON mode для структурированных ответов

**Стоимость:**
- Input: $0.150 / 1M tokens
- Output: $0.600 / 1M tokens
- ~$0.05 на одно руководство

### Промпты

Все промпты оптимизированы для:
- Конкретики и практичности
- Русского языка
- JSON output
- Минимизации токенов

См. `backend/src/services/openai.service.ts`

## 📄 PDF Generation

### Возможности

- ✅ Кириллица (DejaVu Sans font)
- ✅ Оглавление
- ✅ Брендинг (цвета, логотип)
- ✅ Автоматическая пагинация
- ✅ Колонтитулы
- ✅ Структурированный контент
- ✅ Чек-листы и тесты

### Пример использования

```typescript
import { pdfService } from './services/pdf.service';

const pdfPath = await pdfService.generatePDF(guide, userId);
// → outputs/pdfs/guide_user123_1234567890.pdf
```

## 💳 Монетизация

### Тарифы

| План | Цена | Гайдов/месяц | Особенности |
|------|------|--------------|-------------|
| **Free** | 0₽ | 3 | Базовые функции |
| **Pro** | 990₽ | 50 | Приоритетная генерация |
| **Business** | 2990₽ | ∞ | API доступ, white-label |

### Интеграция платежей

**ЮKassa (Россия):**
```typescript
// backend/src/services/payment.service.ts
const checkout = await yukassa.createPayment({
  amount: { value: '990.00', currency: 'RUB' },
  confirmation: { type: 'redirect', return_url: '...' },
});
```

**Stripe (International):**
```typescript
const session = await stripe.checkout.sessions.create({
  line_items: [{ price: 'price_pro_plan', quantity: 1 }],
  mode: 'subscription',
});
```

## 🔐 Безопасность

### Реализовано

- ✅ JWT Authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting (100 req/15min)
- ✅ Input validation (Zod)
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS protection

### TODO

- ⏳ 2FA authentication
- ⏳ API key rotation
- ⏳ Audit logging
- ⏳ DDoS protection (Cloudflare)

## 📊 Мониторинг

### Логирование

```typescript
import { logger } from './utils/logger';

logger.info('Guide generated', { topic, duration, tokensUsed });
logger.error('OpenAI API error', { error });
```

Логи сохраняются в:
- `logs/combined.log` - все логи
- `logs/error.log` - только ошибки

### Метрики

В production рекомендуется:
- **Sentry** - отслеживание ошибок
- **Prometheus + Grafana** - метрики
- **UptimeRobot** - мониторинг доступности

## 🧪 Тестирование

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Railway (рекомендуется)

```bash
# 1. Установить Railway CLI
npm install -g @railway/cli

# 2. Логин
railway login

# 3. Создать проект
railway init

# 4. Добавить PostgreSQL
railway add postgresql

# 5. Добавить Redis
railway add redis

# 6. Deploy
railway up
```

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Run
docker-compose -f docker-compose.prod.yml up -d

# Migrations
docker-compose exec backend npm run prisma:migrate:deploy
```

### Environment Variables (Production)

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
OPENAI_API_KEY=sk-...
JWT_SECRET=... (min 32 chars)
SENTRY_DSN=https://...
```

## 📈 Roadmap

### ✅ Phase 1: MVP (Completed)
- [x] Backend API
- [x] OpenAI integration
- [x] PDF generation
- [x] Authentication
- [x] Database schema
- [x] Docker setup

### 🚧 Phase 2: Core Features (In Progress)
- [ ] Frontend UI components
- [ ] Telegram Bot
- [ ] Payment integration (ЮKassa)
- [ ] Email notifications
- [ ] Analytics dashboard

### 📅 Phase 3: Growth
- [ ] Telegram Mini App
- [ ] Ozon API integration
- [ ] Referral program
- [ ] A/B testing
- [ ] SEO optimization

### 🔮 Phase 4: Scale
- [ ] Multi-language support
- [ ] White-label solution
- [ ] Partner API
- [ ] Mobile apps
- [ ] AI fine-tuning

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

```bash
# 1. Fork the repo
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m 'Add amazing feature'

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** - GPT-4 mini API
- **Prisma** - Database ORM
- **PDFKit** - PDF generation
- **Express** - Web framework
- **React** - Frontend framework

## 📞 Support

- **Email**: support@dobro.app
- **Telegram**: [@dobro_support](https://t.me/dobro_support)
- **Issues**: [GitHub Issues](https://github.com/your-username/Dobro/issues)

## 🌟 Show your support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ and AI by DOBRO SYSTEM ☘**

*Если помогло — поделись, так добро растёт.*
