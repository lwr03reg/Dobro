#!/bin/bash

# ╔════════════════════════════════════════════════════════════╗
# ║                                                            ║
# ║         🚀 DOBRO SYSTEM - ONE-CLICK LAUNCHER 🚀           ║
# ║                                                            ║
# ║  Запускает всю систему одной командой                     ║
# ║                                                            ║
# ╚════════════════════════════════════════════════════════════╝

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis
CHECK="✅"
CROSS="❌"
ROCKET="🚀"
GEAR="⚙️"
DATABASE="🗄️"
FIRE="🔥"
SPARKLES="✨"

echo ""
echo -e "${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                            ║${NC}"
echo -e "${PURPLE}║         ${ROCKET} DOBRO SYSTEM - ONE-CLICK LAUNCHER ${ROCKET}           ║${NC}"
echo -e "${PURPLE}║                                                            ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${BLUE}[${1}]${NC} ${2}"
}

print_success() {
    echo -e "${GREEN}${CHECK} ${1}${NC}"
}

print_error() {
    echo -e "${RED}${CROSS} ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  ${1}${NC}"
}

# Check if .env exists
print_status "1/8" "Проверка конфигурации..."
if [ ! -f ".env" ]; then
    print_warning ".env файл не найден, создаю из примера..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success ".env создан из .env.example"
    else
        print_error ".env.example не найден!"
        exit 1
    fi
fi

# Check backend .env
if [ ! -f "backend/.env" ]; then
    print_warning "backend/.env не найден, создаю..."
    cat > backend/.env << 'EOF'
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://dobro:dobro123@localhost:5432/dobro_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=dev-secret-change-in-production-please
JWT_EXPIRES_IN=7d

# AI (Gemini)
GEMINI_API_KEY=AIzaSyCAPCpq8-sGBxOcPS3qqrFK2HpuIIHIyTE

# Telegram Bot
TELEGRAM_BOT_TOKEN=8480665448:AAElJ5EmARXqJI5sbyAKtBAenMTOPUP1X94
TELEGRAM_WEBHOOK_URL=

# Stripe (optional)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
EOF
    print_success "backend/.env создан"
fi

print_success "Конфигурация готова"

# Check if Docker is running
print_status "2/8" "Проверка Docker..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker не запущен! Запустите Docker Desktop и попробуйте снова."
    exit 1
fi
print_success "Docker работает"

# Stop existing containers
print_status "3/8" "Остановка старых контейнеров..."
docker-compose down > /dev/null 2>&1 || true
print_success "Старые контейнеры остановлены"

# Install dependencies
print_status "4/8" "Установка зависимостей..."

# Backend dependencies
if [ ! -d "backend/node_modules" ]; then
    print_status "4/8" "Установка backend зависимостей..."
    cd backend && npm install --legacy-peer-deps > /dev/null 2>&1 && cd ..
    print_success "Backend зависимости установлены"
else
    print_success "Backend зависимости уже установлены"
fi

# Frontend dependencies
if [ ! -d "node_modules" ]; then
    print_status "4/8" "Установка frontend зависимостей..."
    npm install --legacy-peer-deps > /dev/null 2>&1
    print_success "Frontend зависимости установлены"
else
    print_success "Frontend зависимости уже установлены"
fi

# Start databases
print_status "5/8" "Запуск баз данных (PostgreSQL + Redis)..."
docker-compose up -d postgres redis > /dev/null 2>&1

# Wait for databases
echo -n "   Ожидание готовности баз данных"
for i in {1..30}; do
    if docker exec dobro-postgres pg_isready -U dobro > /dev/null 2>&1 && \
       docker exec dobro-redis redis-cli ping > /dev/null 2>&1; then
        echo ""
        print_success "Базы данных готовы"
        break
    fi
    echo -n "."
    sleep 1
    if [ $i -eq 30 ]; then
        echo ""
        print_error "Timeout: базы данных не запустились"
        exit 1
    fi
done

# Generate Prisma Client
print_status "6/8" "Генерация Prisma Client..."
cd backend && npx prisma generate > /dev/null 2>&1 && cd ..
print_success "Prisma Client сгенерирован"

# Run migrations
print_status "7/8" "Применение миграций базы данных..."
cd backend && npx prisma migrate deploy > /dev/null 2>&1 && cd ..
print_success "Миграции применены"

# Build backend
print_status "8/8" "Сборка backend..."
cd backend && npm run build > /dev/null 2>&1 && cd ..
print_success "Backend собран"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║         ${FIRE} ВСЁ ГОТОВО! ЗАПУСКАЮ СИСТЕМУ... ${FIRE}              ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Start backend in background
print_status "${ROCKET}" "Запуск Backend API..."
cd backend && npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo "   PID: $BACKEND_PID"

# Wait for backend to be ready
echo -n "   Ожидание готовности backend"
for i in {1..30}; do
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo ""
        print_success "Backend готов на http://localhost:3001"
        break
    fi
    echo -n "."
    sleep 1
    if [ $i -eq 30 ]; then
        echo ""
        print_warning "Backend не ответил, но продолжаем..."
    fi
done

# Start frontend in background
print_status "${ROCKET}" "Запуск Frontend..."
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   PID: $FRONTEND_PID"

# Wait for frontend to be ready
echo -n "   Ожидание готовности frontend"
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo ""
        print_success "Frontend готов на http://localhost:3000"
        break
    fi
    echo -n "."
    sleep 1
    if [ $i -eq 30 ]; then
        echo ""
        print_warning "Frontend не ответил, но продолжаем..."
    fi
done

# Save PIDs
mkdir -p .pids
echo $BACKEND_PID > .pids/backend.pid
echo $FRONTEND_PID > .pids/frontend.pid

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}║         ${SPARKLES} СИСТЕМА ЗАПУЩЕНА УСПЕШНО! ${SPARKLES}                  ║${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}${CHECK} Сервисы:${NC}"
echo -e "   ${BLUE}Frontend:${NC}  http://localhost:3000"
echo -e "   ${BLUE}Backend:${NC}   http://localhost:3001"
echo -e "   ${BLUE}API Docs:${NC}  http://localhost:3001/api"
echo ""
echo -e "${GREEN}${CHECK} Базы данных:${NC}"
echo -e "   ${BLUE}PostgreSQL:${NC} localhost:5432 (user: dobro, db: dobro_db)"
echo -e "   ${BLUE}Redis:${NC}      localhost:6379"
echo ""
echo -e "${GREEN}${CHECK} Логи:${NC}"
echo -e "   ${BLUE}Backend:${NC}  tail -f logs/backend.log"
echo -e "   ${BLUE}Frontend:${NC} tail -f logs/frontend.log"
echo ""
echo -e "${GREEN}${CHECK} Управление:${NC}"
echo -e "   ${BLUE}Остановить:${NC} ./stop.sh"
echo -e "   ${BLUE}Перезапуск:${NC} ./restart.sh"
echo -e "   ${BLUE}Статус:${NC}     ./status.sh"
echo ""
echo -e "${YELLOW}⚠️  Нажмите Ctrl+C для остановки (или используйте ./stop.sh)${NC}"
echo ""

# Keep script running and show logs
tail -f logs/backend.log logs/frontend.log
