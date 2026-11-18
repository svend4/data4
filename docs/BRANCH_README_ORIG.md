# BudgetAssist

> Barrierefreies Budgetmanagement für Menschen mit Behinderung in Deutschland

Система управления персональным бюджетом для людей с инвалидностью в Германии с интеграцией социальных служб.

## Особенности

### Доступность (WCAG 2.1 Level AA)
- ✅ Полная поддержка screen readers (NVDA, JAWS)
- ✅ Клавиатурная навигация
- ✅ Высокая контрастность (настраиваемая)
- ✅ Масштабирование текста до 200%
- ✅ Голосовой ввод/вывод
- ✅ Упрощенный режим
- ✅ Светлая/темная тема

### Функциональность
- 📊 Учет доходов и расходов
- 💰 Планирование бюджета
- 📄 Генерация отчетов для Sozialamt
- 👥 Многопользовательский доступ (клиенты, социальные работники, педагоги)
- 🔐 GDPR compliance
- 🌍 Многоязычность (Deutsch, Русский, English)
- 📱 Responsive дизайн

## Структура проекта

```
budgetassist/
├── docs/                    # Документация
│   ├── technical/          # Техническая документация
│   ├── design/             # Дизайн-документы
│   └── user/               # Пользовательская документация
├── src/                    # Frontend (React + TypeScript)
│   ├── components/         # React компоненты
│   ├── services/           # API сервисы
│   ├── models/             # TypeScript типы
│   ├── utils/              # Утилиты (включая accessibility)
│   ├── config/             # Конфигурация (темы)
│   └── i18n/               # Переводы
├── server/                 # Backend (Node.js + Express)
│   ├── database/           # SQL схемы
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   └── middleware/         # Express middleware
├── tests/                  # Тесты
├── public/                 # Статические файлы
└── scripts/                # Скрипты для развертывания

```

## Технологический стек

**Frontend:**
- React 18 с TypeScript
- Material-UI с accessibility
- React Aria
- Redux Toolkit
- i18next

**Backend:**
- Node.js + Express
- PostgreSQL
- Redis

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)

## Быстрый старт

### Требования
- Node.js 18+
- Docker и Docker Compose
- PostgreSQL 14+ (или через Docker)

### Установка

1. Клонирование репозитория:
```bash
git clone <repository-url>
cd budgetassist
```

2. Установка зависимостей:
```bash
npm install
```

3. Настройка окружения:
```bash
cp .env.example .env
# Отредактируйте .env с вашими настройками
```

4. Запуск с Docker:
```bash
docker-compose up -d
```

5. Запуск базы данных:
```bash
docker-compose up postgres redis -d
```

6. Инициализация БД:
```bash
npm run db:init
```

7. Запуск приложения:
```bash
# Frontend (dev server)
npm run dev

# Backend
npm run server:dev
```

Приложение будет доступно по адресу: http://localhost:3000

## Разработка

### Команды

```bash
# Разработка
npm run dev                 # Запуск frontend dev server
npm run server:dev          # Запуск backend с nodemon

# Сборка
npm run build               # Сборка production версии

# Тестирование
npm test                    # Unit тесты
npm run test:e2e            # E2E тесты
npm run test:a11y           # Accessibility тесты

# Линтинг
npm run lint                # ESLint проверка
npm run format              # Prettier форматирование

# Docker
docker-compose up           # Запуск всех сервисов
docker-compose down         # Остановка всех сервисов
```

### Accessibility Testing

Проект использует несколько инструментов для проверки доступности:

```bash
# Автоматические тесты доступности
npm run test:a11y

# Ручное тестирование с axe DevTools
# (установите расширение для Chrome/Firefox)
```

## Документация

- [Техническая спецификация](docs/technical/TECHNICAL_SPECIFICATION.md)
- [Дизайн-документ](docs/design/DESIGN_DOCUMENT.md)
- [Руководство пользователя](docs/user/USER_GUIDE_DE.md) (на немецком)
- [API Documentation](docs/technical/API.md)

## Роли пользователей

### Клиент (Client)
Человек с инвалидностью, основной пользователь системы.

**Возможности:**
- Просмотр баланса и транзакций
- Добавление доходов/расходов
- Просмотр бюджета
- Загрузка документов

### Социальный работник (Social Worker)
Помощь в управлении бюджетом клиента.

**Возможности:**
- Все возможности клиента
- Управление несколькими клиентами
- Создание отчетов для Sozialamt
- Доступ к финансовой истории

### Социальный педагог (Social Pedagogue)
Образовательная поддержка в финансовой грамотности.

**Возможности:**
- Просмотр данных клиентов
- Обучающие материалы
- Статистика и аналитика

### Представитель Sozialamt
Просмотр отчетов (только чтение).

**Возможности:**
- Просмотр отчетов
- Экспорт данных
- Верификация выплат

## Безопасность и GDPR

Приложение полностью соответствует требованиям GDPR:

- ✅ Шифрование персональных данных
- ✅ Право на удаление данных (Article 17)
- ✅ Право на портируемость данных (Article 20)
- ✅ Audit logging
- ✅ Согласие на обработку данных
- ✅ Data retention policies

## Вклад в проект

Мы приветствуем вклад в развитие проекта!

1. Fork проекта
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

### Важно для контрибьюторов:
- Следуйте WCAG 2.1 Level AA guidelines
- Добавляйте accessibility тесты
- Документируйте изменения

## Лицензия

MIT License - see [LICENSE](LICENSE) file for details

## Поддержка

Для вопросов и поддержки:
- 📧 Email: support@budgetassist.example
- 📖 Documentation: [docs/](docs/)
- 🐛 Bug Reports: GitHub Issues

## Благодарности

Проект разработан с учетом потребностей людей с инвалидностью и при поддержке социальных организаций Германии.

---

**Version:** 1.0.0
**Last Updated:** 2025-12-28
