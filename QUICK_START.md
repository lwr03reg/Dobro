# 🚀 DOBRO SYSTEM - БЫСТРЫЙ СТАРТ

## ⚡ Запуск одной командой

### Вариант 1: Локальный запуск (рекомендуется для разработки)

```bash
./start.sh
```

**Что происходит:**
1. ✅ Проверка конфигурации (.env файлы)
2. ✅ Запуск PostgreSQL и Redis в Docker
3. ✅ Установка зависимостей (если нужно)
4. ✅ Генерация Prisma Client
5. ✅ Применение миграций БД
6. ✅ Сборка backend
7. ✅ Запуск backend на порту 3001
8. ✅ Запуск frontend на порту 3000

**Результат:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API: http://localhost:3001/api

---

### Вариант 2: Docker Compose (полная изоляция)

```bash
./docker-start.sh
```

**Что происходит:**
1. ✅ Проверка Docker
2. ✅ Остановка старых контейнеров
3. ✅ Сборка Docker образов
4. ✅ Запуск всех сервисов в контейнерах
5. ✅ Проверка готовности каждого сервиса

**Результат:**
- Все сервисы работают в Docker контейнерах
- Автоматический перезапуск при сбоях
- Изолированная среда

---

## 🛑 Остановка системы

```bash
./stop.sh
```

Останавливает все процессы и освобождает порты.

---

## 🔄 Перезапуск

```bash
./restart.sh
```

Останавливает и запускает систему заново.

---

## 📊 Проверка статуса

```bash
./status.sh
```

Показывает состояние всех сервисов.

---

## 🏥 Полная проверка здоровья

```bash
./healthcheck.sh
```

Выполняет детальную проверку всех компонентов системы.

---

## 📋 Требования

### Минимальные требования:
- **Node.js**: 20.x или выше
- **npm**: 10.x или выше
- **Docker**: Последняя версия
- **Docker Compose**: v2.x
- **Свободные порты**: 3000, 3001, 5432, 6379

### Проверка требований:

```bash
node --version    # должно быть >= 20.0.0
npm --version     # должно быть >= 10.0.0
docker --version  # должен быть установлен
docker-compose --version  # должен быть установлен
```

---

## 🔧 Первый запуск

### Шаг 1: Клонирование репозитория

```bash
git clone https://github.com/lwr03reg/Dobro.git
cd Dobro
```

### Шаг 2: Настройка переменных окружения

Файлы `.env` создаются автоматически при первом запуске, но вы можете настроить их вручную:

```bash
# Корневой .env (для frontend)
cp .env.example .env

# Backend .env
cp backend/.env.example backend/.env
```

### Шаг 3: Запуск

```bash
./start.sh
```

Всё! Система запустится автоматически.

---

## 🎯 Что делать после запуска?

### 1. Откройте браузер

Перейдите на http://localhost:3000

### 2. Проверьте API

```bash
curl http://localhost:3001/health
```

Должен вернуть:
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T12:00:00.000Z"
}
```

### 3. Откройте Prisma Studio (опционально)

```bash
cd backend
npx prisma studio
```

Откроется на http://localhost:5555

---

## 🐛 Решение проблем

### Проблема: Порты заняты

```bash
# Проверить, что использует порты
lsof -ti:3000
lsof -ti:3001

# Убить процессы
./stop.sh
```

### Проблема: Docker не запускается

```bash
# Проверить статус Docker
docker info

# Запустить Docker Desktop
# Затем повторить запуск
./start.sh
```

### Проблема: База данных не инициализируется

```bash
# Пересоздать базу данных
docker-compose down -v
./start.sh
```

### Проблема: Зависимости не устанавливаются

```bash
# Очистить и переустановить
rm -rf node_modules backend/node_modules
npm install --legacy-peer-deps
cd backend && npm install --legacy-peer-deps && cd ..
./start.sh
```

---

## 📚 Полезные команды

### Логи

```bash
# Все логи
tail -f logs/backend.log logs/frontend.log

# Только backend
tail -f logs/backend.log

# Только frontend
tail -f logs/frontend.log

# Docker логи
docker-compose logs -f
```

### База данных

```bash
# Подключиться к PostgreSQL
docker exec -it dobro-postgres psql -U dobro -d dobro_db

# Подключиться к Redis
docker exec -it dobro-redis redis-cli

# Применить миграции
cd backend && npx prisma migrate deploy

# Создать новую миграцию
cd backend && npx prisma migrate dev --name your_migration_name
```

### Docker

```bash
# Статус контейнеров
docker-compose ps

# Перезапустить сервис
docker-compose restart backend

# Пересобрать образы
docker-compose build --no-cache

# Очистить всё
docker-compose down -v
```

---

## 🎨 Структура проекта

```
Dobro/
├── backend/              # Backend API (Node.js + Express)
│   ├── src/             # Исходный код
│   ├── prisma/          # База данных (схема и миграции)
│   └── dist/            # Скомпилированный код
├── frontend/            # Frontend (React + Vite)
│   └── src/            # Исходный код
├── logs/               # Логи приложения
├── .pids/              # PID файлы процессов
├── start.sh            # 🚀 Главный скрипт запуска
├── stop.sh             # 🛑 Остановка системы
├── restart.sh          # 🔄 Перезапуск
├── status.sh           # 📊 Проверка статуса
├── healthcheck.sh      # 🏥 Полная проверка
├── docker-start.sh     # 🐳 Docker запуск
└── docker-compose.yml  # Docker конфигурация
```

---

## 🌟 Особенности

### ✅ Автоматическая инициализация
- Создание .env файлов
- Установка зависимостей
- Генерация Prisma Client
- Применение миграций БД

### ✅ Проверки готовности
- Ожидание запуска баз данных
- Проверка health endpoints
- Автоматический retry при ошибках

### ✅ Удобное управление
- Цветной вывод в консоли
- Информативные сообщения
- Сохранение PID процессов
- Логирование в файлы

### ✅ Гибкость
- Локальный запуск или Docker
- Легкая остановка и перезапуск
- Детальная диагностика

---

## 🔐 Безопасность

### Для разработки:
- Используются дефолтные пароли (dobro123)
- JWT secret: dev-secret-change-in-production

### Для production:
1. Измените все пароли в `.env`
2. Сгенерируйте новый JWT_SECRET
3. Используйте HTTPS
4. Настройте firewall
5. Включите rate limiting

---

## 📞 Поддержка

### Проблемы?
1. Запустите `./healthcheck.sh` для диагностики
2. Проверьте логи: `tail -f logs/*.log`
3. Создайте issue на GitHub

### Документация:
- [Полная документация](./README.md)
- [Архитектура](./ARCHITECTURE.md)
- [Деплой на Railway](./RAILWAY_DEPLOY.md)
- [Тестирование](./FULL_TESTING_REPORT.md)

---

## 🎉 Готово!

Теперь вы можете запустить всю систему одной командой:

```bash
./start.sh
```

И начать разработку! 🚀
