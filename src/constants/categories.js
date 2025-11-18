export const TRANSACTION_CATEGORIES = {
  INCOME: [
    { id: 'salary', name: 'Salary', icon: '💼', color: '#10b981' },
    { id: 'freelance', name: 'Freelance', icon: '💻', color: '#3b82f6' },
    { id: 'business', name: 'Business', icon: '🏢', color: '#8b5cf6' },
    { id: 'investment', name: 'Investment Returns', icon: '📈', color: '#06b6d4' },
    { id: 'gift', name: 'Gift', icon: '🎁', color: '#ec4899' },
    { id: 'other-income', name: 'Other Income', icon: '💰', color: '#14b8a6' },
  ],
  EXPENSE: [
    { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#ef4444' },
    { id: 'transport', name: 'Transport', icon: '🚗', color: '#f59e0b' },
    { id: 'bills', name: 'Bills & Utilities', icon: '📄', color: '#06b6d4' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
    { id: 'health', name: 'Health & Fitness', icon: '🏥', color: '#10b981' },
    { id: 'education', name: 'Education', icon: '📚', color: '#3b82f6' },
    { id: 'rent', name: 'Rent/Mortgage', icon: '🏠', color: '#f97316' },
    { id: 'subscription', name: 'Subscriptions', icon: '📱', color: '#6366f1' },
    { id: 'business-expense', name: 'Business Expense', icon: '💼', color: '#64748b' },
    { id: 'other-expense', name: 'Other Expense', icon: '💸', color: '#94a3b8' },
  ],
};

export const DEBT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  OVERDUE: 'overdue',
};

export const BUDGET_CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Bills & Utilities',
  'Shopping',
  'Entertainment',
  'Health & Fitness',
  'Education',
  'Rent/Mortgage',
  'Subscriptions',
  'Business Expense',
  'Savings',
  'Other',
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
