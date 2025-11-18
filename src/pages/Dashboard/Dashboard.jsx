import React from 'react';
import { TrendingUp, TrendingDown, Wallet, CreditCard, Target, Activity } from 'lucide-react';
import Card from '../../components/common/Card';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import LineChart from '../../components/charts/LineChart';
import { useFinancialSummary } from '../../hooks/useFinancialSummary';
import { formatCurrency, getHealthScoreColor, getHealthScoreLabel } from '../../utils/helpers';
import { TRANSACTION_CATEGORIES } from '../../constants/categories';
import { useFinance } from '../../context/FinanceContext';

const Dashboard = () => {
  const { transactions } = useFinance();
  const summary = useFinancialSummary();

  // Prepare data for charts
  const expenseChartData = Object.entries(summary.expensesByCategory).map(([category, amount]) => {
    const categoryInfo = TRANSACTION_CATEGORIES.EXPENSE.find(c => c.id === category);
    return {
      name: categoryInfo?.name || category,
      value: amount,
      color: categoryInfo?.color || '#94a3b8',
    };
  }).sort((a, b) => b.value - a.value).slice(0, 6);

  const incomeVsExpenseData = [
    { name: 'Income', value: summary.totalIncome, color: '#10b981' },
    { name: 'Expense', value: summary.totalExpense, color: '#ef4444' },
  ];

  // Get last 6 months data
  const getLast6MonthsData = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({
        name: monthName,
        income,
        expense,
      });
    }
    
    return months;
  };

  const trendData = getLast6MonthsData();

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, trendUp }) => (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${trendUp ? 'bg-green-50' : 'bg-primary-50'}`}>
          <Icon className={`w-6 h-6 ${trendUp ? 'text-green-600' : 'text-primary-600'}`} />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Financial Health Score */}
      <Card className="bg-gradient-to-r from-primary-600 to-primary-400 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium mb-1 opacity-90">Financial Health Score</h2>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold">{summary.healthScore}</span>
              <span className="text-2xl opacity-75">/100</span>
            </div>
            <p className="mt-2 opacity-90">
              {getHealthScoreLabel(summary.healthScore)} - {summary.healthScore >= 70 ? 'Keep it up!' : 'Room for improvement'}
            </p>
          </div>
          <div className="hidden md:flex items-center justify-center w-32 h-32 rounded-full bg-white bg-opacity-20">
            <Activity className="w-16 h-16" />
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          title="Total Income"
          value={formatCurrency(summary.totalIncome)}
          subtitle="This month"
          trendUp
        />
        <StatCard
          icon={TrendingDown}
          title="Total Expenses"
          value={formatCurrency(summary.totalExpense)}
          subtitle="This month"
        />
        <StatCard
          icon={Wallet}
          title="Net Savings"
          value={formatCurrency(summary.netSavings)}
          subtitle={`${summary.savingsRate.toFixed(1)}% savings rate`}
          trendUp={summary.netSavings > 0}
        />
        <StatCard
          icon={CreditCard}
          title="Total Debt"
          value={formatCurrency(summary.totalDebtOwed)}
          subtitle="Outstanding amount"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Trend */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expense Trend</h3>
          <LineChart
            data={trendData}
            dataKeys={['income', 'expense']}
            colors={['#10b981', '#ef4444']}
            height={300}
          />
        </Card>

        {/* Expense by Category */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense by Category</h3>
          {expenseChartData.length > 0 ? (
            <PieChart data={expenseChartData} height={300} />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              No expense data available
            </div>
          )}
        </Card>
      </div>

      {/* Budget Overview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Budget Overview</h3>
          <span className="text-sm text-gray-600">
            {formatCurrency(summary.totalBudgetSpent)} / {formatCurrency(summary.totalBudget)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all ${
              summary.budgetUsagePercentage > 100 ? 'bg-red-500' : 
              summary.budgetUsagePercentage > 80 ? 'bg-yellow-500' : 
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(summary.budgetUsagePercentage, 100)}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">
          {summary.budgetUsagePercentage.toFixed(1)}% of monthly budget used
          {summary.budgetUsagePercentage > 100 && (
            <span className="text-red-600 ml-2 font-medium">⚠️ Over budget!</span>
          )}
        </p>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {summary.monthTransactions.slice(0, 5).map(transaction => {
            const category = [...TRANSACTION_CATEGORIES.INCOME, ...TRANSACTION_CATEGORIES.EXPENSE]
              .find(c => c.id === transaction.category);
            
            return (
              <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{category?.icon || '💰'}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{category?.name || transaction.category}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
