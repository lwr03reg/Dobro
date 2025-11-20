# 🤖 Создание Telegram Бота для DOBRO

## Шаг 1: Создание бота через BotFather

1. Откройте Telegram и найдите [@BotFather](https://t.me/BotFather)
2. Отправьте команду `/newbot`
3. Введите имя бота: `DOBRO Guide Creator`
4. Введите username бота: `dobro_guide_bot` (или любой доступный)
5. Сохраните полученный **токен** (формат: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Шаг 2: Настройка бота

### Установка описания
```
/setdescription
@your_bot_username
AI-powered платформа для создания благотворительных гайдов. Создавайте профессиональные руководства за минуты!
```

### Установка короткого описания
```
/setabouttext
@your_bot_username
Создавайте благотворительные гайды с помощью AI
```

### Установка команд
```
/setcommands
@your_bot_username

start - 🚀 Начать работу с ботом
new - ✨ Создать новый гайд
list - 📚 Мои гайды
trending - 🔥 Трендовые темы
settings - ⚙️ Настройки
help - ❓ Помощь
```

### Установка изображения профиля
Загрузите логотип (512x512 px) через:
```
/setuserpic
@your_bot_username
```

### Включение inline режима (опционально)
```
/setinline
@your_bot_username
Поиск гайдов...
```

## Шаг 3: Настройка Mini App

### Создание Web App
```
/newapp
@your_bot_username
```

Укажите:
- **Title**: DOBRO Guide Creator
- **Description**: Создавайте профессиональные благотворительные гайды
- **Photo**: Загрузите изображение 640x360 px
- **Demo GIF**: (опционально)
- **URL**: https://3000--019a8dc5-1fb2-75da-b2ec-6a6e78647597.us-east-1-01.gitpod.dev

## Шаг 4: Добавление токена в .env

Скопируйте токен и добавьте в файл `.env`:

```bash
TELEGRAM_BOT_TOKEN=ваш_токен_от_botfather
TELEGRAM_WEBHOOK_URL=https://3001--019a8dc5-1fb2-75da-b2ec-6a6e78647597.us-east-1-01.gitpod.dev/api/webhooks/telegram
```

## Готово! ✅

После выполнения этих шагов:
1. Бот будет создан
2. Mini App будет настроен
3. Токен будет готов к использованию

**Следующий шаг**: Реализация backend сервиса для бота
