import { differenceInDays, format, isBefore, parseISO } from 'date-fns';
import { convertCurrency, formatCurrencyValue } from '../constants/currencies';

export const parseAmountInput = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (value === null || value === undefined) return 0;

  const normalized = String(value)
    .trim()
    .replace(/[\s,]/g, '');

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatCurrency = (amount, fromCurrency = 'TZS', toCurrency = 'TZS') => {
  // Convert if currencies are different
  const convertedAmount = fromCurrency === toCurrency
    ? amount
    : convertCurrency(amount, fromCurrency, toCurrency);

  // Format with proper symbol and decimals
  return formatCurrencyValue(convertedAmount, toCurrency);
};

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return isBefore(due, today);
};

export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const today = new Date();
  const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return differenceInDays(due, today);
};

export const getFinancialHealthScore = (data) => {
  const { totalIncome, totalExpense, savingsRate, debtRatio, budgetAdherence } = data;

  let score = 0;

  // Income vs Expense (30 points)
  if (totalIncome > totalExpense) {
    const ratio = (totalIncome - totalExpense) / totalIncome;
    score += Math.min(ratio * 100, 30);
  }

  // Savings Rate (25 points)
  score += Math.min(savingsRate, 25);

  // Debt Ratio (25 points) - lower is better
  score += Math.max(0, 25 - debtRatio);

  // Budget Adherence (20 points)
  score += Math.min(budgetAdherence, 20);

  return Math.round(score);
};

export const getHealthScoreColor = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

export const getHealthScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Attention';
};

export const groupTransactionsByDate = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const date = formatDate(transaction.date, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});
};

export const calculateMonthlyTrend = (transactions, months = 6) => {
  const monthlyData = {};

  transactions.forEach(transaction => {
    const monthKey = formatDate(transaction.date, 'MMM yyyy');
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    if (transaction.type === 'income') {
      monthlyData[monthKey].income += transaction.amount;
    } else {
      monthlyData[monthKey].expense += transaction.amount;
    }
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data,
    savings: data.income - data.expense,
  }));
};

export const getCategoryColor = (categoryId, categories) => {
  const allCategories = [...categories.INCOME, ...categories.EXPENSE];
  const category = allCategories.find(cat => cat.id === categoryId);
  return category?.color || '#94a3b8';
};
