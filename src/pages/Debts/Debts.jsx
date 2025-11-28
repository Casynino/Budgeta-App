import { AlertCircle, Calendar, CheckCircle, Clock, DollarSign, Plus, User } from 'lucide-react';
import { useState } from 'react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ProgressBar from '../../components/common/ProgressBar';
import Select from '../../components/common/Select';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate, getDaysUntilDue, isOverdue } from '../../utils/helpers';

const Debts = () => {
  const { debts, addDebt, updateDebt, deleteDebt, makeDebtPayment, baseCurrency, displayCurrency } = useFinance();
  const [activeTab, setActiveTab] = useState('iOwe'); // 'iOwe' or 'owedToMe'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  const [formData, setFormData] = useState({
    personName: '',
    amount: '',
    dueDate: '',
    description: '',
    category: 'personal',
    notes: '',
  });

  const currentDebts = activeTab === 'iOwe' ? debts.iOwe : debts.owedToMe;

  // Calculate totals
  const totalAmount = currentDebts.reduce((sum, d) => sum + d.amount, 0);
  const totalPaid = currentDebts.reduce((sum, d) => sum + d.amountPaid, 0);
  const totalRemaining = currentDebts.reduce((sum, d) => sum + (d.amount - d.amountPaid), 0);
  const overdueCount = currentDebts.filter(d => isOverdue(d.dueDate) && d.status !== 'paid').length;

  const handleOpenModal = (debt = null) => {
    if (debt) {
      setEditingDebt(debt);
      setFormData({
        personName: debt.personName,
        amount: debt.amount,
        dueDate: debt.dueDate.split('T')[0],
        description: debt.description,
        category: debt.category,
        notes: debt.notes,
      });
    } else {
      setEditingDebt(null);
      setFormData({
        personName: '',
        amount: '',
        dueDate: '',
        description: '',
        category: 'personal',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDebt(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const debtData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    if (editingDebt) {
      updateDebt(editingDebt.id, debtData, activeTab);
    } else {
      addDebt(debtData, activeTab);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this debt?')) {
      deleteDebt(id, activeTab);
    }
  };

  const handleOpenPaymentModal = (debt) => {
    setSelectedDebt(debt);
    setPaymentAmount('');
    setIsPaymentModalOpen(true);
  };

  const handleMakePayment = () => {
    if (selectedDebt && paymentAmount) {
      makeDebtPayment(selectedDebt.id, parseFloat(paymentAmount), activeTab);
      setIsPaymentModalOpen(false);
      setSelectedDebt(null);
      setPaymentAmount('');
    }
  };

  const getStatusBadge = (debt) => {
    if (debt.status === 'paid') {
      return <Badge variant="success">Paid</Badge>;
    }
    if (isOverdue(debt.dueDate)) {
      return <Badge variant="danger">Overdue</Badge>;
    }
    if (debt.status === 'partial') {
      return <Badge variant="warning">Partial</Badge>;
    }
    return <Badge variant="info">Pending</Badge>;
  };

  const getDueDateInfo = (dueDate) => {
    const days = getDaysUntilDue(dueDate);
    if (days === null) return null;

    if (days < 0) {
      return { text: `${Math.abs(days)} days overdue`, color: 'text-red-600' };
    }
    if (days === 0) {
      return { text: 'Due today', color: 'text-orange-600' };
    }
    if (days <= 7) {
      return { text: `Due in ${days} days`, color: 'text-yellow-600' };
    }
    return { text: `Due in ${days} days`, color: 'text-gray-600' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Debt Tracker</h1>
          <p className="text-gray-600 mt-1">
            {activeTab === 'iOwe' ? 'Track money you owe' : 'Track money owed to you'}
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
          Add Debt
        </Button>
      </div>

      {/* Tabs */}
      <Card padding="p-0">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('iOwe')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'iOwe'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            I Owe
          </button>
          <button
            onClick={() => setActiveTab('owedToMe')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'owedToMe'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Owed to Me
          </button>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalAmount, baseCurrency, displayCurrency)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(totalPaid, baseCurrency, displayCurrency)}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-xl font-bold text-orange-600">{formatCurrency(totalRemaining, baseCurrency, displayCurrency)}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-xl font-bold text-red-600">{overdueCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Debts List */}
      {currentDebts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No debts recorded</p>
            <p className="text-gray-400 text-sm mt-2">Add your first debt to start tracking</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {currentDebts.map(debt => {
            const percentage = (debt.amountPaid / debt.amount) * 100;
            const dueDateInfo = getDueDateInfo(debt.dueDate);

            return (
              <Card key={debt.id} hover className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{debt.personName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{debt.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(debt)}
                </div>

                {/* Amount Info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(debt.amount, baseCurrency, displayCurrency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Paid</span>
                    <span className="font-semibold text-green-600">{formatCurrency(debt.amountPaid, baseCurrency, displayCurrency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(debt.amount - debt.amountPaid, baseCurrency, displayCurrency)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <ProgressBar
                  value={debt.amountPaid}
                  max={debt.amount}
                  color={percentage === 100 ? 'success' : 'primary'}
                  size="md"
                />

                {/* Due Date */}
                {dueDateInfo && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Due: {formatDate(debt.dueDate)}</span>
                    <span className={`font-medium ${dueDateInfo.color}`}>({dueDateInfo.text})</span>
                  </div>
                )}

                {/* Notes */}
                {debt.notes && (
                  <p className="text-sm text-gray-600 italic border-l-2 border-gray-300 pl-3">
                    {debt.notes}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  {debt.status !== 'paid' && (
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => handleOpenPaymentModal(debt)}
                    >
                      Make Payment
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => handleOpenModal(debt)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => handleDelete(debt.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Debt Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingDebt ? 'Edit Debt' : 'Add New Debt'}
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingDebt ? 'Update' : 'Add'} Debt
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Person/Company Name"
            type="text"
            name="personName"
            value={formData.personName}
            onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
            placeholder="Enter name"
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
            label="Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />

          <Input
            label="Description"
            type="text"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description"
            required
          />

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'personal', label: 'Personal' },
              { value: 'business', label: 'Business' },
              { value: 'loan', label: 'Loan' },
              { value: 'other', label: 'Other' },
            ]}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows="3"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Make Payment"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMakePayment} disabled={!paymentAmount}>
              Record Payment
            </Button>
          </>
        }
      >
        {selectedDebt && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Debt to</p>
              <p className="text-lg font-semibold text-gray-900">{selectedDebt.personName}</p>
              <p className="text-sm text-gray-600 mt-2">
                Remaining: {formatCurrency(selectedDebt.amount - selectedDebt.amountPaid, baseCurrency, displayCurrency)}
              </p>
            </div>

            <Input
              label="Payment Amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              max={selectedDebt.amount - selectedDebt.amountPaid}
              required
            />

            <p className="text-xs text-gray-500">
              Enter the amount you're paying. This will be added to the total paid amount.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Debts;
