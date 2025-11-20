#!/bin/bash

# ╔════════════════════════════════════════════════════════════╗
# ║                                                            ║
# ║         🏥 DOBRO SYSTEM - HEALTH CHECK 🏥                 ║
# ║                                                            ║
# ╚════════════════════════════════════════════════════════════╝

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

TOTAL_CHECKS=0
PASSED_CHECKS=0

check_service() {
    local name=$1
    local check_command=$2
    local description=$3
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -n "   ${name}: "
    
    if eval "$check_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ HEALTHY${NC}"
        if [ -n "$description" ]; then
            echo -e "      ${description}"
        fi
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌ UNHEALTHY${NC}"
        if [ -n "$description" ]; then
            echo -e "      ${RED}${description}${NC}"
        fi
        return 1
    fi
}

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         🏥 DOBRO SYSTEM HEALTH CHECK 🏥                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Infrastructure Checks
echo -e "${BLUE}🔧 Infrastructure:${NC}"
check_service "Docker" "docker info" "Docker daemon is running"
echo ""

# Database Checks
echo -e "${BLUE}🗄️  Databases:${NC}"
check_service "PostgreSQL" "docker exec dobro-postgres pg_isready -U dobro" "Ready to accept connections"
check_service "Redis" "docker exec dobro-redis redis-cli ping" "Responding to PING"

# Test PostgreSQL connection
if docker exec dobro-postgres psql -U dobro -d dobro_db -c "SELECT 1" > /dev/null 2>&1; then
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    echo -e "   PostgreSQL Query: ${GREEN}✅ WORKING${NC}"
else
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -e "   PostgreSQL Query: ${RED}❌ FAILED${NC}"
fi

# Test Redis connection
if docker exec dobro-redis redis-cli SET healthcheck "ok" > /dev/null 2>&1 && \
   docker exec dobro-redis redis-cli GET healthcheck > /dev/null 2>&1; then
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    echo -e "   Redis Read/Write: ${GREEN}✅ WORKING${NC}"
else
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -e "   Redis Read/Write: ${RED}❌ FAILED${NC}"
fi
echo ""

# Application Checks
echo -e "${BLUE}🚀 Applications:${NC}"
check_service "Backend API" "curl -f http://localhost:3001/health" "Health endpoint responding"
check_service "Frontend" "curl -f http://localhost:3000" "Serving content"
echo ""

# Backend API Endpoints
echo -e "${BLUE}🔌 Backend Endpoints:${NC}"
check_service "Health" "curl -f http://localhost:3001/health"
check_service "API Root" "curl -f http://localhost:3001/api"

# Check if backend is actually processing
BACKEND_HEALTH=$(curl -s http://localhost:3001/health 2>/dev/null)
if [ -n "$BACKEND_HEALTH" ]; then
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    echo -e "   Health Response: ${GREEN}✅ VALID${NC}"
    echo -e "      ${BACKEND_HEALTH}"
else
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -e "   Health Response: ${RED}❌ EMPTY${NC}"
fi
echo ""

# Port Checks
echo -e "${BLUE}🔌 Ports:${NC}"
check_service "3000 (Frontend)" "lsof -ti:3000" "Port is in use"
check_service "3001 (Backend)" "lsof -ti:3001" "Port is in use"
check_service "5432 (PostgreSQL)" "lsof -ti:5432" "Port is in use"
check_service "6379 (Redis)" "lsof -ti:6379" "Port is in use"
echo ""

# Container Checks
echo -e "${BLUE}🐳 Docker Containers:${NC}"
CONTAINERS=$(docker ps --format '{{.Names}}' | grep dobro || true)
if [ -n "$CONTAINERS" ]; then
    while IFS= read -r container; do
        STATUS=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null)
        HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "none")
        
        TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
        echo -n "   ${container}: "
        
        if [ "$STATUS" = "running" ]; then
            if [ "$HEALTH" = "healthy" ] || [ "$HEALTH" = "none" ]; then
                echo -e "${GREEN}✅ RUNNING${NC}"
                PASSED_CHECKS=$((PASSED_CHECKS + 1))
            else
                echo -e "${YELLOW}⚠️  RUNNING (health: ${HEALTH})${NC}"
                PASSED_CHECKS=$((PASSED_CHECKS + 1))
            fi
        else
            echo -e "${RED}❌ ${STATUS}${NC}"
        fi
    done <<< "$CONTAINERS"
else
    echo -e "   ${YELLOW}⚠️  No containers running${NC}"
fi
echo ""

# File System Checks
echo -e "${BLUE}📁 File System:${NC}"
check_service ".env" "test -f .env" "Environment file exists"
check_service "backend/.env" "test -f backend/.env" "Backend env file exists"
check_service "node_modules" "test -d node_modules" "Frontend dependencies installed"
check_service "backend/node_modules" "test -d backend/node_modules" "Backend dependencies installed"
check_service "backend/dist" "test -d backend/dist" "Backend build exists"
echo ""

# Prisma Checks
echo -e "${BLUE}🔷 Prisma:${NC}"
check_service "Schema" "test -f backend/prisma/schema.prisma" "Schema file exists"
check_service "Migrations" "test -d backend/prisma/migrations" "Migrations directory exists"

# Check if Prisma Client is generated
if [ -d "backend/node_modules/.prisma/client" ]; then
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    echo -e "   Client Generated: ${GREEN}✅ YES${NC}"
else
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -e "   Client Generated: ${RED}❌ NO${NC}"
    echo -e "      ${YELLOW}Run: cd backend && npx prisma generate${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                      SUMMARY                               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

echo -e "   Total Checks: ${TOTAL_CHECKS}"
echo -e "   Passed: ${GREEN}${PASSED_CHECKS}${NC}"
echo -e "   Failed: ${RED}$((TOTAL_CHECKS - PASSED_CHECKS))${NC}"
echo -e "   Success Rate: ${PERCENTAGE}%"
echo ""

if [ $PERCENTAGE -eq 100 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║         ✅ ALL SYSTEMS OPERATIONAL ✅                     ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 0
elif [ $PERCENTAGE -ge 80 ]; then
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║         ⚠️  SYSTEM MOSTLY OPERATIONAL ⚠️                  ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║         ❌ SYSTEM HAS CRITICAL ISSUES ❌                  ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
