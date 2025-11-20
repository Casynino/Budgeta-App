import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { parseISO, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

export const useFinancialSummary = () => {
  const { transactions, budgets, debts, selectedMonth, selectedYear } = useFinance();

  const summary = useMemo(() => {
    // Filter transactions for selected month
    const monthStart = startOfMonth(new Date(selectedYear, selectedMonth));
    const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth));

    const monthTransactions = transactions.filter(t => {
      const transactionDate = parseISO(t.date);
      return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
    });

    // Calculate totals
    const incomeTransactions = monthTransactions.filter(t => t.type === 'income');
    const expenseTransactions = monthTransactions.filter(t => t.type === 'expense');
    
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Debug logging
    console.log('💰 [useFinancialSummary] Expense Calculation:', {
      expenseCount: expenseTransactions.length,
      expenseTransactions: expenseTransactions,
      totalExpense: totalExpense,
      expenseAmounts: expenseTransactions.map(t => ({ category: t.category, amount: t.amount, type: typeof t.amount }))
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // Budget summary
    const totalBudget = budgets
      .filter(b => b.month === selectedMonth && b.year === selectedYear)
      .reduce((sum, b) => sum + b.limit, 0);

    const totalBudgetSpent = budgets
      .filter(b => b.month === selectedMonth && b.year === selectedYear)
      .reduce((sum, b) => sum + b.spent, 0);

    const budgetRemaining = totalBudget - totalBudgetSpent;
    const budgetUsagePercentage = totalBudget > 0 ? (totalBudgetSpent / totalBudget) * 100 : 0;

    // Debt summary
    const totalDebtOwed = debts.iOwe
      .filter(d => d.status !== 'paid')
      .reduce((sum, d) => sum + (d.amount - d.amountPaid), 0);

    const totalDebtToCollect = debts.owedToMe
      .filter(d => d.status !== 'paid')
      .reduce((sum, d) => sum + (d.amount - d.amountPaid), 0);

    // Expense by category
    const expensesByCategory = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    // Income by category
    const incomeByCategory = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    // Calculate Financial Health Score
    const debtRatio = totalIncome > 0 ? (totalDebtOwed / totalIncome) * 100 : 0;
    const budgetAdherence = budgetUsagePercentage <= 100 ? 20 - (budgetUsagePercentage / 5) : 0;
    
    let healthScore = 0;
    
    // Income vs Expense (30 points)
    if (totalIncome > totalExpense) {
      const ratio = (totalIncome - totalExpense) / totalIncome;
      healthScore += Math.min(ratio * 100, 30);
    }
    
    // Savings Rate (25 points)
    healthScore += Math.min(savingsRate, 25);
    
    // Debt Ratio (25 points)
    healthScore += Math.max(0, 25 - (debtRatio / 4));
    
    // Budget Adherence (20 points)
    healthScore += budgetAdherence;

    return {
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,
      totalBudget,
      totalBudgetSpent,
      budgetRemaining,
      budgetUsagePercentage,
      totalDebtOwed,
      totalDebtToCollect,
      expensesByCategory,
      incomeByCategory,
      healthScore: Math.round(healthScore),
      monthTransactions,
    };
  }, [transactions, budgets, debts, selectedMonth, selectedYear]);

  return summary;
};
