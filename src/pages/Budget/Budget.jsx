import { AlertCircle, CheckCircle, Plus, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ProgressBar from '../../components/common/ProgressBar';
import Select from '../../components/common/Select';
import { BUDGET_CATEGORIES } from '../../constants/categories';
import { useFinance } from '../../context/FinanceContext';
import { useFinancialSummary } from '../../hooks/useFinancialSummary';
import { calculatePercentage, formatCurrency } from '../../utils/helpers';

const Budget = () => {
  const { budgets, addBudget, updateBudget, deleteBudget, selectedMonth, selectedYear, baseCurrency, displayCurrency } = useFinance();
  const summary = useFinancialSummary();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    color: '#0ea5e9',
  });

  const currentMonthBudgets = budgets.filter(
    b => b.month === selectedMonth && b.year === selectedYear
  );

  const handleOpenModal = (budget = null) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        category: budget.category,
        limit: budget.limit,
        color: budget.color,
      });
    } else {
      setEditingBudget(null);
      setFormData({
        category: '',
        limit: '',
        color: '#0ea5e9',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const budgetData = {
      ...formData,
      limit: parseFloat(formData.limit),
      month: selectedMonth,
      year: selectedYear,
    };

    if (editingBudget) {
      updateBudget(editingBudget.id, budgetData);
    } else {
      // Calculate spent amount from transactions
      const categoryExpenses = Object.entries(summary.expensesByCategory)
        .find(([cat]) => cat === formData.category.toLowerCase().replace(/\s+/g, '-'));

      budgetData.spent = categoryExpenses ? categoryExpenses[1] : 0;
      addBudget(budgetData);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
    }
  };

  const getBudgetStatus = (spent, limit) => {
    const percentage = calculatePercentage(spent, limit);
    if (percentage >= 100) return { status: 'over', color: 'danger', message: 'Over budget!' };
    if (percentage >= 80) return { status: 'warning', color: 'warning', message: 'Approaching limit' };
    return { status: 'good', color: 'success', message: 'On track' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Planner</h1>
          <p className="text-gray-600 mt-1">Set and track your monthly spending limits</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
          Add Budget
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalBudget, baseCurrency, displayCurrency)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalBudgetSpent, baseCurrency, displayCurrency)}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Remaining</p>
              <p className={`text-2xl font-bold ${summary.budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(summary.budgetRemaining), baseCurrency, displayCurrency)}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${summary.budgetRemaining >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              {summary.budgetRemaining >= 0 ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Overall Budget Usage</h3>
          <span className="text-sm font-medium text-gray-600">
            {summary.budgetUsagePercentage.toFixed(1)}%
          </span>
        </div>
        <ProgressBar
          value={summary.totalBudgetSpent}
          max={summary.totalBudget}
          color={summary.budgetUsagePercentage >= 100 ? 'danger' : summary.budgetUsagePercentage >= 80 ? 'warning' : 'success'}
          size="lg"
        />
        {summary.budgetUsagePercentage >= 100 && (
          <div className="flex items-center gap-2 mt-3 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">You've exceeded your budget by {formatCurrency(Math.abs(summary.budgetRemaining), baseCurrency, displayCurrency)}</span>
          </div>
        )}
      </Card>

      {/* Budget Categories */}
      {currentMonthBudgets.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No budgets set for this month</p>
            <p className="text-gray-400 text-sm mt-2">Create your first budget to start tracking expenses</p>
            <Button onClick={() => handleOpenModal()} className="mt-4" icon={<Plus className="w-4 h-4" />}>
              Add Budget
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentMonthBudgets.map(budget => {
            const percentage = calculatePercentage(budget.spent, budget.limit);
            const status = getBudgetStatus(budget.spent, budget.limit);

            return (
              <Card key={budget.id} hover>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
                      <p className="text-sm text-gray-500 mt-1">{status.message}</p>
                    </div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: budget.color }}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spent</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(budget.spent, baseCurrency, displayCurrency)} / {formatCurrency(budget.limit, baseCurrency, displayCurrency)}
                      </span>
                    </div>
                    <ProgressBar
                      value={budget.spent}
                      max={budget.limit}
                      color={status.color}
                      size="md"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{percentage}% used</span>
                      <span>{formatCurrency(budget.limit - budget.spent, baseCurrency, displayCurrency)} remaining</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      onClick={() => handleOpenModal(budget)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      onClick={() => handleDelete(budget.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBudget ? 'Edit Budget' : 'Add New Budget'}
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingBudget ? 'Update' : 'Add'} Budget
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={BUDGET_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
            required
          />

          <Input
            label="Budget Limit"
            type="number"
            name="limit"
            value={formData.limit}
            onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Category Color</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="h-10 w-full rounded-lg border border-gray-300 cursor-pointer"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Budget;
