#!/bin/bash

# ╔════════════════════════════════════════════════════════════╗
# ║                                                            ║
# ║         🔄 DOBRO SYSTEM - RESTART SCRIPT 🔄               ║
# ║                                                            ║
# ╚════════════════════════════════════════════════════════════╝

CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}🔄 Перезапуск DOBRO System...${NC}"
echo ""

# Stop everything
./stop.sh

# Wait a bit
sleep 2

# Start everything
./start.sh
