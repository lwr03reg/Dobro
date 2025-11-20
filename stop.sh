#!/bin/bash

# ╔════════════════════════════════════════════════════════════╗
# ║                                                            ║
# ║         🛑 DOBRO SYSTEM - STOP SCRIPT 🛑                  ║
# ║                                                            ║
# ╚════════════════════════════════════════════════════════════╝

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${YELLOW}🛑 Остановка DOBRO System...${NC}"
echo ""

# Stop frontend
if [ -f ".pids/frontend.pid" ]; then
    FRONTEND_PID=$(cat .pids/frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "${BLUE}Остановка Frontend (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID 2>/dev/null || true
        echo -e "${GREEN}✅ Frontend остановлен${NC}"
    fi
    rm .pids/frontend.pid
fi

# Stop backend
if [ -f ".pids/backend.pid" ]; then
    BACKEND_PID=$(cat .pids/backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${BLUE}Остановка Backend (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID 2>/dev/null || true
        echo -e "${GREEN}✅ Backend остановлен${NC}"
    fi
    rm .pids/backend.pid
fi

# Stop Docker containers
echo -e "${BLUE}Остановка Docker контейнеров...${NC}"
docker-compose down > /dev/null 2>&1
echo -e "${GREEN}✅ Docker контейнеры остановлены${NC}"

# Kill any remaining node processes on ports 3000 and 3001
echo -e "${BLUE}Очистка портов...${NC}"
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
echo -e "${GREEN}✅ Порты освобождены${NC}"

echo ""
echo -e "${GREEN}✅ Система полностью остановлена${NC}"
echo ""
