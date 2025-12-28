-- Schema базы данных BudgetAssist
-- PostgreSQL 14+

-- Расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum типы
CREATE TYPE user_role AS ENUM ('client', 'social_worker', 'pedagogue', 'volunteer', 'sozialamt');
CREATE TYPE disability_type AS ENUM ('visual', 'hearing', 'motor', 'cognitive', 'mental', 'multiple');
CREATE TYPE support_level AS ENUM ('level_1', 'level_2', 'level_3', 'level_4', 'level_5');
CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TYPE transaction_category AS ENUM (
  'income_sozialamt',
  'income_pension',
  'income_disability_benefit',
  'income_work',
  'income_other',
  'expense_housing',
  'expense_food',
  'expense_transport',
  'expense_health',
  'expense_utilities',
  'expense_insurance',
  'expense_clothing',
  'expense_personal_care',
  'expense_communication',
  'expense_recreation',
  'expense_other'
);
CREATE TYPE budget_period AS ENUM ('monthly', 'quarterly');
CREATE TYPE report_type AS ENUM ('monthly', 'quarterly', 'annual', 'custom');
CREATE TYPE document_type AS ENUM ('receipt', 'invoice', 'contract', 'report', 'other');
CREATE TYPE notification_type AS ENUM ('payment_due', 'budget_warning', 'report_due', 'message', 'info');
CREATE TYPE color_scheme AS ENUM ('light', 'dark', 'high-contrast');

-- Таблица пользователей
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  language_preference VARCHAR(5) DEFAULT 'de',

  -- Настройки доступности (JSONB для гибкости)
  accessibility_preferences JSONB DEFAULT '{
    "highContrast": false,
    "largeText": false,
    "screenReader": false,
    "reducedMotion": false,
    "voiceControl": false,
    "simpleMode": false,
    "colorScheme": "light",
    "fontSize": 100,
    "keyboardOnly": false
  }'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Индексы для users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Таблица клиентов (людей с инвалидностью)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  disability_type disability_type NOT NULL,
  support_level support_level,

  -- Информация о Sozialamt
  sozialamt_id VARCHAR(100),
  case_number VARCHAR(100),

  -- Назначенные социальные работники (массив UUID)
  assigned_workers UUID[] DEFAULT ARRAY[]::UUID[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для clients
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_sozialamt_id ON clients(sozialamt_id);

-- Таблица транзакций
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  category transaction_category NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(3) DEFAULT 'EUR',
  date DATE NOT NULL,
  description TEXT,

  -- Релевантность для Sozialamt
  sozialamt_relevant BOOLEAN DEFAULT false,

  -- Вложения (массив URLs)
  attachments TEXT[] DEFAULT ARRAY[]::TEXT[],

  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для transactions
CREATE INDEX idx_transactions_client_id ON transactions(client_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_sozialamt ON transactions(sozialamt_relevant) WHERE sozialamt_relevant = true;

-- Таблица бюджетов
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  period budget_period NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Категории с лимитами (JSONB)
  categories JSONB DEFAULT '[]'::jsonb,

  total_income DECIMAL(10, 2) DEFAULT 0,
  total_expenses DECIMAL(10, 2) DEFAULT 0,
  social_benefits_amount DECIMAL(10, 2) DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Индексы для budgets
CREATE INDEX idx_budgets_client_id ON budgets(client_id);
CREATE INDEX idx_budgets_dates ON budgets(start_date, end_date);

-- Таблица отчетов
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  generated_by UUID REFERENCES users(id),

  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  type report_type NOT NULL,

  -- Данные отчета (JSONB)
  data JSONB NOT NULL,

  sozialamt_submitted BOOLEAN DEFAULT false,
  submission_date TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для reports
CREATE INDEX idx_reports_client_id ON reports(client_id);
CREATE INDEX idx_reports_dates ON reports(period_start, period_end);
CREATE INDEX idx_reports_sozialamt ON reports(sozialamt_submitted);

-- Таблица документов
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  size INTEGER,
  mime_type VARCHAR(100),

  -- Теги для поиска
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],

  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для documents
CREATE INDEX idx_documents_client_id ON documents(client_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_tags ON documents USING GIN(tags);

-- Таблица уведомлений
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  action_url TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read) WHERE read = false;

-- Таблица аудита (для GDPR compliance)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для audit_log
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX idx_audit_log_action ON audit_log(action);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views для упрощенного доступа

-- View для текущих бюджетов
CREATE VIEW current_budgets AS
SELECT
  b.*,
  c.first_name,
  c.last_name,
  (b.total_income - b.total_expenses) AS balance,
  CASE
    WHEN b.total_income > 0 THEN (b.total_expenses / b.total_income * 100)
    ELSE 0
  END AS usage_percentage
FROM budgets b
JOIN clients c ON b.client_id = c.id
WHERE CURRENT_DATE BETWEEN b.start_date AND b.end_date;

-- View для статистики по клиенту
CREATE VIEW client_statistics AS
SELECT
  c.id AS client_id,
  c.first_name,
  c.last_name,
  COUNT(DISTINCT t.id) AS total_transactions,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) AS total_income,
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) AS total_expenses,
  COUNT(DISTINCT d.id) AS total_documents,
  COUNT(DISTINCT r.id) AS total_reports
FROM clients c
LEFT JOIN transactions t ON c.id = t.client_id
LEFT JOIN documents d ON c.id = d.client_id
LEFT JOIN reports r ON c.id = r.client_id
GROUP BY c.id, c.first_name, c.last_name;

-- Комментарии к таблицам
COMMENT ON TABLE users IS 'Пользователи системы (клиенты, социальные работники, педагоги, волонтеры, представители Sozialamt)';
COMMENT ON TABLE clients IS 'Клиенты системы - люди с инвалидностью';
COMMENT ON TABLE transactions IS 'Финансовые транзакции (доходы и расходы)';
COMMENT ON TABLE budgets IS 'Бюджеты клиентов';
COMMENT ON TABLE reports IS 'Отчеты для Sozialamt и внутреннего использования';
COMMENT ON TABLE documents IS 'Документы (чеки, счета, контракты)';
COMMENT ON TABLE notifications IS 'Уведомления для пользователей';
COMMENT ON TABLE audit_log IS 'Журнал аудита для GDPR compliance';
