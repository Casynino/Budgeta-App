import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTransactions, mockBudgets, mockDebts, mockInvestments, mockRecurringPayments, mockGoals } from '../data/mockData';
import { DEFAULT_ACCOUNTS } from '../constants/accounts';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  // Core State
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [debts, setDebts] = useState({ iOwe: [], owedToMe: [] });
  const [investments, setInvestments] = useState([]);
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [goals, setGoals] = useState([]);
  
  // App State
  const [mode, setMode] = useState('personal'); // 'personal' or 'business'
  const [baseCurrency, setBaseCurrency] = useState('USD'); // Currency for storage (all amounts stored in this)
  const [displayCurrency, setDisplayCurrency] = useState('USD'); // Currency for display
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedAccount, setSelectedAccount] = useState(null); // For filtering by account

  // Initialize with mock data
  useEffect(() => {
    const loadData = () => {
      const savedAccounts = localStorage.getItem('budgeta_accounts');
      const savedTransactions = localStorage.getItem('budgeta_transactions');
      const savedBudgets = localStorage.getItem('budgeta_budgets');
      const savedDebts = localStorage.getItem('budgeta_debts');
      const savedInvestments = localStorage.getItem('budgeta_investments');
      const savedRecurring = localStorage.getItem('budgeta_recurring');
      const savedGoals = localStorage.getItem('budgeta_goals');
      const savedCurrency = localStorage.getItem('budgeta_currency');

      const loadedAccounts = savedAccounts ? JSON.parse(savedAccounts) : DEFAULT_ACCOUNTS;
      setAccounts(loadedAccounts);
      
      // Set default account if exists
      if (loadedAccounts.length > 0 && !selectedAccount) {
        const defaultAcc = loadedAccounts.find(acc => acc.isDefault) || loadedAccounts[0];
        setSelectedAccount(defaultAcc.id);
      }

      // Load currency preference
      if (savedCurrency) {
        const currencyData = JSON.parse(savedCurrency);
        setBaseCurrency(currencyData.base || 'USD');
        setDisplayCurrency(currencyData.display || 'USD');
      }

      // Load transactions and fix orphaned ones (transactions without accountId)
      let loadedTransactions = savedTransactions ? JSON.parse(savedTransactions) : mockTransactions;
      
      // FIX: Assign orphaned transactions to the first/default account
      if (loadedAccounts.length > 0) {
        const defaultAccountId = loadedAccounts.find(acc => acc.isDefault)?.id || loadedAccounts[0].id;
        loadedTransactions = loadedTransactions.map(transaction => {
          if (!transaction.accountId) {
            console.log(`[FinanceContext] Fixed orphaned transaction: ${transaction.id} → assigned to account ${defaultAccountId}`);
            return {
              ...transaction,
              accountId: defaultAccountId
            };
          }
          return transaction;
        });
      }
      
      setTransactions(loadedTransactions);
      setBudgets(savedBudgets ? JSON.parse(savedBudgets) : mockBudgets);
      setDebts(savedDebts ? JSON.parse(savedDebts) : mockDebts);
      setInvestments(savedInvestments ? JSON.parse(savedInvestments) : mockInvestments);
      setRecurringPayments(savedRecurring ? JSON.parse(savedRecurring) : mockRecurringPayments);
      setGoals(savedGoals ? JSON.parse(savedGoals) : mockGoals);
    };

    loadData();
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('budgeta_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('budgeta_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgeta_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('budgeta_debts', JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem('budgeta_investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('budgeta_recurring', JSON.stringify(recurringPayments));
  }, [recurringPayments]);

  useEffect(() => {
    localStorage.setItem('budgeta_goals', JSON.stringify(goals));
  }, [goals]);

  // Save currency preferences
  useEffect(() => {
    localStorage.setItem('budgeta_currency', JSON.stringify({
      base: baseCurrency,
      display: displayCurrency
    }));
  }, [baseCurrency, displayCurrency]);

  // Transaction CRUD
  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: transaction.date || new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, ...updatedTransaction } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Account CRUD
  const addAccount = (account) => {
    const newAccount = {
      ...account,
      id: Date.now().toString(),
      balance: account.balance || 0,
      createdAt: new Date().toISOString(),
    };
    setAccounts([...accounts, newAccount]);
    return newAccount;
  };

  const updateAccount = (id, updatedAccount) => {
    setAccounts(accounts.map(a => a.id === id ? { ...a, ...updatedAccount } : a));
  };

  const deleteAccount = (id) => {
    // Don't allow deleting if it's the only account or has transactions
    const accountTransactions = transactions.filter(t => t.accountId === id);
    if (accounts.length === 1) {
      throw new Error('Cannot delete the only account');
    }
    if (accountTransactions.length > 0) {
      throw new Error('Cannot delete account with existing transactions');
    }
    setAccounts(accounts.filter(a => a.id !== id));
    if (selectedAccount === id) {
      setSelectedAccount(accounts.find(a => a.id !== id)?.id || null);
    }
  };

  const setDefaultAccount = (id) => {
    setAccounts(accounts.map(a => ({ ...a, isDefault: a.id === id })));
  };

  // Calculate account balance from transactions
  const getAccountBalance = (accountId) => {
    const accountTransactions = transactions.filter(t => t.accountId === accountId);
    return accountTransactions.reduce((balance, transaction) => {
      return transaction.type === 'income' 
        ? balance + transaction.amount 
        : balance - transaction.amount;
    }, 0);
  };

  // Budget CRUD
  const addBudget = (budget) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
    };
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (id, updatedBudget) => {
    setBudgets(budgets.map(b => b.id === id ? { ...b, ...updatedBudget } : b));
  };

  const deleteBudget = (id) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  // Debt CRUD
  const addDebt = (debt, type) => {
    const newDebt = {
      ...debt,
      id: Date.now().toString(),
      createdDate: new Date().toISOString(),
      amountPaid: 0,
      status: 'pending',
    };
    
    if (type === 'iOwe') {
      setDebts({ ...debts, iOwe: [...debts.iOwe, newDebt] });
    } else {
      setDebts({ ...debts, owedToMe: [...debts.owedToMe, newDebt] });
    }
  };

  const updateDebt = (id, updatedDebt, type) => {
    if (type === 'iOwe') {
      setDebts({
        ...debts,
        iOwe: debts.iOwe.map(d => d.id === id ? { ...d, ...updatedDebt } : d)
      });
    } else {
      setDebts({
        ...debts,
        owedToMe: debts.owedToMe.map(d => d.id === id ? { ...d, ...updatedDebt } : d)
      });
    }
  };

  const deleteDebt = (id, type) => {
    if (type === 'iOwe') {
      setDebts({ ...debts, iOwe: debts.iOwe.filter(d => d.id !== id) });
    } else {
      setDebts({ ...debts, owedToMe: debts.owedToMe.filter(d => d.id !== id) });
    }
  };

  const makeDebtPayment = (id, amount, type) => {
    const debtList = type === 'iOwe' ? debts.iOwe : debts.owedToMe;
    const debt = debtList.find(d => d.id === id);
    
    if (debt) {
      const newAmountPaid = debt.amountPaid + amount;
      const newStatus = newAmountPaid >= debt.amount ? 'paid' : 'partial';
      
      updateDebt(id, {
        amountPaid: newAmountPaid,
        status: newStatus
      }, type);
    }
  };

  // Investment CRUD
  const addInvestment = (investment) => {
    const newInvestment = {
      ...investment,
      id: Date.now().toString(),
      purchaseDate: investment.purchaseDate || new Date().toISOString(),
    };
    setInvestments([...investments, newInvestment]);
  };

  const updateInvestment = (id, updatedInvestment) => {
    setInvestments(investments.map(i => i.id === id ? { ...i, ...updatedInvestment } : i));
  };

  const deleteInvestment = (id) => {
    setInvestments(investments.filter(i => i.id !== id));
  };

  // Goal CRUD
  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
      currentAmount: 0,
    };
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (id, updatedGoal) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updatedGoal } : g));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const value = {
    // State
    accounts,
    transactions,
    budgets,
    debts,
    investments,
    recurringPayments,
    goals,
    mode,
    baseCurrency,
    displayCurrency,
    selectedMonth,
    selectedYear,
    selectedAccount,
    
    // Setters
    setMode,
    setBaseCurrency,
    setDisplayCurrency,
    setSelectedMonth,
    setSelectedYear,
    setSelectedAccount,
    
    // Account methods
    addAccount,
    updateAccount,
    deleteAccount,
    setDefaultAccount,
    getAccountBalance,
    
    // Transaction methods
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Budget methods
    addBudget,
    updateBudget,
    deleteBudget,
    
    // Debt methods
    addDebt,
    updateDebt,
    deleteDebt,
    makeDebtPayment,
    
    // Investment methods
    addInvestment,
    updateInvestment,
    deleteInvestment,
    
    // Goal methods
    addGoal,
    updateGoal,
    deleteGoal,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
