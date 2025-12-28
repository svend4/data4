/**
 * Dashboard для клиентов (людей с инвалидностью)
 */

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Grid,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Transaction, Budget } from '@/models/types';
import { formatCurrencyForScreenReader } from '@/utils/accessibility';

interface ClientDashboardProps {
  budget?: Budget;
  recentTransactions: Transaction[];
  upcomingPayments: Array<{
    name: string;
    date: Date;
    amount: number;
  }>;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  budget,
  recentTransactions,
  upcomingPayments,
}) => {
  const { t } = useTranslation();

  // Расчет текущего баланса
  const currentBalance = budget ? budget.totalIncome - budget.totalExpenses : 0;
  const budgetUsagePercent = budget
    ? ((budget.totalExpenses / budget.totalIncome) * 100).toFixed(0)
    : 0;

  return (
    <Box
      component="main"
      id="main-content"
      role="main"
      aria-label={t('dashboard.client.ariaLabel')}
      sx={{ padding: 3 }}
    >
      {/* Приветствие */}
      <Typography variant="h1" component="h1" gutterBottom>
        {t('dashboard.client.welcome')}
      </Typography>

      <Grid container spacing={3}>
        {/* Текущий баланс */}
        <Grid item xs={12} md={6}>
          <Card
            role="region"
            aria-labelledby="current-balance-title"
          >
            <CardContent>
              <Typography
                id="current-balance-title"
                variant="h2"
                component="h2"
                gutterBottom
              >
                {t('dashboard.client.currentBalance')}
              </Typography>

              <Typography
                variant="h3"
                component="p"
                sx={{ fontSize: '2.5rem', fontWeight: 700, color: 'primary.main', my: 2 }}
                aria-label={formatCurrencyForScreenReader(currentBalance)}
              >
                {currentBalance.toFixed(2)} €
              </Typography>

              {budget && (
                <>
                  <Box sx={{ my: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      {t('dashboard.client.budgetUsage', { percent: budgetUsagePercent })}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Number(budgetUsagePercent)}
                      aria-label={t('dashboard.client.budgetUsageAriaLabel', {
                        percent: budgetUsagePercent,
                      })}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {t('dashboard.client.monthlyBudget', {
                      amount: budget.totalIncome.toFixed(2),
                    })}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Предстоящие платежи */}
        <Grid item xs={12} md={6}>
          <Card
            role="region"
            aria-labelledby="upcoming-payments-title"
          >
            <CardContent>
              <Typography
                id="upcoming-payments-title"
                variant="h2"
                component="h2"
                gutterBottom
              >
                {t('dashboard.client.upcomingPayments')}
              </Typography>

              {upcomingPayments.length > 0 ? (
                <List>
                  {upcomingPayments.map((payment, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        borderBottom: index < upcomingPayments.length - 1 ? '1px solid #e0e0e0' : 'none',
                      }}
                    >
                      <ListItemText
                        primary={payment.name}
                        secondary={`${new Date(payment.date).toLocaleDateString('de-DE')} • ${payment.amount.toFixed(2)} €`}
                        primaryTypographyProps={{
                          fontWeight: 600,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">{t('dashboard.client.noUpcomingPayments')}</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Последние транзакции */}
        <Grid item xs={12}>
          <Card
            role="region"
            aria-labelledby="recent-transactions-title"
          >
            <CardContent>
              <Typography
                id="recent-transactions-title"
                variant="h2"
                component="h2"
                gutterBottom
              >
                {t('dashboard.client.recentTransactions')}
              </Typography>

              {recentTransactions.length > 0 ? (
                <List>
                  {recentTransactions.slice(0, 5).map((transaction) => (
                    <ListItem
                      key={transaction.id}
                      sx={{
                        borderBottom: '1px solid #e0e0e0',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {transaction.type === 'income' ? '↓' : '↑'}{' '}
                          {t(`categories.${transaction.category}`)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(transaction.date).toLocaleDateString('de-DE')}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight={700}
                        color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                        aria-label={formatCurrencyForScreenReader(
                          transaction.type === 'income' ? transaction.amount : -transaction.amount
                        )}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {transaction.amount.toFixed(2)} €
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">{t('dashboard.client.noTransactions')}</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
