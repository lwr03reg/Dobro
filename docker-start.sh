#!/bin/bash

# ╔════════════════════════════════════════════════════════════╗
# ║                                                            ║
# ║         🐳 DOBRO SYSTEM - DOCKER ONE-CLICK START 🐳      ║
# ║                                                            ║
# ╚════════════════════════════════════════════════════════════╝

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}║         🐳 DOBRO SYSTEM - DOCKER START 🐳                ║${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check Docker
echo -e "${BLUE}[1/4]${NC} Проверка Docker..."
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker не запущен!${NC}"
    echo -e "${YELLOW}Запустите Docker Desktop и попробуйте снова.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker работает${NC}"

# Stop old containers
echo -e "${BLUE}[2/4]${NC} Остановка старых контейнеров..."
docker-compose down > /dev/null 2>&1 || true
echo -e "${GREEN}✅ Старые контейнеры остановлены${NC}"

# Build images
echo -e "${BLUE}[3/4]${NC} Сборка Docker образов..."
echo -e "${YELLOW}   Это может занять несколько минут при первом запуске...${NC}"
docker-compose build --no-cache > /dev/null 2>&1
echo -e "${GREEN}✅ Образы собраны${NC}"

# Start all services
echo -e "${BLUE}[4/4]${NC} Запуск всех сервисов..."
docker-compose up -d

echo ""
echo -e "${YELLOW}⏳ Ожидание готовности сервисов...${NC}"
echo ""

# Wait for services
sleep 5

# Check PostgreSQL
echo -n "   PostgreSQL: "
for i in {1..30}; do
    if docker exec dobro-postgres pg_isready -U dobro > /dev/null 2>&1; then
        echo -e "${GREEN}✅ READY${NC}"
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ TIMEOUT${NC}"
    fi
done

# Check Redis
echo -n "   Redis: "
for i in {1..30}; do
    if docker exec dobro-redis redis-cli ping > /dev/null 2>&1; then
        echo -e "${GREEN}✅ READY${NC}"
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ TIMEOUT${NC}"
    fi
done

# Check Backend
echo -n "   Backend: "
for i in {1..60}; do
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ READY${NC}"
        break
    fi
    sleep 1
    if [ $i -eq 60 ]; then
        echo -e "${YELLOW}⚠️  STARTING...${NC}"
    fi
done

# Check Frontend
echo -n "   Frontend: "
for i in {1..60}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ READY${NC}"
        break
    fi
    sleep 1
    if [ $i -eq 60 ]; then
        echo -e "${YELLOW}⚠️  STARTING...${NC}"
    fi
done

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║         ✨ СИСТЕМА ЗАПУЩЕНА! ✨                           ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}🌐 URLs:${NC}"
echo -e "   Frontend:  ${BLUE}http://localhost:3000${NC}"
echo -e "   Backend:   ${BLUE}http://localhost:3001${NC}"
echo -e "   API:       ${BLUE}http://localhost:3001/api${NC}"
echo ""
echo -e "${CYAN}🗄️  Databases:${NC}"
echo -e "   PostgreSQL: ${BLUE}localhost:5432${NC} (user: dobro, db: dobro_db)"
echo -e "   Redis:      ${BLUE}localhost:6379${NC}"
echo ""
echo -e "${CYAN}📊 Управление:${NC}"
echo -e "   Логи:       ${BLUE}docker-compose logs -f${NC}"
echo -e "   Остановить: ${BLUE}docker-compose down${NC}"
echo -e "   Перезапуск: ${BLUE}docker-compose restart${NC}"
echo -e "   Статус:     ${BLUE}docker-compose ps${NC}"
echo ""
echo -e "${CYAN}🔧 Полезные команды:${NC}"
echo -e "   Prisma Studio: ${BLUE}docker exec -it dobro-backend npx prisma studio${NC}"
echo -e "   Backend Shell: ${BLUE}docker exec -it dobro-backend sh${NC}"
echo -e "   DB Logs:       ${BLUE}docker logs dobro-postgres${NC}"
echo ""
echo -e "${YELLOW}💡 Tip: Используйте 'docker-compose logs -f' для просмотра логов${NC}"
echo ""
