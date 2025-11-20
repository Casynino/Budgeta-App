import React, { useState } from 'react';
import { Eye, EyeOff, TrendingUp, TrendingDown, Wallet, CreditCard, Activity, DollarSign, X } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import CategorySelector from '../../components/common/CategorySelector';
import Modal from '../../components/common/Modal';
import AllocationView from '../../components/dashboard/AllocationView';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useFinancialSummary } from '../../hooks/useFinancialSummary';
import { formatCurrency, getHealthScoreColor, getHealthScoreLabel } from '../../utils/helpers';
import { TRANSACTION_CATEGORIES } from '../../constants/categories';
import { useFinance } from '../../context/FinanceContext';

const DashboardNew = () => {
  const { transactions, addTransaction, accounts, selectedAccount, baseCurrency, displayCurrency, getAccountBalance } = useFinance();
  const summary = useFinancialSummary();
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('income'); // income or outcome
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('income'); // 'income' or 'expense'
  
  // Form state
  const [formData, setFormData] = useState({
    accountId: selectedAccount || (accounts.length > 0 ? accounts[0].id : ''),
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Open modal for adding transactions
  const handleOpenModal = (type) => {
    setTransactionType(type);
    setFormData({
      accountId: selectedAccount || (accounts.length > 0 ? accounts[0].id : ''),
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsTransactionModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsTransactionModalOpen(false);
    setFormData({
      accountId: selectedAccount || (accounts.length > 0 ? accounts[0].id : ''),
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit transaction
  const handleSubmitTransaction = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.accountId || !formData.category || !formData.amount || !formData.description) {
      alert('Please fill in all required fields including account');
      return;
    }

    // Create transaction object
    const newTransaction = {
      accountId: formData.accountId,
      type: transactionType,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
      tags: [],
    };

    // Add transaction
    addTransaction(newTransaction);
    
    // Close modal and reset form
    handleCloseModal();
  };

  // Get categories based on transaction type
  const categoryOptions = transactionType === 'income' 
    ? TRANSACTION_CATEGORIES.INCOME 
    : TRANSACTION_CATEGORIES.EXPENSE;

  // Calculate total balance from ALL accounts (all-time, not just this month)
  const totalBalance = accounts.reduce((sum, acc) => sum + getAccountBalance(acc.id), 0);
  
  // Calculate ALL-TIME income and expenses (not just this month)
  const allTimeIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const allTimeExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const allTimeSavings = allTimeIncome - allTimeExpenses;
  const savingsRate = allTimeIncome > 0 ? (allTimeSavings / allTimeIncome) * 100 : 0;
  
  // Monthly balance for comparison (from summary hook)
  const monthlyBalance = summary.totalIncome - summary.totalExpense;

  // Prepare donut chart data
  const expenseChartData = Object.entries(summary.expensesByCategory).map(([category, amount]) => {
    const categoryInfo = TRANSACTION_CATEGORIES.EXPENSE.find(c => c.id === category);
    return {
      name: categoryInfo?.name || category,
      value: amount,
      color: categoryInfo?.color || '#94a3b8',
    };
  }).sort((a, b) => b.value - a.value).slice(0, 5);

  // FIXED: Use ALL-TIME values (same as sidebar cards) for percentage calculation
  // The sidebar shows "Total Income: $7,327" (all-time) and "Total Expenses: $679" (all-time)
  // So the percentage MUST use all-time values too!
  const spendPercentage = allTimeIncome > 0
    ? Math.round((allTimeExpenses / allTimeIncome) * 100)
    : 0;
  
  console.log(`✅✅✅ [Dashboard v8.0 - FIXED] Using ALL-TIME values:`, {
    allTimeIncome: allTimeIncome,
    allTimeExpenses: allTimeExpenses,
    percentage: spendPercentage,
    calculation: `Math.round((${allTimeExpenses} / ${allTimeIncome}) * 100) = ${spendPercentage}%`,
    monthlyIncome: summary.totalIncome,
    monthlyExpense: summary.totalExpense,
    note: 'Now matches sidebar values!'
  });

  return (
    <div className="space-y-6">
      {/* Balance Header Card */}
      <Card variant="gradient" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2">Total Balance</p>
              <div className="flex items-center gap-4">
                <h1 className="text-5xl md:text-6xl font-bold text-white text-balance">
                  {showBalance ? formatCurrency(totalBalance, baseCurrency, displayCurrency) : '••••••••'}
                </h1>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {showBalance ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  monthlyBalance >= 0 ? 'text-neon-green' : 'text-danger-400'
                }`}>
                  {monthlyBalance >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{formatCurrency(Math.abs(monthlyBalance), baseCurrency, displayCurrency)}</span>
                </div>
                <span className="text-gray-500 text-sm">this month</span>
              </div>
            </div>

            {/* Financial Health Score */}
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-2">Health Score</p>
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{summary.healthScore}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{getHealthScoreLabel(summary.healthScore)}</p>
                  <p className="text-gray-400 text-xs">/ 100</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleOpenModal('income')}
              className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Add Income</span>
            </button>
            <button 
              onClick={() => handleOpenModal('expense')}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border border-white/20"
            >
              <TrendingDown className="w-5 h-5" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hover className="group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Income</p>
              <p className="text-2xl font-bold text-neon-green">{formatCurrency(allTimeIncome, baseCurrency, displayCurrency)}</p>
              <p className="text-gray-500 text-xs mt-1">All time</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-neon-green" />
            </div>
          </div>
        </Card>

        <Card hover className="group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-danger-400">{formatCurrency(allTimeExpenses, baseCurrency, displayCurrency)}</p>
              <p className="text-gray-500 text-xs mt-1">All time</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingDown className="w-6 h-6 text-danger-400" />
            </div>
          </div>
        </Card>

        <Card hover className="group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Savings</p>
              <p className="text-2xl font-bold text-primary-400">{formatCurrency(allTimeSavings, baseCurrency, displayCurrency)}</p>
              <p className="text-gray-500 text-xs mt-1">{savingsRate.toFixed(1)}% rate</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Analytics Section */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Analytics</h3>
          
          {/* Segmented Control */}
          <div className="flex items-center gap-2 bg-dark-600 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('income')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === 'income'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setActiveTab('outcome')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === 'outcome'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Outcome
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donut Chart */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{spendPercentage}%</span>
                <span className="text-sm text-gray-400">Total Spend</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 mt-6 w-full">
              {expenseChartData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spend Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Spend Breakdown</h4>
              <button className="text-primary-400 text-sm font-medium hover:text-primary-300">
                See all
              </button>
            </div>

            {expenseChartData.map((item, index) => {
              const percentage = ((item.value / allTimeExpenses) * 100).toFixed(0);
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold">{formatCurrency(item.value, baseCurrency, displayCurrency)}</span>
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
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
      </Card>

      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
          <button className="text-primary-400 text-sm font-medium hover:text-primary-300">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {summary.monthTransactions.slice(0, 5).map((transaction, index) => {
            const category = [...TRANSACTION_CATEGORIES.INCOME, ...TRANSACTION_CATEGORIES.EXPENSE]
              .find(c => c.id === transaction.category);
            
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-xl bg-dark-800 hover:bg-dark-700 transition-colors border border-dark-600"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-dark-600 flex items-center justify-center text-2xl">
                    {category?.icon || '💰'}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{transaction.description}</p>
                    <p className="text-gray-400 text-sm">{category?.name || transaction.category}</p>
                  </div>
                </div>
                <span className={`text-lg font-bold ${
                  transaction.type === 'income' ? 'text-neon-green' : 'text-danger-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, baseCurrency, displayCurrency)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Allocation View */}
      <Card>
        <AllocationView />
      </Card>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isTransactionModalOpen}
        onClose={handleCloseModal}
        title={transactionType === 'income' ? 'Add Income' : 'Add Expense'}
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button 
              variant={transactionType === 'income' ? 'success' : 'danger'} 
              onClick={handleSubmitTransaction}
            >
              Add {transactionType === 'income' ? 'Income' : 'Expense'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmitTransaction} className="space-y-4">
          {/* Account Selection */}
          <Select
            label="Account"
            name="accountId"
            value={formData.accountId}
            onChange={handleInputChange}
            options={accounts.map(acc => ({ 
              value: acc.id, 
              label: `${acc.icon} ${acc.name}` 
            }))}
            required
          />

          {/* Category */}
          <CategorySelector
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            categories={categoryOptions}
            placeholder={`Select ${transactionType} category`}
            required
          />

          {/* Amount */}
          <Input
            label="Amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />

          {/* Description */}
          <Input
            label="Description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder={`Enter ${transactionType} description`}
            required
          />

          {/* Date */}
          <Input
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </form>
      </Modal>
    </div>
  );
};

export default DashboardNew;
