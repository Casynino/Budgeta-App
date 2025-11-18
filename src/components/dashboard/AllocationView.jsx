import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/helpers';
import { TrendingUp, TrendingDown } from 'lucide-react';

const AllocationView = () => {
  const { accounts, getAccountBalance, baseCurrency, displayCurrency } = useFinance();

  // Calculate total balance across all accounts
  const totalBalance = accounts.reduce((sum, acc) => {
    return sum + getAccountBalance(acc.id);
  }, 0);

  // Prepare allocation data
  const allocationData = accounts.map(account => {
    const balance = getAccountBalance(account.id);
    const percentage = totalBalance > 0 ? (balance / totalBalance) * 100 : 0;
    
    return {
      id: account.id,
      name: account.name,
      icon: account.icon,
      color: account.color,
      balance: balance,
      percentage: percentage,
      currency: account.currency,
    };
  }).filter(item => item.balance !== 0); // Only show accounts with balance

  // Sort by balance (descending)
  allocationData.sort((a, b) => b.balance - a.balance);

  // Prepare chart data
  const chartData = allocationData.map(item => ({
    name: item.name,
    value: item.balance,
    color: item.color,
  }));

  const COLORS = allocationData.map(item => item.color);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Allocation</h2>
          <p className="text-gray-400 text-sm mt-1">Distribution across accounts</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="flex items-center justify-center">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff',
                  }}
                  formatter={(value) => formatCurrency(value, baseCurrency, displayCurrency)}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No funds allocated yet</p>
              <p className="text-sm mt-2">Add income to your accounts to see allocation</p>
            </div>
          )}
        </div>

        {/* Allocation List */}
        <div className="space-y-3">
          {allocationData.length > 0 ? (
            allocationData.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl bg-dark-700 hover:bg-dark-600 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank */}
                  <div className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center">
                    <span className="text-gray-400 font-semibold text-sm">{index + 1}</span>
                  </div>

                  {/* Account Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2"
                    style={{
                      backgroundColor: `${item.color}20`,
                      borderColor: item.color,
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Account Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold truncate">{item.name}</p>
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                    <p className="text-gray-400 text-sm">{item.currency}</p>
                  </div>
                </div>

                {/* Balance & Percentage */}
                <div className="text-right">
                  <p className="text-white font-bold text-lg">
                    {formatCurrency(item.balance, baseCurrency, displayCurrency)}
                  </p>
                  <p className="text-gray-400 text-sm">{item.percentage.toFixed(2)}%</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No accounts with balance</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-dark-700">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">Total Accounts</p>
          <p className="text-white font-bold text-xl">{accounts.length}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">Active Accounts</p>
          <p className="text-white font-bold text-xl">{allocationData.length}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">Total Balance</p>
          <p className="text-white font-bold text-xl">
            {formatCurrency(totalBalance, baseCurrency, displayCurrency)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">Largest Account</p>
          <p className="text-white font-bold text-xl">
            {allocationData.length > 0
              ? `${allocationData[0].percentage.toFixed(0)}%`
              : '0%'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllocationView;
