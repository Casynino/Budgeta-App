import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTransactions, mockBudgets, mockDebts, mockInvestments, mockRecurringPayments, mockGoals } from '../data/mockData';
import { DEFAULT_ACCOUNTS } from '../constants/accounts';
import { accountsAPI, transactionsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Core State
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [debts, setDebts] = useState({ iOwe: [], owedToMe: [] });
  const [investments, setInvestments] = useState([]);
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [goals, setGoals] = useState([]);
  
  // Sync State
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  
  // App State
  const [mode, setMode] = useState('personal'); // 'personal' or 'business'
  const [baseCurrency, setBaseCurrency] = useState('USD'); // Currency for storage (all amounts stored in this)
  const [displayCurrency, setDisplayCurrency] = useState('USD'); // Currency for display
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedAccount, setSelectedAccount] = useState(null); // For filtering by account

  // Initialize data from backend (with localStorage fallback)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setSyncError(null);
      
      try {
        if (user) {
          // User logged in - fetch from backend
          console.log('[FinanceContext] 🔄 Fetching data from backend...');
          
          const [accountsData, transactionsData] = await Promise.all([
            accountsAPI.getAll().catch(() => []),
            transactionsAPI.getAll().catch(() => [])
          ]);
          
          console.log('[FinanceContext] ✅ Backend data loaded:', {
            accounts: accountsData.length,
            transactions: transactionsData.length
          });
          
          // If backend has data, use it
          if (accountsData.length > 0 || transactionsData.length > 0) {
            const loadedAccounts = accountsData.length > 0 ? accountsData : DEFAULT_ACCOUNTS;
            setAccounts(loadedAccounts);
            setTransactions(transactionsData);
            
            // Cache to localStorage
            localStorage.setItem('budgeta_accounts', JSON.stringify(loadedAccounts));
            localStorage.setItem('budgeta_transactions', JSON.stringify(transactionsData));
            
            // Set default account
            if (loadedAccounts.length > 0) {
              const defaultAcc = loadedAccounts.find(acc => acc.isDefault) || loadedAccounts[0];
              setSelectedAccount(defaultAcc.id);
            }
            
            setLastSyncTime(new Date().toISOString());
          } else {
            // Backend empty - check if localStorage has data to migrate
            console.log('[FinanceContext] 📦 Backend empty, checking localStorage for migration...');
            const savedAccounts = localStorage.getItem('budgeta_accounts');
            const savedTransactions = localStorage.getItem('budgeta_transactions');
            
            if (savedAccounts || savedTransactions) {
              // Migrate localStorage data to backend
              console.log('[FinanceContext] 🔼 Migrating localStorage data to backend...');
              const localAccounts = savedAccounts ? JSON.parse(savedAccounts) : DEFAULT_ACCOUNTS;
              const localTransactions = savedTransactions ? JSON.parse(savedTransactions) : [];
              
              // Upload to backend
              const migratedAccounts = [];
              for (const account of localAccounts) {
                try {
                  const created = await accountsAPI.create(account);
                  migratedAccounts.push(created);
                } catch (err) {
                  console.error('[FinanceContext] Failed to migrate account:', err);
                  migratedAccounts.push(account); // Keep local version
                }
              }
              
              const migratedTransactions = [];
              for (const transaction of localTransactions) {
                try {
                  const created = await transactionsAPI.create(transaction);
                  migratedTransactions.push(created);
                } catch (err) {
                  console.error('[FinanceContext] Failed to migrate transaction:', err);
                  migratedTransactions.push(transaction); // Keep local version
                }
              }
              
              setAccounts(migratedAccounts);
              setTransactions(migratedTransactions);
              
              if (migratedAccounts.length > 0) {
                const defaultAcc = migratedAccounts.find(acc => acc.isDefault) || migratedAccounts[0];
                setSelectedAccount(defaultAcc.id);
              }
              
              console.log('[FinanceContext] ✅ Migration complete');
              setLastSyncTime(new Date().toISOString());
            } else {
              // No data anywhere - use defaults
              console.log('[FinanceContext] 🆕 No data found, using defaults');
              setAccounts(DEFAULT_ACCOUNTS);
              setTransactions([]);
              
              if (DEFAULT_ACCOUNTS.length > 0) {
                const defaultAcc = DEFAULT_ACCOUNTS.find(acc => acc.isDefault) || DEFAULT_ACCOUNTS[0];
                setSelectedAccount(defaultAcc.id);
              }
            }
          }
        } else {
          // No user - load from localStorage (offline mode)
          console.log('[FinanceContext] 💾 No user, loading from localStorage...');
          const savedAccounts = localStorage.getItem('budgeta_accounts');
          const savedTransactions = localStorage.getItem('budgeta_transactions');
          
          const loadedAccounts = savedAccounts ? JSON.parse(savedAccounts) : DEFAULT_ACCOUNTS;
          setAccounts(loadedAccounts);
          setTransactions(savedTransactions ? JSON.parse(savedTransactions) : []);
          
          if (loadedAccounts.length > 0) {
            const defaultAcc = loadedAccounts.find(acc => acc.isDefault) || loadedAccounts[0];
            setSelectedAccount(defaultAcc.id);
          }
        }
        
        // Load other data from localStorage (not synced to backend yet)
        const savedBudgets = localStorage.getItem('budgeta_budgets');
        const savedDebts = localStorage.getItem('budgeta_debts');
        const savedInvestments = localStorage.getItem('budgeta_investments');
        const savedRecurring = localStorage.getItem('budgeta_recurring');
        const savedGoals = localStorage.getItem('budgeta_goals');
        const savedCurrency = localStorage.getItem('budgeta_currency');
        
        setBudgets(savedBudgets ? JSON.parse(savedBudgets) : mockBudgets);
        setDebts(savedDebts ? JSON.parse(savedDebts) : mockDebts);
        setInvestments(savedInvestments ? JSON.parse(savedInvestments) : mockInvestments);
        setRecurringPayments(savedRecurring ? JSON.parse(savedRecurring) : mockRecurringPayments);
        setGoals(savedGoals ? JSON.parse(savedGoals) : mockGoals);
        
        if (savedCurrency) {
          const currencyData = JSON.parse(savedCurrency);
          setBaseCurrency(currencyData.base || 'USD');
          setDisplayCurrency(currencyData.display || 'USD');
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
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

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

  // Transaction CRUD (with backend sync)
  const addTransaction = async (transaction) => {
    try {
      setIsSyncing(true);
      
      if (user) {
        // Sync to backend
        console.log('[FinanceContext] 🔄 Creating transaction on backend...');
        const created = await transactionsAPI.create({
          ...transaction,
          date: transaction.date || new Date().toISOString(),
        });
        console.log('[FinanceContext] ✅ Transaction created:', created.id);
        setTransactions([created, ...transactions]);
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
        console.log('[FinanceContext] 🔄 Updating transaction on backend...');
        const updated = await transactionsAPI.update(id, updatedTransaction);
        console.log('[FinanceContext] ✅ Transaction updated:', id);
        setTransactions(transactions.map(t => t.id === id ? { ...t, ...updated } : t));
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
        console.log('[FinanceContext] 🔄 Deleting transaction from backend...');
        await transactionsAPI.delete(id);
        console.log('[FinanceContext] ✅ Transaction deleted:', id);
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
        console.log('[FinanceContext] 🔄 Creating account on backend...');
        const created = await accountsAPI.create({
          ...account,
          balance: account.balance || 0,
          createdAt: new Date().toISOString(),
        });
        console.log('[FinanceContext] ✅ Account created:', created.id);
        setAccounts([...accounts, created]);
        setLastSyncTime(new Date().toISOString());
        return created;
      } else {
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
        console.log('[FinanceContext] 🔄 Updating account on backend...');
        const updated = await accountsAPI.update(id, updatedAccount);
        console.log('[FinanceContext] ✅ Account updated:', id);
        setAccounts(accounts.map(a => a.id === id ? { ...a, ...updated } : a));
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
    const accountTransactions = transactions.filter(t => t.accountId === id);
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
        console.log('[FinanceContext] 🔄 Deleting account from backend...');
        await accountsAPI.delete(id);
        console.log('[FinanceContext] ✅ Account deleted:', id);
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
