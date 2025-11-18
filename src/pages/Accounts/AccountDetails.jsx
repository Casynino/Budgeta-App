import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, TrendingUp, TrendingDown, Wallet, Calendar, 
  Activity, DollarSign, ArrowUpRight, ArrowDownRight, BarChart3,
  PieChart as PieChartIcon, Settings
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useFinance } from '../../context/FinanceContext';
import { useAccountAnalytics } from '../../hooks/useAccountAnalytics';
import { formatCurrency, formatDate, getCategoryColor } from '../../utils/helpers';
import { TRANSACTION_CATEGORIES } from '../../constants/categories';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AccountDetails = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const { accounts, baseCurrency, displayCurrency } = useFinance();
  const analytics = useAccountAnalytics(accountId);

  const account = accounts.find(acc => acc.id === accountId);

  if (!account) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Account not found</p>
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard/accounts')}
            className="mt-4"
          >
            Back to Accounts
          </Button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Prepare data for charts
  const categoryChartData = analytics.topCategories.map((cat, index) => ({
    name: cat.category,
    value: cat.amount,
    color: COLORS[index % COLORS.length],
  }));

  const incomeColor = '#10b981';
  const expenseColor = '#ef4444';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/accounts')}
            className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2"
              style={{ 
                backgroundColor: `${account.color}20`, 
                borderColor: account.color 
              }}
            >
              {account.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{account.name}</h1>
              <p className="text-gray-400 mt-1 capitalize">{account.type.replace('_', ' ')} • {account.currency}</p>
            </div>
          </div>
        </div>
        <Button
          variant="secondary"
          icon={<Settings className="w-5 h-5" />}
          onClick={() => navigate(`/dashboard/accounts`)}
        >
          Edit Account
        </Button>
      </div>

      {/* Balance Overview */}
      <Card variant="gradient" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Balance */}
            <div>
              <p className="text-gray-400 text-sm mb-2">Current Balance</p>
              <h2 className="text-4xl font-bold text-white mb-2">
                {formatCurrency(analytics.balance, baseCurrency, displayCurrency)}
              </h2>
              <p className="text-gray-400 text-sm">{analytics.transactionCount} transactions</p>
            </div>

            {/* Total Income */}
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Income</p>
              <h3 className="text-3xl font-bold text-neon-green mb-2">
                {formatCurrency(analytics.totalIncome, baseCurrency, displayCurrency)}
              </h3>
              {analytics.largestIncome && (
                <p className="text-gray-400 text-sm">
                  Largest: {formatCurrency(analytics.largestIncome.amount, baseCurrency, displayCurrency)}
                </p>
              )}
            </div>

            {/* Total Expense */}
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Expenses</p>
              <h3 className="text-3xl font-bold text-danger-400 mb-2">
                {formatCurrency(analytics.totalExpense, baseCurrency, displayCurrency)}
              </h3>
              {analytics.largestExpense && (
                <p className="text-gray-400 text-sm">
                  Largest: {formatCurrency(analytics.largestExpense.amount, baseCurrency, displayCurrency)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Month Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">This Month Income</p>
              <p className="text-2xl font-bold text-neon-green">
                {formatCurrency(analytics.monthIncome, baseCurrency, displayCurrency)}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-7 h-7 text-neon-green" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {analytics.incomeChange > 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-neon-green" />
                <span className="text-neon-green text-sm font-medium">
                  +{analytics.incomeChange.toFixed(1)}%
                </span>
              </>
            ) : analytics.incomeChange < 0 ? (
              <>
                <TrendingDown className="w-4 h-4 text-danger-400" />
                <span className="text-danger-400 text-sm font-medium">
                  {analytics.incomeChange.toFixed(1)}%
                </span>
              </>
            ) : (
              <span className="text-gray-400 text-sm">No change</span>
            )}
            <span className="text-gray-400 text-sm">vs last month</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">This Month Expenses</p>
              <p className="text-2xl font-bold text-danger-400">
                {formatCurrency(analytics.monthExpense, baseCurrency, displayCurrency)}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center">
              <ArrowDownRight className="w-7 h-7 text-danger-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {analytics.expenseChange > 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-danger-400" />
                <span className="text-danger-400 text-sm font-medium">
                  +{analytics.expenseChange.toFixed(1)}%
                </span>
              </>
            ) : analytics.expenseChange < 0 ? (
              <>
                <TrendingDown className="w-4 h-4 text-neon-green" />
                <span className="text-neon-green text-sm font-medium">
                  {analytics.expenseChange.toFixed(1)}%
                </span>
              </>
            ) : (
              <span className="text-gray-400 text-sm">No change</span>
            )}
            <span className="text-gray-400 text-sm">vs last month</span>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">6-Month Trend</h3>
              <p className="text-gray-400 text-sm mt-1">Income vs Expenses</p>
            </div>
            <BarChart3 className="w-5 h-5 text-primary-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.monthlyTrend}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={incomeColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={incomeColor} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={expenseColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={expenseColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke={incomeColor} 
                fillOpacity={1} 
                fill="url(#colorIncome)"
                name="Income"
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stroke={expenseColor} 
                fillOpacity={1} 
                fill="url(#colorExpense)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Top Categories</h3>
              <p className="text-gray-400 text-sm mt-1">Expense distribution</p>
            </div>
            <PieChartIcon className="w-5 h-5 text-primary-400" />
          </div>
          {categoryChartData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {categoryChartData.map((item, index) => {
                  const percentage = ((item.value / analytics.totalExpense) * 100).toFixed(1);
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-white text-sm font-medium capitalize">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-gray-400 text-sm">{percentage}%</span>
                      </div>
                      <div className="w-full bg-dark-600 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No expense data yet
            </div>
          )}
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg/Month</p>
              <p className="text-xl font-bold text-white">
                {analytics.avgTransactionsPerMonth}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-success-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Income Change</p>
              <p className="text-xl font-bold text-white">
                {analytics.incomeChange > 0 ? '+' : ''}{analytics.incomeChange.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-danger-500/20 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-danger-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Expense Change</p>
              <p className="text-xl font-bold text-white">
                {analytics.expenseChange > 0 ? '+' : ''}{analytics.expenseChange.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Txns</p>
              <p className="text-xl font-bold text-white">
                {analytics.transactionCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
            <p className="text-gray-400 text-sm mt-1">Latest activity on this account</p>
          </div>
        </div>

        {analytics.recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {analytics.recentTransactions.map((transaction) => {
              const allCategories = [...TRANSACTION_CATEGORIES.INCOME, ...TRANSACTION_CATEGORIES.EXPENSE];
              const category = allCategories.find(cat => cat.id === transaction.category);

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-dark-700 hover:bg-dark-600 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${category?.color || '#94a3b8'}20` }}
                    >
                      {category?.icon || '💰'}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-400 text-sm">{category?.name || transaction.category}</p>
                        <span className="text-gray-600">•</span>
                        <p className="text-gray-400 text-sm">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-neon-green' : 'text-danger-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount, baseCurrency, displayCurrency)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No transactions yet
          </div>
        )}
      </Card>
    </div>
  );
};

export default AccountDetails;
