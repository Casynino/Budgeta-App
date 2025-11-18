export const mockTransactions = [
  // Recent transactions
  { id: '1', type: 'income', category: 'salary', amount: 5000, description: 'Monthly Salary', date: '2024-11-01', tags: ['work'] },
  { id: '2', type: 'income', category: 'freelance', amount: 1200, description: 'Website Project', date: '2024-11-05', tags: ['freelance'] },
  { id: '3', type: 'expense', category: 'rent', amount: 1500, description: 'Apartment Rent', date: '2024-11-01', tags: ['housing'] },
  { id: '4', type: 'expense', category: 'food', amount: 85, description: 'Grocery Shopping', date: '2024-11-02', tags: ['groceries'] },
  { id: '5', type: 'expense', category: 'transport', amount: 50, description: 'Gas Station', date: '2024-11-03', tags: ['car'] },
  { id: '6', type: 'expense', category: 'bills', amount: 120, description: 'Electricity Bill', date: '2024-11-04', tags: ['utilities'] },
  { id: '7', type: 'expense', category: 'entertainment', amount: 45, description: 'Movie Night', date: '2024-11-06', tags: ['leisure'] },
  { id: '8', type: 'expense', category: 'food', amount: 60, description: 'Restaurant', date: '2024-11-07', tags: ['dining'] },
  { id: '9', type: 'expense', category: 'shopping', amount: 200, description: 'Clothing', date: '2024-11-08', tags: ['fashion'] },
  { id: '10', type: 'income', category: 'business', amount: 800, description: 'Consulting Fee', date: '2024-11-10', tags: ['business'] },
  { id: '11', type: 'expense', category: 'health', amount: 150, description: 'Gym Membership', date: '2024-11-11', tags: ['fitness'] },
  { id: '12', type: 'expense', category: 'subscription', amount: 15, description: 'Netflix', date: '2024-11-12', tags: ['streaming'] },
  { id: '13', type: 'expense', category: 'food', amount: 95, description: 'Weekly Groceries', date: '2024-11-14', tags: ['groceries'] },
  { id: '14', type: 'expense', category: 'transport', amount: 30, description: 'Uber Rides', date: '2024-11-15', tags: ['transport'] },
  { id: '15', type: 'income', category: 'gift', amount: 500, description: 'Birthday Gift', date: '2024-11-16', tags: ['gift'] },
];

export const mockBudgets = [
  { id: '1', category: 'Food & Dining', limit: 600, spent: 240, month: 11, year: 2024, color: '#ef4444' },
  { id: '2', category: 'Transport', limit: 200, spent: 80, month: 11, year: 2024, color: '#f59e0b' },
  { id: '3', category: 'Bills & Utilities', limit: 300, spent: 120, month: 11, year: 2024, color: '#06b6d4' },
  { id: '4', category: 'Shopping', limit: 400, spent: 200, month: 11, year: 2024, color: '#ec4899' },
  { id: '5', category: 'Entertainment', limit: 150, spent: 45, month: 11, year: 2024, color: '#8b5cf6' },
  { id: '6', category: 'Health & Fitness', limit: 200, spent: 150, month: 11, year: 2024, color: '#10b981' },
];

export const mockDebts = {
  iOwe: [
    {
      id: '1',
      personName: 'John Doe',
      amount: 5000,
      amountPaid: 2000,
      dueDate: '2024-12-15',
      description: 'Personal Loan',
      status: 'partial',
      createdDate: '2024-01-15',
      category: 'personal',
      notes: 'Monthly payments of $500',
    },
    {
      id: '2',
      personName: 'ABC Bank',
      amount: 15000,
      amountPaid: 0,
      dueDate: '2025-06-01',
      description: 'Car Loan',
      status: 'pending',
      createdDate: '2024-06-01',
      category: 'loan',
      notes: 'Auto loan with 5% interest',
    },
    {
      id: '3',
      personName: 'Sarah Smith',
      amount: 800,
      amountPaid: 800,
      dueDate: '2024-10-30',
      description: 'Borrowed for Emergency',
      status: 'paid',
      createdDate: '2024-09-15',
      category: 'personal',
      notes: 'Paid in full',
    },
  ],
  owedToMe: [
    {
      id: '4',
      personName: 'Mike Johnson',
      amount: 2000,
      amountPaid: 500,
      dueDate: '2024-11-20',
      description: 'Business Investment',
      status: 'partial',
      createdDate: '2024-08-01',
      category: 'business',
      notes: 'Partnership investment to be returned',
    },
    {
      id: '5',
      personName: 'Lisa Brown',
      amount: 1500,
      amountPaid: 0,
      dueDate: '2024-11-10',
      description: 'Personal Loan to Friend',
      status: 'overdue',
      createdDate: '2024-07-10',
      category: 'personal',
      notes: 'Need to follow up',
    },
    {
      id: '6',
      personName: 'XYZ Corp',
      amount: 3000,
      amountPaid: 3000,
      dueDate: '2024-09-30',
      description: 'Freelance Project Payment',
      status: 'paid',
      createdDate: '2024-08-15',
      category: 'business',
      notes: 'Payment received in full',
    },
  ],
};

export const mockInvestments = [
  { id: '1', name: 'Bitcoin', type: 'crypto', amount: 5000, currentValue: 6200, purchaseDate: '2024-01-15', roi: 24 },
  { id: '2', name: 'Apple Stock', type: 'stocks', amount: 3000, currentValue: 3450, purchaseDate: '2024-03-20', roi: 15 },
  { id: '3', name: 'Real Estate Fund', type: 'local', amount: 10000, currentValue: 10800, purchaseDate: '2023-12-01', roi: 8 },
];

export const mockRecurringPayments = [
  { id: '1', name: 'Netflix', amount: 15, frequency: 'monthly', dueDate: '2024-11-12', category: 'subscription', status: 'paid' },
  { id: '2', name: 'Apartment Rent', amount: 1500, frequency: 'monthly', dueDate: '2024-12-01', category: 'rent', status: 'pending' },
  { id: '3', name: 'Gym Membership', amount: 150, frequency: 'monthly', dueDate: '2024-11-11', category: 'health', status: 'paid' },
  { id: '4', name: 'Car Insurance', amount: 200, frequency: 'monthly', dueDate: '2024-11-25', category: 'bills', status: 'pending' },
];

export const mockGoals = [
  { id: '1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 4500, deadline: '2025-06-30', category: 'savings', priority: 'high' },
  { id: '2', name: 'Vacation to Europe', targetAmount: 5000, currentAmount: 1200, deadline: '2025-12-01', category: 'travel', priority: 'medium' },
  { id: '3', name: 'New Laptop', targetAmount: 2000, currentAmount: 800, deadline: '2025-03-15', category: 'shopping', priority: 'low' },
];
