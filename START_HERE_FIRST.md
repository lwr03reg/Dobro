# 👋 НАЧНИТЕ ЗДЕСЬ!

## 🎯 Хотите просто запустить систему?

### Выполните одну команду:

```bash
./start.sh
```

**Готово!** Система запустится автоматически.

---

## 📚 Документация

### Для быстрого старта:
- **[ONE_CLICK_START.md](./ONE_CLICK_START.md)** ← Запуск одной кнопкой
- **[QUICK_START.md](./QUICK_START.md)** ← Подробная инструкция

### Для разработчиков:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Архитектура системы
- [FULL_TESTING_REPORT.md](./FULL_TESTING_REPORT.md) - Отчёты о тестах
- [README.md](./README.md) - Полная документация

### Для деплоя:
- [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) - Деплой на Railway
- [DEPLOY_FIX.md](./DEPLOY_FIX.md) - Решение проблем деплоя

---

## 🚀 Три способа запуска

### 1. Локальный запуск (рекомендуется)
```bash
./start.sh
```
- Быстрее всего
- Удобно для разработки
- Hot reload

### 2. Docker Compose
```bash
./docker-start.sh
```
- Полная изоляция
- Автоматический перезапуск
- Как в production

### 3. Railway (облако)
```bash
# Следуйте инструкции в RAILWAY_DEPLOY.md
```
- Доступно из интернета
- Автоматический деплой
- Бесплатный план

---

## 🛠️ Управление системой

```bash
./start.sh       # Запуск
./stop.sh        # Остановка
./restart.sh     # Перезапуск
./status.sh      # Статус
./healthcheck.sh # Диагностика
```

---

## 📊 После запуска

### Откройте в браузере:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api

### Проверьте статус:
```bash
./status.sh
```

---

## 🎯 Что дальше?

1. **Запустите систему**: `./start.sh`
2. **Откройте браузер**: http://localhost:3000
3. **Изучите код**: `backend/` и `frontend/`
4. **Читайте документацию**: [QUICK_START.md](./QUICK_START.md)

---

## 💡 Нужна помощь?

### Проблемы при запуске?
```bash
./healthcheck.sh
```

### Логи:
```bash
tail -f logs/backend.log logs/frontend.log
```

### GitHub Issues:
https://github.com/lwr03reg/Dobro/issues

---

## ✨ Особенности

- ✅ Запуск одной командой
- ✅ Автоматическая настройка
- ✅ Проверки готовности
- ✅ Премиум UI/UX дизайн
- ✅ AI генерация контента
- ✅ Telegram Bot интеграция
- ✅ PostgreSQL + Redis
- ✅ Docker поддержка
- ✅ Полная документация

---

## 🎉 Начните прямо сейчас!

```bash
./start.sh
```

**Всё остальное произойдёт автоматически!** 🚀
