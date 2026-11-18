# BudgetAssist (`data4` / Soz)

Система управления персональным бюджетом для людей с инвалидностью в Германии с поддержкой требований доступности (WCAG 2.1 Level AA) и отчётностью для социальных служб (Sozialamt).

> [!NOTE]
> В ветке `main` в данный момент находятся только файл лицензии `LICENSE` и этот `README.md`. Полный исходный код приложения, серверная часть, Docker-конфигурация и проектная документация размещены в неслитой ветке [`claude/budget-app-accessibility-HisIP`](../../tree/claude/budget-app-accessibility-HisIP).

## Структура проекта (ветка `claude/budget-app-accessibility-HisIP`)

| Путь | Назначение |
|---|---|
| `src/` | Фронтенд на React 18 + TypeScript: `App.tsx`, `main.tsx`, `components/` (`SkipLinks`, `Dashboard/ClientDashboard`), `config/` (темы), `i18n/`, `models/types.ts`, `styles/`, `utils/` (утилиты доступности) |
| `server/` | Бэкенд на Node.js + Express: `index.js` (маршрут `/api/health` и базовые заглушки `/api/users`, `/api/transactions`, `/api/budgets`, `/api/reports`), `database/` (SQL-схема) |
| `docs/` | Документация: `technical/TECHNICAL_SPECIFICATION.md`, `design/`, `user/` |
| `docker-compose.yml` | Оркестрация контейнеров PostgreSQL 14, Redis 6, API (порт `5000`) и Frontend (порт `3000`) |
| `package.json`, `vite.config.ts`, `tsconfig.json`, `.env.example` | Конфигурация сборки Vite, TypeScript и переменных окружения |

> На текущем этапе в `src/App.tsx` настроен основной маршрут `/` с демонстрационными моковыми данными, системным определением настроек доступности и мультиязычностью (`i18next`).

## Стек и команды запуска (ветка `claude/budget-app-accessibility-HisIP`)

- **Frontend:** React 18, TypeScript, Vite 5, Material-UI (`@mui/material`), React Aria (`react-aria`), Redux Toolkit, `react-router-dom`, `i18next`, Recharts, Axios.
- **Backend и БД:** Node.js, Express, PostgreSQL (`pg`), Redis (в `docker-compose.yml`), JWT, `bcrypt`, `helmet`, `joi`, `winston`.
- **Тестирование и качество кода:** Vitest, Testing Library, `@axe-core/react`, `jest-axe`, Playwright, ESLint (`eslint-plugin-jsx-a11y`), Prettier.

```bash
# Установка зависимостей
npm install

# Настройка окружения
cp .env.example .env

# Запуск frontend (Vite) и backend (Express)
npm run dev
npm run server:dev        # или npm run server

# Сборка и предпросмотр
npm run build
npm run preview

# Проверки и тесты
npm test                  # vitest
npm run test:e2e          # playwright test
npm run test:a11y         # jest --config jest.a11y.config.js
npm run lint
npm run format
```

Для поднятия БД и сервисов также присутствует `docker-compose.yml` (`docker-compose up -d`; обратите внимание, что указанные в нём `Dockerfile.server` и `Dockerfile.frontend` в текущей ревизии ветки отсутствуют).

## Ветки репозитория

- `claude/budget-app-accessibility-HisIP` — основная неслитая ветка с кодом **BudgetAssist** (React + TypeScript фронтенд, Express API, `docker-compose.yml`, документация в `docs/`).
- `codex/readme-overview-20261118` ([PR #1](../../pull/1), draft) — краткий обзорный `README.md` для ветки `main`.

## Лицензия

- В ветке `main` размещён файл `LICENSE` (**GNU Affero General Public License v3.0 / AGPL-3.0**).
- В ветке `claude/budget-app-accessibility-HisIP` (`package.json` и её `README.md`) указана лицензия **MIT**.
