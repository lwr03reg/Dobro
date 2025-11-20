# 🐛 Railway "Watch: command not found" - РЕШЕНИЕ

## ❌ Проблема

Railway показывает ошибку:
```
/bin/bash: line 1: Watch: command not found
```

## 🔍 Причина

Railway пытается выполнить команду `Watch` вместо правильной команды запуска. Это происходит из-за:
1. Кэширования старой конфигурации
2. Неправильного парсинга команд
3. Конфликта между разными конфигурационными файлами

## ✅ Решение

### Вариант 1: Использовать railway.json (рекомендуется)

Создан файл `railway.json` с явной конфигурацией:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Вариант 2: Очистить кэш Railway

1. Зайдите в Railway Dashboard
2. Откройте ваш проект
3. Settings → Deployments
4. Нажмите "Clear Build Cache"
5. Trigger новый деплой

### Вариант 3: Пересоздать сервис

1. Удалите текущий frontend сервис в Railway
2. Создайте новый сервис из GitHub
3. Railway автоматически обнаружит новую конфигурацию

### Вариант 4: Использовать Railway CLI

```bash
# Установите Railway CLI
npm i -g @railway/cli

# Войдите
railway login

# Линкуйте проект
railway link

# Деплой с очисткой кэша
railway up --detach
```

## 📋 Проверка конфигурации

### 1. package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "vite preview --host 0.0.0.0 --port ${PORT:-3000}"
  },
  "dependencies": {
    "vite": "^6.2.0"  // ← ВАЖНО: в dependencies, не devDependencies
  }
}
```

### 2. Procfile
```
web: npm start
```

### 3. nixpacks.toml
```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm install --legacy-peer-deps"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

### 4. railway.json (новый)
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

## 🔧 Шаги для исправления

### Шаг 1: Коммит изменений
```bash
git add railway.json nixpacks.toml
git commit -m "🐛 Fix: Add railway.json and update nixpacks config"
git push
```

### Шаг 2: В Railway Dashboard

1. **Перейдите в Settings**
2. **Build & Deploy**
3. **Убедитесь, что:**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Builder: NIXPACKS

### Шаг 3: Очистите кэш

1. Settings → Deployments
2. Clear Build Cache
3. Redeploy

### Шаг 4: Проверьте логи

После деплоя проверьте логи:
```
✅ Должно быть:
   npm start
   > vite preview --host 0.0.0.0 --port $PORT

❌ НЕ должно быть:
   Watch: command not found
```

## 🎯 Альтернативное решение: Dockerfile

Если ничего не помогает, используйте Dockerfile:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Затем в Railway:
1. Settings → Build & Deploy
2. Builder: DOCKERFILE
3. Dockerfile Path: `Dockerfile`

## 📊 Проверка после исправления

### 1. Проверьте деплой
```bash
curl https://your-app.railway.app
```

### 2. Проверьте логи
В Railway Dashboard → Deployments → View Logs

Должны увидеть:
```
✅ npm start
✅ vite preview --host 0.0.0.0 --port 3000
✅ Local: http://localhost:3000/
✅ Network: http://0.0.0.0:3000/
```

### 3. Проверьте health
```bash
curl https://your-app.railway.app/health
```

## 🚨 Если всё ещё не работает

### Проблема: Railway игнорирует конфигурацию

**Решение**: Используйте переменные окружения в Railway:

1. Settings → Variables
2. Добавьте:
   ```
   NIXPACKS_BUILD_CMD=npm run build
   NIXPACKS_START_CMD=npm start
   ```

### Проблема: Vite не найден

**Решение**: Убедитесь, что vite в dependencies:
```bash
npm install --save vite
git add package.json package-lock.json
git commit -m "Move vite to dependencies"
git push
```

### Проблема: Port binding

**Решение**: Убедитесь, что используется переменная $PORT:
```json
{
  "scripts": {
    "start": "vite preview --host 0.0.0.0 --port ${PORT:-3000}"
  }
}
```

## 📝 Чеклист исправления

- [ ] railway.json создан
- [ ] nixpacks.toml обновлён
- [ ] vite в dependencies (не devDependencies)
- [ ] package.json имеет правильный start script
- [ ] Procfile содержит `web: npm start`
- [ ] Изменения закоммичены и запушены
- [ ] Railway кэш очищен
- [ ] Новый деплой запущен
- [ ] Логи проверены
- [ ] Приложение работает

## 🎉 Результат

После применения исправлений Railway должен:
1. ✅ Успешно собрать проект
2. ✅ Запустить с командой `npm start`
3. ✅ Показать "ready in X ms"
4. ✅ Отвечать на HTTP запросы

---

**Статус**: ✅ Исправление применено  
**Файлы**: railway.json, nixpacks.toml  
**Коммит**: Готов к пушу  

**Следующий шаг**: `git push` и проверьте Railway Dashboard
