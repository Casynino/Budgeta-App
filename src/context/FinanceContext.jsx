import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTransactions, mockBudgets, mockDebts, mockInvestments, mockRecurringPayments, mockGoals } from '../data/mockData';
import { DEFAULT_ACCOUNTS } from '../constants/accounts';
import { accountsAPI, transactionsAPI, preferencesAPI } from '../services/api';
import { useAuth } from './AuthContext';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

// Helper function to transform backend data to frontend format
const transformTransaction = (txn) => ({
  ...txn,
  accountId: txn.account_id || txn.accountId,
  userId: txn.user_id || txn.userId,
  amount: parseFloat(txn.amount) || 0,
  createdAt: txn.created_at || txn.createdAt,
  updatedAt: txn.updated_at || txn.updatedAt,
  accountName: txn.account_name || txn.accountName,
  accountIcon: txn.account_icon || txn.accountIcon,
  accountColor: txn.account_color || txn.accountColor
});

const transformAccount = (acc) => ({
  ...acc,
  userId: acc.user_id || acc.userId,
  isDefault: acc.is_default ?? acc.isDefault,
  initialBalance: parseFloat(acc.initial_balance ?? acc.initialBalance) || 0,
  createdAt: acc.created_at || acc.createdAt,
  updatedAt: acc.updated_at || acc.updatedAt
});

export const FinanceProvider = ({ children }) => {
  const { currentUser: user } = useAuth();
  
  // Core State
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [debts, setDebts] = useState({ iOwe: [], owedToMe: [] });
  const [investments, setInvestments] = useState([]);
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [goals, setGoals] = useState([]);
  
  // Sync State
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  
  // App State
  const [mode, setMode] = useState('personal'); // 'personal' or 'business'
  
  /**
   * CRITICAL: Currency Storage Logic
   * 
   * - baseCurrency: The currency ALL amounts are stored in (database stores raw numbers)
   * - displayCurrency: The currency for UI display only
   * 
   * Example: User with TZS as baseCurrency enters 600,000
   * - Stored: 600000 (as number, no currency info)
   * - Display: formatCurrency(600000, 'TZS', 'TZS') = TSh600,000
   * 
   * If baseCurrency = USD but user thinks they're entering TZS:
   * - Stored: 600000 (system thinks it's USD)
   * - Display: formatCurrency(600000, 'USD', 'TZS') = TSh1,500,000,000 (WRONG!)
   * 
   * FIX: Always load baseCurrency from backend preferences on login
   */
  const [baseCurrency, setBaseCurrency] = useState('USD'); // Currency for storage (all amounts stored in this)
  const [displayCurrency, setDisplayCurrency] = useState('USD'); // Currency for display
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedAccount, setSelectedAccount] = useState(null); // For filtering by account

  // Initialize data from backend (with localStorage fallback)
  useEffect(() => {
    const loadData = async () => {
      // Don't block UI - load in background
      setIsSyncing(true);
      setSyncError(null);
      
      try {
        if (user) {
          // User logged in - fetch from backend INCLUDING preferences
          const [accountsData, transactionsData, preferencesData] = await Promise.all([
            accountsAPI.getAll().catch(() => []),
            transactionsAPI.getAll().catch(() => []),
            preferencesAPI.get().catch(() => null)
          ]);
          
          // Load currency preferences from backend FIRST
          if (preferencesData) {
            setBaseCurrency(preferencesData.base_currency || 'USD');
            setDisplayCurrency(preferencesData.display_currency || 'USD');
            setMode(preferencesData.mode || 'personal');
            // Save to localStorage as backup
            localStorage.setItem('budgeta_currency', JSON.stringify({
              base: preferencesData.base_currency || 'USD',
              display: preferencesData.display_currency || 'USD'
            }));
          }
          
          // Transform backend data to frontend format (snake_case → camelCase)
          const transformedAccounts = accountsData.map(transformAccount);
          const transformedTransactions = transactionsData.map(transformTransaction);
          
          // If backend has data, use it
          if (transformedAccounts.length > 0 || transformedTransactions.length > 0) {
            const loadedAccounts = transformedAccounts.length > 0 ? transformedAccounts : DEFAULT_ACCOUNTS;
            setAccounts(loadedAccounts);
            setTransactions(transformedTransactions);
            
            // Cache to localStorage
            localStorage.setItem('budgeta_accounts', JSON.stringify(loadedAccounts));
            localStorage.setItem('budgeta_transactions', JSON.stringify(transformedTransactions));
            
            // Set default account
            if (loadedAccounts.length > 0) {
              const defaultAcc = loadedAccounts.find(acc => acc.isDefault) || loadedAccounts[0];
              setSelectedAccount(defaultAcc.id);
            }
            
            setLastSyncTime(new Date().toISOString());
            setIsSyncing(false);
          } else {
            // Backend empty - use defaults immediately (skip migration for speed)
            setAccounts(DEFAULT_ACCOUNTS);
            setTransactions([]);
            
            if (DEFAULT_ACCOUNTS.length > 0) {
              const defaultAcc = DEFAULT_ACCOUNTS.find(acc => acc.isDefault) || DEFAULT_ACCOUNTS[0];
              setSelectedAccount(defaultAcc.id);
            }
            
            setLastSyncTime(new Date().toISOString());
            setIsSyncing(false);
          }
        } else {
          // No user - load from localStorage (offline mode)
          const savedAccounts = localStorage.getItem('budgeta_accounts');
          const savedTransactions = localStorage.getItem('budgeta_transactions');
          
          const loadedAccounts = savedAccounts ? JSON.parse(savedAccounts) : DEFAULT_ACCOUNTS;
          setAccounts(loadedAccounts);
          setTransactions(savedTransactions ? JSON.parse(savedTransactions) : []);
          
          if (loadedAccounts.length > 0) {
            const defaultAcc = loadedAccounts.find(acc => acc.isDefault) || loadedAccounts[0];
            setSelectedAccount(defaultAcc.id);
          }
          
          setIsSyncing(false);
        }
        
        // Load other data from localStorage (not synced to backend yet)
        const savedBudgets = localStorage.getItem('budgeta_budgets');
        const savedDebts = localStorage.getItem('budgeta_debts');
        const savedInvestments = localStorage.getItem('budgeta_investments');
        const savedRecurring = localStorage.getItem('budgeta_recurring');
        const savedGoals = localStorage.getItem('budgeta_goals');
        
        setBudgets(savedBudgets ? JSON.parse(savedBudgets) : mockBudgets);
        setDebts(savedDebts ? JSON.parse(savedDebts) : mockDebts);
        setInvestments(savedInvestments ? JSON.parse(savedInvestments) : mockInvestments);
        setRecurringPayments(savedRecurring ? JSON.parse(savedRecurring) : mockRecurringPayments);
        setGoals(savedGoals ? JSON.parse(savedGoals) : mockGoals);
        
        // Only load from localStorage if user is not logged in
        if (!user) {
          const savedCurrency = localStorage.getItem('budgeta_currency');
          if (savedCurrency) {
            const currencyData = JSON.parse(savedCurrency);
            setBaseCurrency(currencyData.base || 'USD');
            setDisplayCurrency(currencyData.display || 'USD');
          }
        }
        
      } catch (error) {
        console.error('[FinanceContext] ❌ Error loading data:', error);
        setSyncError(error.message);
        
        // Fallback to localStorage on error
        const savedAccounts = localStorage.getItem('budgeta_accounts');
        const savedTransactions = localStorage.getItem('budgeta_transactions');
        setAccounts(savedAccounts ? JSON.parse(savedAccounts) : DEFAULT_ACCOUNTS);
        setTransactions(savedTransactions ? JSON.parse(savedTransactions) : []);
      } finally {
        setIsSyncing(false);
      }
    };

    loadData();
  }, [user]);

  // Save to localStorage whenever data changes (but not during initial load)
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('budgeta_accounts', JSON.stringify(accounts));
    }
  }, [accounts, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('budgeta_transactions', JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

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

  // Save currency preferences to BOTH localStorage AND backend
  useEffect(() => {
    // Save to localStorage immediately
    localStorage.setItem('budgeta_currency', JSON.stringify({
      base: baseCurrency,
      display: displayCurrency
    }));
    
    // Save to backend if user is logged in
    if (user && !isLoading && !isSyncing) {
      preferencesAPI.update({
        baseCurrency: baseCurrency,
        displayCurrency: displayCurrency,
        mode: mode
      }).catch(error => {
        console.error('[FinanceContext] ❌ Error saving preferences:', error);
      });
    }
  }, [baseCurrency, displayCurrency, mode, user, isLoading, isSyncing]);

  // Transaction CRUD (with backend sync)
  const addTransaction = async (transaction) => {
    try {
      setIsSyncing(true);
      
      if (user) {
        // Sync to backend
        const created = await transactionsAPI.create({
          ...transaction,
          date: transaction.date || new Date().toISOString(),
        });
        const transformedTransaction = transformTransaction(created);
        setTransactions([transformedTransaction, ...transactions]);
        setLastSyncTime(new Date().toISOString());
      } else {
        // Offline mode - local only
        const newTransaction = {
          ...transaction,
          id: Date.now().toString(),
          date: transaction.date || new Date().toISOString(),
        };
        setTransactions([newTransaction, ...transactions]);
      }
    } catch (error) {
      console.error('[FinanceContext] ❌ Error adding transaction:', error);
      setSyncError(error.message);
      // Still add locally for offline support
      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
        date: transaction.date || new Date().toISOString(),
      };
      setTransactions([newTransaction, ...transactions]);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateTransaction = async (id, updatedTransaction) => {
    try {
      setIsSyncing(true);
      
      if (user) {
        // Sync to backend
        const updated = await transactionsAPI.update(id, updatedTransaction);
        const transformedTransaction = transformTransaction(updated);
        setTransactions(transactions.map(t => t.id === id ? transformedTransaction : t));
        setLastSyncTime(new Date().toISOString());
      } else {
        // Offline mode - local only
        setTransactions(transactions.map(t => t.id === id ? { ...t, ...updatedTransaction } : t));
      }
    } catch (error) {
      console.error('[FinanceContext] ❌ Error updating transaction:', error);
      setSyncError(error.message);
      // Still update locally
      setTransactions(transactions.map(t => t.id === id ? { ...t, ...updatedTransaction } : t));
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      setIsSyncing(true);
      
      if (user) {
        // Sync to backend
        await transactionsAPI.delete(id);
        setLastSyncTime(new Date().toISOString());
      }
      
      // Update local state
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error('[FinanceContext] ❌ Error deleting transaction:', error);
      setSyncError(error.message);
      // Still delete locally
      setTransactions(transactions.filter(t => t.id !== id));
    } finally {
      setIsSyncing(false);
    }
  };

  // Account CRUD (with backend sync)
  const addAccount = async (account) => {
    try {
      setIsSyncing(true);
      
      if (user) {
        // Sync to backend
        const created = await accountsAPI.create({
          ...account,
          initialBalance: account.balance || account.initialBalance || 0,
          createdAt: new Date().toISOString(),
        });
        const transformedAccount = transformAccount(created);
        setAccounts([...accounts, transformedAccount]);
        setLastSyncTime(new Date().toISOString());
        return transformedAccount;
      } else{
        // Offline mode - local only
        const newAccount = {
          ...account,
          id: Date.now().toString(),
          balance: account.balance || 0,
          createdAt: new Date().toISOString(),
        };
        setAccounts([...accounts, newAccount]);
        return newAccount;
      }
    } catch (error) {
      console.error('[FinanceContext] ❌ Error adding account:', error);
      setSyncError(error.message);
      // Still add locally
      const newAccount = {
        ...account,
        id: Date.now().toString(),
        balance: account.balance || 0,
        createdAt: new Date().toISOString(),
      };
      setAccounts([...accounts, newAccount]);
      return newAccount;
    } finally {
      setIsSyncing(false);
    }
  };

  const updateAccount = async (id, updatedAccount) => {
    try {
      setIsSyncing(true);
      
      if (user) {
        // Sync to backend
        const updated = await accountsAPI.update(id, updatedAccount);
        const transformedAccount = transformAccount(updated);
        setAccounts(accounts.map(a => a.id === id ? transformedAccount : a));
        setLastSyncTime(new Date().toISOString());
      } else {
        // Offline mode - local only
        setAccounts(accounts.map(a => a.id === id ? { ...a, ...updatedAccount } : a));
      }
    } catch (error) {
      console.error('[FinanceContext] ❌ Error updating account:', error);
      setSyncError(error.message);
      // Still update locally
      setAccounts(accounts.map(a => a.id === id ? { ...a, ...updatedAccount } : a));
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteAccount = async (id) => {
    // Don't allow deleting if it's the only account or has transactions
    const accountTransactions = transactions.filter(t => 
      t.accountId === id || t.account_id === id
    );
    if (accounts.length === 1) {
      throw new Error('Cannot delete the only account');
    }
    if (accountTransactions.length > 0) {
      throw new Error('Cannot delete account with existing transactions');
    }
    
    try {
      setIsSyncing(true);
      
      if (user) {
        // Sync to backend
        await accountsAPI.delete(id);
        setLastSyncTime(new Date().toISOString());
      }
      
      // Update local state
      setAccounts(accounts.filter(a => a.id !== id));
      if (selectedAccount === id) {
        setSelectedAccount(accounts.find(a => a.id !== id)?.id || null);
      }
    } catch (error) {
      console.error('[FinanceContext] ❌ Error deleting account:', error);
      setSyncError(error.message);
      // Still delete locally
      setAccounts(accounts.filter(a => a.id !== id));
      if (selectedAccount === id) {
        setSelectedAccount(accounts.find(a => a.id !== id)?.id || null);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const setDefaultAccount = (id) => {
    setAccounts(accounts.map(a => ({ ...a, isDefault: a.id === id })));
  };

  // Calculate account balance from transactions
  const getAccountBalance = (accountId) => {
    // Support both camelCase and snake_case property names
    const accountTransactions = transactions.filter(t => 
      t.accountId === accountId || t.account_id === accountId
    );
    
    return accountTransactions.reduce((balance, transaction) => {
      const amount = parseFloat(transaction.amount) || 0;
      return transaction.type === 'income' 
        ? balance + amount 
        : balance - amount;
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
    
    // Sync state
    isLoading,
    isSyncing,
    syncError,
    lastSyncTime,
    
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
