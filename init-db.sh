#!/bin/bash

# ╔════════════════════════════════════════════════════════════╗
# ║                                                            ║
# ║         🗄️  DOBRO SYSTEM - DATABASE INIT 🗄️              ║
# ║                                                            ║
# ╚════════════════════════════════════════════════════════════╝

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         🗄️  Инициализация баз данных 🗄️                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if databases are running
echo -e "${BLUE}[1/5]${NC} Проверка баз данных..."
if ! docker exec dobro-postgres pg_isready -U dobro > /dev/null 2>&1; then
    echo -e "${RED}❌ PostgreSQL не запущен!${NC}"
    echo -e "${YELLOW}Запустите: docker-compose up -d postgres${NC}"
    exit 1
fi

if ! docker exec dobro-redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${RED}❌ Redis не запущен!${NC}"
    echo -e "${YELLOW}Запустите: docker-compose up -d redis${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Базы данных запущены${NC}"

# Generate Prisma Client
echo -e "${BLUE}[2/5]${NC} Генерация Prisma Client..."
cd backend
npx prisma generate > /dev/null 2>&1
echo -e "${GREEN}✅ Prisma Client сгенерирован${NC}"

# Check for pending migrations
echo -e "${BLUE}[3/5]${NC} Проверка миграций..."
MIGRATION_STATUS=$(npx prisma migrate status 2>&1 || true)

if echo "$MIGRATION_STATUS" | grep -q "Database schema is up to date"; then
    echo -e "${GREEN}✅ База данных актуальна${NC}"
elif echo "$MIGRATION_STATUS" | grep -q "following migrations have not yet been applied"; then
    echo -e "${YELLOW}⚠️  Найдены неприменённые миграции${NC}"
    echo -e "${BLUE}[4/5]${NC} Применение миграций..."
    npx prisma migrate deploy
    echo -e "${GREEN}✅ Миграции применены${NC}"
else
    echo -e "${YELLOW}⚠️  Создание первой миграции...${NC}"
    echo -e "${BLUE}[4/5]${NC} Создание и применение миграций..."
    npx prisma migrate dev --name init --skip-generate
    echo -e "${GREEN}✅ Миграции созданы и применены${NC}"
fi

# Seed database (optional)
echo -e "${BLUE}[5/5]${NC} Проверка начальных данных..."
if [ -f "prisma/seed.ts" ]; then
    echo -e "${YELLOW}Запуск seed скрипта...${NC}"
    npx tsx prisma/seed.ts
    echo -e "${GREEN}✅ Начальные данные загружены${NC}"
else
    echo -e "${YELLOW}⚠️  Seed скрипт не найден (это нормально)${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         ✅ База данных готова к работе! ✅                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Информация о базе данных:${NC}"
echo -e "   Host: localhost"
echo -e "   Port: 5432"
echo -e "   Database: dobro_db"
echo -e "   User: dobro"
echo -e "   Password: dobro123"
echo ""
echo -e "${BLUE}Prisma Studio:${NC}"
echo -e "   Запустить: cd backend && npx prisma studio"
echo -e "   URL: http://localhost:5555"
echo ""
