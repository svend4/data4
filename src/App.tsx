/**
 * Главный компонент приложения BudgetAssist
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SkipLinks } from './components/SkipLinks';
import { ClientDashboard } from './components/Dashboard/ClientDashboard';
import { getTheme } from './config/theme';
import {
  applyAccessibilityPreferences,
  detectKeyboardNavigation,
  getSystemAccessibilityPreferences,
} from './utils/accessibility';
import { AccessibilityPreferences } from './models/types';

// Временные моковые данные
const mockData = {
  budget: {
    id: '1',
    clientId: '1',
    period: 'monthly' as const,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-31'),
    categories: [],
    totalIncome: 1200,
    totalExpenses: 350,
    socialBenefitsAmount: 850,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  recentTransactions: [
    {
      id: '1',
      clientId: '1',
      type: 'income' as const,
      category: 'income_sozialamt' as const,
      amount: 850,
      currency: 'EUR',
      date: new Date('2025-01-12'),
      description: 'Monatliche Sozialleistung',
      sozialamtRelevant: true,
      attachments: [],
      createdBy: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      clientId: '1',
      type: 'expense' as const,
      category: 'expense_food' as const,
      amount: 45,
      currency: 'EUR',
      date: new Date('2025-01-11'),
      description: 'Lebensmittel Einkauf',
      sozialamtRelevant: false,
      attachments: [],
      createdBy: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      clientId: '1',
      type: 'expense' as const,
      category: 'expense_transport' as const,
      amount: 30,
      currency: 'EUR',
      date: new Date('2025-01-10'),
      description: 'Monatskarte ÖPNV',
      sozialamtRelevant: false,
      attachments: [],
      createdBy: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  upcomingPayments: [
    { name: 'Miete', date: new Date('2025-01-15'), amount: 450 },
    { name: 'Strom', date: new Date('2025-01-20'), amount: 80 },
  ],
};

function App() {
  const { i18n } = useTranslation();

  // Настройки доступности (в реальном приложении из Redux/Context)
  const [accessibilityPrefs, setAccessibilityPrefs] = React.useState<AccessibilityPreferences>({
    highContrast: false,
    largeText: false,
    screenReader: false,
    reducedMotion: false,
    voiceControl: false,
    simpleMode: false,
    colorScheme: 'light',
    fontSize: 100,
    keyboardOnly: false,
  });

  // Инициализация accessibility
  useEffect(() => {
    // Определение системных настроек
    const systemPrefs = getSystemAccessibilityPreferences();
    setAccessibilityPrefs((prev) => ({
      ...prev,
      ...systemPrefs,
    }));

    // Активация обнаружения клавиатурной навигации
    detectKeyboardNavigation();

    // Установка языка
    i18n.changeLanguage('de');
  }, [i18n]);

  // Применение настроек доступности
  useEffect(() => {
    applyAccessibilityPreferences(accessibilityPrefs);
  }, [accessibilityPrefs]);

  // Получение темы на основе настроек
  const theme = getTheme(accessibilityPrefs.colorScheme, accessibilityPrefs.fontSize);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            minHeight: '100vh',
            backgroundColor: 'background.default',
            color: 'text.primary',
          }}
        >
          {/* Skip Links для быстрой навигации */}
          <SkipLinks />

          {/* Основные маршруты */}
          <Routes>
            <Route
              path="/"
              element={
                <ClientDashboard
                  budget={mockData.budget}
                  recentTransactions={mockData.recentTransactions}
                  upcomingPayments={mockData.upcomingPayments}
                />
              }
            />
            {/* Другие маршруты будут добавлены позже */}
          </Routes>

          {/* Footer */}
          <Box
            component="footer"
            id="footer"
            role="contentinfo"
            sx={{
              padding: 3,
              textAlign: 'center',
              borderTop: '1px solid',
              borderColor: 'divider',
              marginTop: 'auto',
            }}
          >
            <p>© 2025 BudgetAssist - Barrierefreies Budgetmanagement</p>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
