#!/bin/bash
export DATABASE_URL="postgresql://dobro:dobro123@localhost:5432/dobro_db"
export REDIS_URL="redis://localhost:6379"
export JWT_SECRET="P7ZcWqHuvanRFm4dWwoe1OFssJJPo2+Ae83o3DVEwgM="
export FRONTEND_URL="http://localhost:3000"
export GEMINI_API_KEY="AIzaSyCAPCpq8-sGBxOcPS3qqrFK2HpuIIHIyTE"
export NODE_ENV="development"
export PORT="3001"

npx tsx src/index.ts
