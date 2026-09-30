# Messenger

Мессенджер в реальном времени: регистрация, поиск людей, добавление в друзья, личные чаты, статус «в сети» и счётчик непрочитанных сообщений.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socketdotio&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Redux Saga](https://img.shields.io/badge/Redux--Saga-999999?logo=reduxsaga&logoColor=white)

## Возможности

- Регистрация и вход, JWT access + refresh токены (refresh хранится в httpOnly cookie)
- Поиск пользователей и добавление в друзья
- Личные сообщения в реальном времени через WebSocket
- Статус «в сети» и время последнего визита
- Счётчик непрочитанных сообщений
- Редактирование и удаление сообщений, удаление чата
- Смена имени, пароля и аватарки

## Архитектура

```mermaid
flowchart LR
    subgraph Client["client — Next.js"]
        UI[Страницы и компоненты] --> Store[Redux + Saga]
        UI --> WS[socket.io-client]
    end
    subgraph Server["server — NestJS"]
        REST[REST: auth, users] --> Services
        GW[Chat Gateway :3002] --> Services[Friend / Message services]
        Services --> Prisma
    end
    Store -- HTTP --> REST
    WS -- WebSocket --> GW
    Prisma --> DB[(PostgreSQL)]
```

## Карта проекта

```
messenger/
├── client/                         # Фронтенд на Next.js (App Router)
│   └── src/
│       ├── app/
│       │   ├── page.tsx            # Стартовая страница
│       │   ├── login/              # Вход и регистрация
│       │   └── chat/               # Основной экран мессенджера
│       ├── components/
│       │   ├── NavigationChats/    # Список чатов слева
│       │   ├── ChatSearch/         # Поиск людей
│       │   ├── Group/              # Карточка чата / собеседника
│       │   ├── Login/, Register/   # Формы авторизации
│       │   └── PostTimestamp/      # Форматирование времени сообщения
│       ├── store/                  # Redux: actions, reducers, sagas (запросы к API)
│       ├── socket/socket.ts        # Подключение к WebSocket-серверу
│       └── config.ts               # Адреса API и сокета
│
└── server/                         # Бэкенд на NestJS
    ├── prisma/schema.prisma        # Модели: User, Token, Message, Friend
    ├── docker-compose.yaml         # PostgreSQL + Redis для локальной разработки
    └── src/
        ├── auth/                   # Регистрация, логин, refresh, Passport-стратегии
        ├── token/                  # Выдача и проверка JWT
        ├── users/                  # Профиль, поиск, друзья, загрузка аватарки
        └── chat/
            ├── chat-gateway.ts     # WebSocket-события: сообщения, статусы, чаты
            └── services/           # Логика друзей и сообщений
```

### WebSocket-события

| Событие | Что делает |
|---|---|
| `newMessage` | отправить сообщение |
| `getChats` | получить список чатов |
| `getMessagesUser` | история переписки с пользователем |
| `deleteMessage` | удалить сообщение |
| `addFriend` | добавить в друзья |
| `userStatusUpdate` | онлайн / офлайн |
| `unreadMessagesCount` | количество непрочитанных |

## Запуск

```bash
# 1. База данных
cd server
cp .env.example .env
docker compose up -d

# 2. Сервер (REST на :3001, WebSocket на :3002)
npm install
npx prisma migrate dev
npm run start:dev

# 3. Клиент (http://localhost:3000)
cd ../client
npm install
npm run dev
```
