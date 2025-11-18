import React from 'react';
import { PieChart as PieChartIcon, TrendingUp, Wallet, DollarSign } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import AllocationView from '../../components/dashboard/AllocationView';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

const Allocation = () => {
  const navigate = useNavigate();
  const { accounts, getAccountBalance, baseCurrency, displayCurrency } = useFinance();

  // Calculate total balance
  const totalBalance = accounts.reduce((sum, acc) => {
    return sum + getAccountBalance(acc.id);
  }, 0);

  // Calculate active accounts (with balance > 0)
  const activeAccounts = accounts.filter(acc => getAccountBalance(acc.id) > 0);

  // Find largest account
  const accountsWithBalance = accounts.map(acc => ({
    ...acc,
    balance: getAccountBalance(acc.id),
  })).sort((a, b) => b.balance - a.balance);

  const largestAccount = accountsWithBalance[0];
  const largestAccountPercentage = totalBalance > 0 
    ? (largestAccount?.balance / totalBalance) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio Allocation</h1>
          <p className="text-gray-400 mt-1">View how your funds are distributed</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/dashboard/accounts')}
        >
          Manage Accounts
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="gradient" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-primary-400" />
              <p className="text-gray-400 text-sm">Total Value</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(totalBalance, baseCurrency, displayCurrency)}
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-success-500" />
            <p className="text-gray-400 text-sm">Total Accounts</p>
          </div>
          <p className="text-3xl font-bold text-white">{accounts.length}</p>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            <p className="text-gray-400 text-sm">Active Accounts</p>
          </div>
          <p className="text-3xl font-bold text-white">{activeAccounts.length}</p>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <PieChartIcon className="w-5 h-5 text-purple-400" />
            <p className="text-gray-400 text-sm">Largest Account</p>
          </div>
          <p className="text-3xl font-bold text-white">
            {largestAccountPercentage.toFixed(0)}%
          </p>
          {largestAccount && (
            <p className="text-gray-400 text-xs mt-1">{largestAccount.name}</p>
          )}
        </Card>
      </div>

      {/* Main Allocation View */}
      <Card>
        <AllocationView />
      </Card>

      {/* Allocation Table */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Detailed Breakdown</h3>
            <p className="text-gray-400 text-sm mt-1">Complete account allocation table</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">#</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Account</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Type</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Balance</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Allocation</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {accountsWithBalance.map((account, index) => {
                const percentage = totalBalance > 0 
                  ? (account.balance / totalBalance) * 100 
                  : 0;
                const isActive = account.balance > 0;

                return (
                  <tr
                    key={account.id}
                    className="border-b border-dark-700 hover:bg-dark-700 transition-colors cursor-pointer"
                    onClick={() => navigate(`/dashboard/accounts/${account.id}`)}
                  >
                    <td className="py-4 px-4">
                      <span className="text-gray-400 font-medium">{index + 1}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                          style={{
                            backgroundColor: `${account.color}20`,
                            border: `2px solid ${account.color}`,
                          }}
                        >
                          {account.icon}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{account.name}</p>
                          <p className="text-gray-400 text-xs">{account.currency}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300 capitalize">
                        {account.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <p className="text-white font-bold">
                        {formatCurrency(account.balance, baseCurrency, displayCurrency)}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-24 bg-dark-600 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: account.color,
                            }}
                          />
                        </div>
                        <span className="text-white font-semibold min-w-[60px]">
                          {percentage.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {isActive ? (
                        <span className="px-3 py-1 rounded-full bg-success-500/20 text-success-500 text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-500 text-xs font-medium">
                          Empty
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-dark-600">
                <td colSpan="3" className="py-4 px-4">
                  <span className="text-white font-bold">Total</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <p className="text-white font-bold text-lg">
                    {formatCurrency(totalBalance, baseCurrency, displayCurrency)}
                  </p>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-white font-bold">100.00%</span>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Allocation;
