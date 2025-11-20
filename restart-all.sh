#!/bin/bash

echo "🛑 Остановка всех сервисов..."
docker-compose down
pkill -f "tsx watch"
pkill -f "vite"
sleep 2

echo "🗄️ Запуск баз данных..."
docker-compose up -d postgres redis
sleep 5

echo "🔧 Миграции БД..."
cd backend && npx prisma migrate deploy
cd ..

echo "🚀 Запуск Backend..."
cd backend && npm run dev > /tmp/backend.log 2>&1 &
cd ..
sleep 5

echo "🎨 Запуск Frontend..."
npm run dev > /tmp/frontend.log 2>&1 &
sleep 5

echo ""
echo "✅ Все сервисы запущены!"
echo ""
echo "📊 Статус:"
echo "  Backend:  http://localhost:3001 ✅"
echo "  Frontend: http://localhost:3002 ✅"
echo "  Bot:      @DobroGuideBot ✅"
echo ""
echo "📝 Логи:"
echo "  Backend:  tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🎉 Готово к использованию!"
