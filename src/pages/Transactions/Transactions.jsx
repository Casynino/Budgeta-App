import { Edit, Plus, Search, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import CategorySelector from '../../components/common/CategorySelector';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import { TRANSACTION_CATEGORIES } from '../../constants/categories';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

const Transactions = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, accounts, selectedAccount, baseCurrency, displayCurrency } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [filterCategory, setFilterCategory] = useState('all');

  const [formData, setFormData] = useState({
    accountId: selectedAccount || (accounts.length > 0 ? accounts[0].id : ''),
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
  });

  const handleOpenModal = (transaction = null) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        accountId: transaction.accountId || (selectedAccount || (accounts.length > 0 ? accounts[0].id : '')),
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date.split('T')[0],
        tags: transaction.tags || [],
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        accountId: selectedAccount || (accounts.length > 0 ? accounts[0].id : ''),
        type: 'expense',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        tags: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const categoryOptions = formData.type === 'income'
    ? TRANSACTION_CATEGORIES.INCOME
    : TRANSACTION_CATEGORIES.EXPENSE;

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Group by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = formatDate(transaction.date, 'MMM dd, yyyy');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Manage your income and expenses</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome, baseCurrency, displayCurrency)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expense</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense, baseCurrency, displayCurrency)}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalIncome - totalExpense, baseCurrency, displayCurrency)}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${totalIncome - totalExpense >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <TrendingUp className={`w-6 h-6 ${totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'income', label: 'Income Only' },
              { value: 'expense', label: 'Expense Only' },
            ]}
          />
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              ...TRANSACTION_CATEGORIES.INCOME.map(cat => ({ value: cat.id, label: cat.name })),
              ...TRANSACTION_CATEGORIES.EXPENSE.map(cat => ({ value: cat.id, label: cat.name })),
            ]}
          />
        </div>
      </Card>

      {/* Transactions List */}
      <div className="space-y-4">
        {Object.keys(groupedTransactions).length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No transactions found</p>
              <p className="text-gray-400 text-sm mt-2">Add your first transaction to get started</p>
            </div>
          </Card>
        ) : (
          Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
            <Card key={date}>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">{date}</h3>
              <div className="space-y-2">
                {dayTransactions.map(transaction => {
                  const category = [...TRANSACTION_CATEGORIES.INCOME, ...TRANSACTION_CATEGORIES.EXPENSE]
                    .find(c => c.id === transaction.category);

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-2xl">{category?.icon || '💰'}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={transaction.type === 'income' ? 'success' : 'danger'} size="sm">
                              {transaction.type}
                            </Badge>
                            <span className="text-xs text-gray-500">{category?.name || transaction.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-base font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, baseCurrency, displayCurrency)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenModal(transaction)}
                            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingTransaction ? 'Update' : 'Add'} Transaction
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Account"
            name="accountId"
            value={formData.accountId}
            onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
            options={accounts.map(acc => ({
              value: acc.id,
              label: `${acc.icon} ${acc.name}`,
            }))}
            required
          />

          <Select
            label="Type"
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
            options={[
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' },
            ]}
            required
          />

          <CategorySelector
            label="Category"
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            categories={categoryOptions}
            placeholder={`Select ${formData.type} category`}
            required
          />

          <Input
            label="Amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />

          <Input
            label="Description"
            type="text"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter description"
            required
          />

          <Input
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;
