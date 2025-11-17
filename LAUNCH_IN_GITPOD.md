# 🚀 ЗАПУСК В GITPOD

> **Текущая ситуация**: В Gitpod среде нет Docker и Node.js по умолчанию

---

## ⚠️ ПРОБЛЕМА

В текущей среде отсутствуют:
- ❌ Docker (для PostgreSQL и Redis)
- ❌ Node.js (для backend)

---

## ✅ РЕШЕНИЕ: 3 варианта

### Вариант 1: Локальный запуск (РЕКОМЕНДУЕТСЯ)

**Скачай проект на свой компьютер и запусти локально:**

```bash
# 1. Клонируй репозиторий
git clone https://github.com/lwr03reg/Dobro.git
cd Dobro

# 2. Настрой .env
cp .env.example .env
nano .env  # Добавь OPENAI_API_KEY=sk-proj-...

# 3. Запусти
./quick-start.sh
```

**Требования:**
- Docker Desktop
- Node.js 20+
- OpenAI API key

**Время:** 5-10 минут

---

### Вариант 2: Настроить Gitpod devcontainer

**Обновить `.devcontainer/devcontainer.json` для установки Node.js и Docker:**

```json
{
  "name": "Ona",
  "build": {
    "context": ".",
    "dockerfile": "Dockerfile"
  },
  "features": {
    "ghcr.io/devcontainers/features/node:1": {
      "version": "20"
    },
    "ghcr.io/devcontainers/features/docker-in-docker:2": {
      "moby": true
    }
  },
  "postCreateCommand": "cd backend && npm install"
}
```

**Затем:**
```bash
# Rebuild devcontainer
gitpod devcontainer rebuild

# После rebuild запусти
./quick-start.sh
```

**Время:** 10-15 минут (rebuild контейнера)

---

### Вариант 3: Deploy на бесплатный хостинг

**Railway.app (бесплатно):**

1. Зарегистрируйся на https://railway.app
2. Подключи GitHub репозиторий
3. Railway автоматически определит Dockerfile
4. Добавь environment variables:
   - `OPENAI_API_KEY`
   - `JWT_SECRET`
5. Deploy!

**Время:** 5 минут

---

## 🎯 ЧТО ДЕЛАТЬ СЕЙЧАС

### Если у тебя есть Docker и Node.js на компьютере:

```bash
# Скачай проект
git clone https://github.com/lwr03reg/Dobro.git
cd Dobro

# Запусти
./quick-start.sh
```

### Если нет Docker/Node.js:

**Вариант A: Установи (5 минут)**
- Docker Desktop: https://docs.docker.com/get-docker/
- Node.js: https://nodejs.org/

**Вариант B: Deploy на Railway (5 минут)**
- https://railway.app

---

## 📋 БЫСТРАЯ ПРОВЕРКА

Проверь, что установлено на твоём компьютере:

```bash
# Проверь Docker
docker --version

# Проверь Node.js
node --version

# Проверь npm
npm --version
```

**Если всё установлено** → запускай `./quick-start.sh`

**Если нет** → выбери вариант выше

---

## 🆘 АЛЬТЕРНАТИВА: Тестирование без запуска

Можешь изучить код и документацию:

```bash
# Посмотри структуру
ls -la backend/src/

# Изучи API routes
cat backend/src/routes/ai.routes.ts

# Посмотри OpenAI интеграцию
cat backend/src/services/openai.service.ts

# Изучи документацию
cat FREE_LAUNCH_GUIDE.md
cat TEST_REPORT.md
```

---

## 💡 РЕКОМЕНДАЦИЯ

**Лучший вариант для быстрого старта:**

1. **Если есть компьютер с Docker** → Локальный запуск (5 минут)
2. **Если нет Docker** → Railway.app deploy (5 минут)
3. **Если хочешь в Gitpod** → Rebuild devcontainer (15 минут)

---

## 📞 НУЖНА ПОМОЩЬ?

**Выбери свою ситуацию:**

### "У меня есть Docker и Node.js"
→ Запускай `./quick-start.sh`

### "У меня нет Docker"
→ Установи Docker Desktop или используй Railway.app

### "Я хочу запустить в Gitpod"
→ Обнови devcontainer.json и сделай rebuild

### "Я хочу просто посмотреть код"
→ Изучай файлы в `backend/src/`

---

## ✅ СЛЕДУЮЩИЙ ШАГ

**Скажи мне:**
1. Есть ли у тебя Docker и Node.js на компьютере?
2. Хочешь запустить локально или на хостинге?
3. Или хочешь настроить Gitpod devcontainer?

Я помогу с выбранным вариантом!

---

*DOBRO SYSTEM ☘ - Выбери удобный способ запуска*
