#!/bin/bash

# DOBRO SYSTEM - Quick Start Script
# Автоматический запуск всех сервисов

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         DOBRO SYSTEM - Quick Start                          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env файл не найден${NC}"
    echo "Создаю из .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env создан${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  ВАЖНО: Добавьте свой OPENAI_API_KEY в .env файл!${NC}"
    echo "Получить ключ: https://platform.openai.com/api-keys"
    echo ""
    read -p "Нажмите Enter когда добавите ключ..."
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker не запущен${NC}"
    echo "Запустите Docker Desktop и попробуйте снова"
    exit 1
fi

echo -e "${GREEN}✅ Docker запущен${NC}"
echo ""

# Start databases
echo "🐘 Запускаю PostgreSQL и Redis..."
docker-compose up -d postgres redis

# Wait for databases
echo "⏳ Ожидание запуска баз данных..."
sleep 5

# Check if databases are running
if docker-compose ps | grep -q "postgres.*Up"; then
    echo -e "${GREEN}✅ PostgreSQL запущен${NC}"
else
    echo -e "${RED}❌ PostgreSQL не запустился${NC}"
    exit 1
fi

if docker-compose ps | grep -q "redis.*Up"; then
    echo -e "${GREEN}✅ Redis запущен${NC}"
else
    echo -e "${RED}❌ Redis не запустился${NC}"
    exit 1
fi

echo ""

# Install backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Устанавливаю зависимости backend..."
    cd backend
    npm install
    cd ..
    echo -e "${GREEN}✅ Зависимости установлены${NC}"
else
    echo -e "${GREEN}✅ Зависимости уже установлены${NC}"
fi

echo ""

# Generate Prisma Client
echo "🔧 Генерирую Prisma Client..."
cd backend
npm run prisma:generate > /dev/null 2>&1
echo -e "${GREEN}✅ Prisma Client сгенерирован${NC}"

# Run migrations
echo "🗄️  Применяю миграции базы данных..."
if npm run prisma:migrate > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Миграции применены${NC}"
else
    echo -e "${YELLOW}⚠️  Миграции уже применены или произошла ошибка${NC}"
fi

cd ..

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    ✅ ВСЁ ГОТОВО!                            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Запускаю backend сервер..."
echo ""
echo "Backend будет доступен на: http://localhost:3001"
echo "Test UI: откройте test-ui.html в браузере"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start backend
cd backend
npm run dev
