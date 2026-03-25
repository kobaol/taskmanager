# Task Manager — Frontend (React + Vite)

Це фронтенд до бекенда FastAPI з JWT.

## Що є в UI

- **Вхід / реєстрація**
- **Проєкти (CRUD)**: список, пошук, створення/редагування/видалення
- **Задачі (CRUD)** у межах проєкту
- **Фільтри**: status, priority, due date (від/до) + пошук по назві/опису
- **Офлайн-режим** через IndexedDB:
  - операції офлайн записуються в локальну чергу (outbox)
  - кнопка **Sync** пушить чергу на сервер і стягує актуальні дані

## Запуск

1) Запусти бекенд (за замовчуванням `http://127.0.0.1:8000`).

2) У фронтенді:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm i
npm run dev
```

> У твоєму zip може бути `node_modules` з Windows — на Linux/Mac він не працює через optional dependencies. Тому краще завжди перевстановлювати.

## Налаштування API URL

Створи `.env` у `frontend/`:

```bash
VITE_API_URL=http://127.0.0.1:8000
```
