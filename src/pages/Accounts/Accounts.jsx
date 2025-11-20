import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Star, Wallet, TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/helpers';
import { ACCOUNT_TYPES, ACCOUNT_ICONS, POPULAR_ACCOUNTS } from '../../constants/accounts';

const Accounts = () => {
  const navigate = useNavigate();
  const { accounts, transactions, addAccount, updateAccount, deleteAccount, setDefaultAccount, getAccountBalance, baseCurrency, displayCurrency } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: ACCOUNT_TYPES.BANK,
    icon: '',
    color: '#3b82f6',
    currency: 'USD',
  });

  // Calculate totals
  const totalBalance = accounts.reduce((sum, acc) => sum + getAccountBalance(acc.id), 0);
  const accountsWithBalances = accounts.map(acc => ({
    ...acc,
    currentBalance: getAccountBalance(acc.id),
    transactionCount: transactions.filter(t => t.accountId === acc.id).length,
  }));

  const handleOpenModal = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        name: account.name,
        type: account.type,
        icon: account.icon,
        color: account.color,
        currency: account.currency,
      });
    } else {
      setEditingAccount(null);
      setFormData({
        name: '',
        type: ACCOUNT_TYPES.BANK,
        icon: ACCOUNT_ICONS[ACCOUNT_TYPES.BANK],
        color: '#3b82f6',
        currency: 'USD',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
    setFormData({
      name: '',
      type: ACCOUNT_TYPES.BANK,
      icon: '',
      color: '#3b82f6',
      currency: 'USD',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingAccount) {
      updateAccount(editingAccount.id, formData);
    } else {
      addAccount(formData);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      try {
        deleteAccount(id);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleSetDefault = (id) => {
    setDefaultAccount(id);
  };

  // Quick add popular account
  const handleQuickAdd = (popularAccount) => {
    setFormData({
      name: popularAccount.name,
      type: popularAccount.type,
      icon: popularAccount.icon,
      color: popularAccount.color,
      currency: 'USD',
    });
    setIsModalOpen(true);
  };

  // Group accounts by type
  const groupedAccounts = accountsWithBalances.reduce((groups, account) => {
    const type = account.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(account);
    return groups;
  }, {});

  const getTypeIcon = (type) => {
    return ACCOUNT_ICONS[type] || '💳';
  };

  const getTypeName = (type) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Accounts</h1>
          <p className="text-gray-400 mt-1">Manage your financial accounts</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => handleOpenModal()}
        >
          Add Account
        </Button>
      </div>

      {/* Total Balance Card */}
      <Card variant="gradient" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-gray-400 text-sm mb-2">Total Balance</p>
          <h2 className="text-5xl font-bold text-white mb-4">{formatCurrency(totalBalance, baseCurrency, displayCurrency)}</h2>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary-400" />
              <span className="text-gray-400">{accounts.length} Accounts</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success-500" />
              <span className="text-gray-400">{transactions.length} Transactions</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Add Popular Accounts */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Add Popular Accounts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {POPULAR_ACCOUNTS.map((acc, index) => (
            <button
              key={index}
              onClick={() => handleQuickAdd(acc)}
              className="p-4 rounded-xl border border-dark-600 hover:border-primary-500 bg-dark-800 hover:bg-dark-700 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{acc.icon}</span>
                <div>
                  <p className="text-white font-medium text-sm">{acc.name}</p>
                  <p className="text-gray-500 text-xs">{getTypeName(acc.type)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Accounts List */}
      {Object.keys(groupedAccounts).length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No accounts yet</p>
            <p className="text-gray-500 text-sm mt-2">Add your first account to start tracking</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => handleOpenModal()}
            >
              Add Your First Account
            </Button>
          </div>
        </Card>
      ) : (
        Object.entries(groupedAccounts).map(([type, typeAccounts]) => (
          <Card key={type}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{getTypeIcon(type)}</span>
              <div>
                <h3 className="text-xl font-semibold text-white">{getTypeName(type)}</h3>
                <p className="text-gray-400 text-sm">{typeAccounts.length} account(s)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typeAccounts.map((account) => (
                <div
                  key={account.id}
                  onClick={() => navigate(`/dashboard/accounts/${account.id}`)}
                  className="p-5 rounded-xl bg-dark-800 border border-dark-600 hover:border-primary-500/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${account.color}20`, border: `2px solid ${account.color}` }}
                      >
                        {account.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-semibold">{account.name}</h4>
                          {account.isDefault && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <p className="text-gray-500 text-xs">{account.currency}</p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(account);
                        }}
                        className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Current Balance</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(account.currentBalance, baseCurrency, displayCurrency)}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-3 border-t border-dark-700">
                      <span className="text-gray-400">{account.transactionCount} transactions</span>
                      {!account.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetDefault(account.id);
                          }}
                          className="text-primary-400 hover:text-primary-300 text-xs font-medium"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>

                  {!account.isDefault && account.transactionCount === 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(account.id);
                      }}
                      className="mt-3 w-full py-2 px-3 bg-danger-500/10 hover:bg-danger-500/20 text-danger-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      Delete Account
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))
      )}

      {/* Add/Edit Account Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAccount ? 'Edit Account' : 'Add New Account'}
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingAccount ? 'Update' : 'Add'} Account
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Account Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Chase Checking, M-Pesa"
            required
          />

          <Select
            label="Account Type"
            name="type"
            value={formData.type}
            onChange={(e) => {
              const newType = e.target.value;
              setFormData({ 
                ...formData, 
                type: newType,
                icon: ACCOUNT_ICONS[newType] || '💳'
              });
            }}
            options={Object.values(ACCOUNT_TYPES).map(type => ({
              value: type,
              label: getTypeName(type),
            }))}
            required
          />

          <Input
            label="Icon (Emoji)"
            type="text"
            name="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="💳"
            required
          />

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-20 h-10 rounded-lg border border-dark-600 bg-dark-700 cursor-pointer"
              />
              <span className="text-gray-400 text-sm">{formData.color}</span>
            </div>
          </div>

          <Select
            label="Currency"
            name="currency"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            options={[
              { value: 'USD', label: 'USD - US Dollar' },
              { value: 'EUR', label: 'EUR - Euro' },
              { value: 'GBP', label: 'GBP - British Pound' },
              { value: 'TZS', label: 'TZS - Tanzanian Shilling' },
              { value: 'KES', label: 'KES - Kenyan Shilling' },
              { value: 'UGX', label: 'UGX - Ugandan Shilling' },
              { value: 'ZAR', label: 'ZAR - South African Rand' },
              { value: 'BTC', label: 'BTC - Bitcoin' },
              { value: 'ETH', label: 'ETH - Ethereum' },
            ]}
            required
          />
        </form>
      </Modal>
    </div>
  );
};

export default Accounts;
