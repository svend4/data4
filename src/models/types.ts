/**
 * Типы данных для системы BudgetAssist
 */

// Роли пользователей
export enum UserRole {
  CLIENT = 'client',
  SOCIAL_WORKER = 'social_worker',
  PEDAGOGUE = 'pedagogue',
  VOLUNTEER = 'volunteer',
  SOZIALAMT = 'sozialamt',
}

// Типы инвалидности
export enum DisabilityType {
  VISUAL = 'visual',
  HEARING = 'hearing',
  MOTOR = 'motor',
  COGNITIVE = 'cognitive',
  MENTAL = 'mental',
  MULTIPLE = 'multiple',
}

// Уровень поддержки
export enum SupportLevel {
  LEVEL_1 = 'level_1', // Pflegegrad 1
  LEVEL_2 = 'level_2', // Pflegegrad 2
  LEVEL_3 = 'level_3', // Pflegegrad 3
  LEVEL_4 = 'level_4', // Pflegegrad 4
  LEVEL_5 = 'level_5', // Pflegegrad 5
}

// Настройки доступности
export interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  reducedMotion: boolean;
  voiceControl: boolean;
  simpleMode: boolean;
  colorScheme: 'light' | 'dark' | 'high-contrast';
  fontSize: number; // процент от базового размера
  keyboardOnly: boolean;
}

// Пользователь
export interface User {
  id: string;
  email: string;
  role: UserRole;
  accessibilityPreferences: AccessibilityPreferences;
  languagePreference: 'de' | 'ru' | 'en';
  createdAt: Date;
  updatedAt: Date;
}

// Клиент (человек с инвалидностью)
export interface Client {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  disabilityType: DisabilityType;
  supportLevel: SupportLevel;
  sozialamtId?: string;
  caseNumber?: string;
  assignedWorkers: string[]; // IDs социальных работников
  createdAt: Date;
  updatedAt: Date;
}

// Категории транзакций
export enum TransactionCategory {
  // Доходы
  INCOME_SOZIALAMT = 'income_sozialamt',
  INCOME_PENSION = 'income_pension',
  INCOME_DISABILITY_BENEFIT = 'income_disability_benefit',
  INCOME_WORK = 'income_work',
  INCOME_OTHER = 'income_other',

  // Расходы
  EXPENSE_HOUSING = 'expense_housing',
  EXPENSE_FOOD = 'expense_food',
  EXPENSE_TRANSPORT = 'expense_transport',
  EXPENSE_HEALTH = 'expense_health',
  EXPENSE_UTILITIES = 'expense_utilities',
  EXPENSE_INSURANCE = 'expense_insurance',
  EXPENSE_CLOTHING = 'expense_clothing',
  EXPENSE_PERSONAL_CARE = 'expense_personal_care',
  EXPENSE_COMMUNICATION = 'expense_communication',
  EXPENSE_RECREATION = 'expense_recreation',
  EXPENSE_OTHER = 'expense_other',
}

// Транзакция
export interface Transaction {
  id: string;
  clientId: string;
  type: 'income' | 'expense';
  category: TransactionCategory;
  amount: number;
  currency: string; // EUR
  date: Date;
  description: string;
  sozialamtRelevant: boolean; // Нужно ли включать в отчет для Sozialamt
  attachments: string[]; // URLs к файлам (чеки, счета)
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

// Бюджет
export interface Budget {
  id: string;
  clientId: string;
  period: 'monthly' | 'quarterly';
  startDate: Date;
  endDate: Date;
  categories: BudgetCategory[];
  totalIncome: number;
  totalExpenses: number;
  socialBenefitsAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetCategory {
  category: TransactionCategory;
  plannedAmount: number;
  actualAmount: number;
  isFixed: boolean; // Фиксированный расход (аренда, страховка)
}

// Отчет для Sozialamt
export interface Report {
  id: string;
  clientId: string;
  generatedBy: string; // User ID
  period: {
    start: Date;
    end: Date;
  };
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  data: ReportData;
  sozialamtSubmitted: boolean;
  submissionDate?: Date;
  createdAt: Date;
}

export interface ReportData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  incomeBreakdown: Record<string, number>;
  expenseBreakdown: Record<string, number>;
  socialBenefitsReceived: number;
  transactions: Transaction[];
  notes: string;
}

// Документ
export interface Document {
  id: string;
  clientId: string;
  type: 'receipt' | 'invoice' | 'contract' | 'report' | 'other';
  name: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string; // User ID
  uploadedAt: Date;
  tags: string[];
}

// Уведомление
export interface Notification {
  id: string;
  userId: string;
  type: 'payment_due' | 'budget_warning' | 'report_due' | 'message' | 'info';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// API Response типы
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
