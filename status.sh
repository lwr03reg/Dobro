#!/bin/bash

# ╔════════════════════════════════════════════════════════════╗
# ║                                                            ║
# ║         📊 DOBRO SYSTEM - STATUS CHECK 📊                 ║
# ║                                                            ║
# ╚════════════════════════════════════════════════════════════╝

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║         📊 DOBRO SYSTEM STATUS 📊                         ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check Frontend
echo -e "${BLUE}Frontend (http://localhost:3000):${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ RUNNING${NC}"
    if [ -f ".pids/frontend.pid" ]; then
        echo -e "   PID: $(cat .pids/frontend.pid)"
    fi
else
    echo -e "   ${RED}❌ NOT RUNNING${NC}"
fi
echo ""

# Check Backend
echo -e "${BLUE}Backend (http://localhost:3001):${NC}"
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ RUNNING${NC}"
    if [ -f ".pids/backend.pid" ]; then
        echo -e "   PID: $(cat .pids/backend.pid)"
    fi
    echo -e "   Health: $(curl -s http://localhost:3001/health)"
else
    echo -e "   ${RED}❌ NOT RUNNING${NC}"
fi
echo ""

# Check PostgreSQL
echo -e "${BLUE}PostgreSQL (localhost:5432):${NC}"
if docker exec dobro-postgres pg_isready -U dobro > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ RUNNING${NC}"
    echo -e "   Container: dobro-postgres"
else
    echo -e "   ${RED}❌ NOT RUNNING${NC}"
fi
echo ""

# Check Redis
echo -e "${BLUE}Redis (localhost:6379):${NC}"
if docker exec dobro-redis redis-cli ping > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ RUNNING${NC}"
    echo -e "   Container: dobro-redis"
else
    echo -e "   ${RED}❌ NOT RUNNING${NC}"
fi
echo ""

# Check Docker
echo -e "${BLUE}Docker:${NC}"
if docker info > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ RUNNING${NC}"
    echo -e "   Containers: $(docker ps --format '{{.Names}}' | grep dobro | wc -l) active"
else
    echo -e "   ${RED}❌ NOT RUNNING${NC}"
fi
echo ""

# Port usage
echo -e "${BLUE}Ports:${NC}"
echo -e "   3000: $(lsof -ti:3000 > /dev/null 2>&1 && echo -e "${GREEN}IN USE${NC}" || echo -e "${YELLOW}FREE${NC}")"
echo -e "   3001: $(lsof -ti:3001 > /dev/null 2>&1 && echo -e "${GREEN}IN USE${NC}" || echo -e "${YELLOW}FREE${NC}")"
echo -e "   5432: $(lsof -ti:5432 > /dev/null 2>&1 && echo -e "${GREEN}IN USE${NC}" || echo -e "${YELLOW}FREE${NC}")"
echo -e "   6379: $(lsof -ti:6379 > /dev/null 2>&1 && echo -e "${GREEN}IN USE${NC}" || echo -e "${YELLOW}FREE${NC}")"
echo ""

# Logs
echo -e "${BLUE}Recent Logs:${NC}"
if [ -f "logs/backend.log" ]; then
    echo -e "   Backend: $(wc -l < logs/backend.log) lines"
fi
if [ -f "logs/frontend.log" ]; then
    echo -e "   Frontend: $(wc -l < logs/frontend.log) lines"
fi
echo ""

echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
