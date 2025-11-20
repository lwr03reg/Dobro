# 🚀 ИНСТРУКЦИЯ ПО ЗАПУСКУ DOBRO

## ✅ СИСТЕМА ЗАПУЩЕНА И РАБОТАЕТ!

---

## 📊 Текущий статус сервисов

| Сервис | Порт | Статус | URL |
|--------|------|--------|-----|
| **PostgreSQL** | 5432 | ✅ Работает | localhost:5432 |
| **Redis** | 6379 | ✅ Работает | localhost:6379 |
| **Backend API** | 3001 | ✅ Работает | http://localhost:3001 |
| **Frontend** | 3002 | ✅ Работает | http://localhost:3002 |
| **Telegram Bot** | - | ✅ Работает | @DobroGuideBot |

---

## 🎯 Быстрый старт

### 1. Все уже запущено!

Система полностью настроена и работает. Вы можете сразу начать использование:

```bash
# Проверить статус всех сервисов
docker-compose ps

# Проверить здоровье API
curl http://localhost:3001/health

# Открыть frontend
# Откройте в браузере: http://localhost:3002
```

### 2. Если нужно перезапустить

```bash
# Остановить все сервисы
docker-compose down
pkill -f "tsx watch"
pkill -f "vite"

# Запустить заново
docker-compose up -d postgres redis
cd backend && npm run dev &
npm run dev &
```

---

## 🔧 Управление сервисами

### Backend API

```bash
# Запуск
cd backend && npm run dev

# Остановка
pkill -f "tsx watch src/index.ts"

# Логи
tail -f /tmp/backend.log

# Проверка
curl http://localhost:3001/health
```

### Frontend

```bash
# Запуск
npm run dev

# Остановка
pkill -f "vite"

# Логи
tail -f /tmp/frontend.log

# Проверка
curl http://localhost:3002
```

### База данных

```bash
# Запуск PostgreSQL + Redis
docker-compose up -d postgres redis

# Остановка
docker-compose stop postgres redis

# Статус
docker-compose ps

# Миграции
cd backend && npx prisma migrate deploy

# Prisma Studio (GUI для БД)
cd backend && npx prisma studio
```

---

## 🌐 Доступные URL

### Backend API Endpoints

- **Health Check**: http://localhost:3001/health
- **API Docs**: http://localhost:3001/api-docs
- **Trending Topics**: http://localhost:3001/api/guides/trending
- **Generate Guide**: http://localhost:3001/api/guides/generate
- **Telegram Webhook**: http://localhost:3001/api/webhooks/telegram

### Frontend

- **Main App**: http://localhost:3002
- **Telegram Mini App**: http://localhost:3002 (в Telegram)

### Telegram Bot

- **Bot Username**: @DobroGuideBot
- **Команды**:
  - `/start` - Начать работу
  - `/help` - Помощь
  - `/create` - Создать гайд
  - `/trending` - Популярные темы
  - `/myguides` - Мои гайды
  - `/settings` - Настройки
  - `/subscribe` - Подписка
  - `/cancel` - Отменить операцию

---

## 🔑 Переменные окружения

Все критичные переменные уже настроены в `.env`:

```bash
✅ GEMINI_API_KEY - AI генерация (Google Gemini)
✅ TELEGRAM_BOT_TOKEN - Telegram бот
✅ DATABASE_URL - PostgreSQL
✅ REDIS_URL - Redis
✅ JWT_SECRET - Аутентификация
```

### Проверка переменных

```bash
# Проверить все переменные
cat backend/.env | grep -E "^(GEMINI|TELEGRAM|DATABASE|REDIS|JWT)"
```

---

## 🧪 Тестирование

### 1. Проверка Backend API

```bash
# Health check
curl http://localhost:3001/health

# Trending topics (требует авторизацию)
curl http://localhost:3001/api/guides/trending

# Создать тестового пользователя
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

### 2. Проверка Frontend

```bash
# Открыть в браузере
open http://localhost:3002

# Или проверить через curl
curl -I http://localhost:3002
```

### 3. Проверка Telegram Bot

1. Откройте Telegram
2. Найдите бота: @DobroGuideBot
3. Отправьте команду `/start`
4. Попробуйте создать гайд: `/create`

---

## 📝 Логи и отладка

### Просмотр логов

```bash
# Backend логи
tail -f /tmp/backend.log

# Frontend логи
tail -f /tmp/frontend.log

# Docker логи
docker-compose logs -f postgres
docker-compose logs -f redis

# Все логи вместе
tail -f /tmp/backend.log /tmp/frontend.log
```

### Отладка проблем

```bash
# Проверить запущенные процессы
ps aux | grep -E "tsx|vite|node"

# Проверить занятые порты
lsof -i :3001 -i :3002 -i :5432 -i :6379

# Проверить Docker контейнеры
docker-compose ps

# Проверить подключение к БД
docker-compose exec postgres psql -U dobro -d dobro_db -c "SELECT version();"

# Проверить Redis
docker-compose exec redis redis-cli ping
```

---

## 🔄 Полный перезапуск

Если что-то пошло не так, выполните полный перезапуск:

```bash
#!/bin/bash

echo "🛑 Остановка всех сервисов..."
docker-compose down
pkill -f "tsx watch"
pkill -f "vite"
sleep 2

echo "🗄️ Запуск баз данных..."
docker-compose up -d postgres redis
sleep 5

echo "🔧 Миграции БД..."
cd backend && npx prisma migrate deploy
cd ..

echo "🚀 Запуск Backend..."
cd backend && npm run dev > /tmp/backend.log 2>&1 &
cd ..
sleep 5

echo "🎨 Запуск Frontend..."
npm run dev > /tmp/frontend.log 2>&1 &
sleep 5

echo "✅ Все сервисы запущены!"
echo ""
echo "Backend:  http://localhost:3001"
echo "Frontend: http://localhost:3002"
echo "Bot:      @DobroGuideBot"
```

Сохраните этот скрипт как `restart-all.sh` и запустите:

```bash
chmod +x restart-all.sh
./restart-all.sh
```

---

## 📚 Дополнительная документация

- **Архитектура**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **API документация**: [backend/README.md](backend/README.md)
- **Telegram Bot**: [TELEGRAM_BOT_SETUP.md](TELEGRAM_BOT_SETUP.md)
- **Деплой**: [DEPLOY_NOW.txt](DEPLOY_NOW.txt)
- **Тестирование**: [TESTING_REPORT.md](TESTING_REPORT.md)

---

## 🆘 Помощь

### Частые проблемы

**1. Порт 3001 занят**
```bash
# Найти процесс
lsof -i :3001
# Убить процесс
kill -9 <PID>
```

**2. База данных не отвечает**
```bash
# Перезапустить PostgreSQL
docker-compose restart postgres
# Проверить логи
docker-compose logs postgres
```

**3. Frontend не загружается**
```bash
# Очистить кэш и перезапустить
rm -rf node_modules/.vite
npm run dev
```

**4. Telegram бот не отвечает**
```bash
# Проверить токен
grep TELEGRAM_BOT_TOKEN backend/.env
# Проверить логи
tail -f /tmp/backend.log | grep -i telegram
```

---

## ✅ Чеклист готовности

- [x] PostgreSQL запущен и работает
- [x] Redis запущен и работает
- [x] Backend API отвечает на запросы
- [x] Frontend загружается
- [x] Telegram бот инициализирован
- [x] Все переменные окружения настроены
- [x] Миграции БД применены
- [x] Зависимости установлены

---

## 🎉 Готово к использованию!

Система полностью настроена и готова к работе. Начните с:

1. **Откройте Frontend**: http://localhost:3002
2. **Попробуйте Telegram бота**: @DobroGuideBot
3. **Изучите API**: http://localhost:3001/api-docs

**Удачи в использовании DOBRO!** 🚀
