import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { convertCurrency } from '../constants/currencies';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export const useAccountAnalytics = (accountId) => {
  const { transactions, baseCurrency, displayCurrency } = useFinance();

  const analytics = useMemo(() => {
    if (!accountId) return null;

    // Filter transactions for this account
    const accountTransactions = transactions.filter(t => t.accountId === accountId);

    // Calculate totals
    const totalIncome = accountTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = accountTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Current month
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthTransactions = accountTransactions.filter(t => {
      const date = typeof t.date === 'string' ? parseISO(t.date) : t.date;
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    });

    const monthIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Previous month
    const prevMonthStart = startOfMonth(subMonths(now, 1));
    const prevMonthEnd = endOfMonth(subMonths(now, 1));

    const prevMonthTransactions = accountTransactions.filter(t => {
      const date = typeof t.date === 'string' ? parseISO(t.date) : t.date;
      return isWithinInterval(date, { start: prevMonthStart, end: prevMonthEnd });
    });

    const prevMonthIncome = prevMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const prevMonthExpense = prevMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate changes
    const incomeChange = prevMonthIncome > 0 
      ? ((monthIncome - prevMonthIncome) / prevMonthIncome) * 100 
      : 0;

    const expenseChange = prevMonthExpense > 0 
      ? ((monthExpense - prevMonthExpense) / prevMonthExpense) * 100 
      : 0;

    // Last 6 months trend
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);

      const monthTxns = accountTransactions.filter(t => {
        const date = typeof t.date === 'string' ? parseISO(t.date) : t.date;
        return isWithinInterval(date, { start, end });
      });

      const income = monthTxns
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTxns
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyTrend.push({
        month: format(monthDate, 'MMM'),
        income,
        expense,
        net: income - expense,
      });
    }

    // Category breakdown
    const categoryBreakdown = {};
    accountTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!categoryBreakdown[t.category]) {
          categoryBreakdown[t.category] = 0;
        }
        categoryBreakdown[t.category] += t.amount;
      });

    const topCategories = Object.entries(categoryBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));

    // Transaction frequency
    const avgTransactionsPerMonth = accountTransactions.length > 0
      ? accountTransactions.length / Math.max(1, monthlyTrend.length)
      : 0;

    // Largest transactions
    const largestIncome = accountTransactions
      .filter(t => t.type === 'income')
      .sort((a, b) => b.amount - a.amount)[0];

    const largestExpense = accountTransactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)[0];

    return {
      totalIncome,
      totalExpense,
      balance,
      monthIncome,
      monthExpense,
      prevMonthIncome,
      prevMonthExpense,
      incomeChange,
      expenseChange,
      monthlyTrend,
      topCategories,
      transactionCount: accountTransactions.length,
      avgTransactionsPerMonth: Math.round(avgTransactionsPerMonth * 10) / 10,
      largestIncome,
      largestExpense,
      recentTransactions: accountTransactions.slice(0, 10),
    };
  }, [accountId, transactions]);

  return analytics;
};
