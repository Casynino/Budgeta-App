export const ACCOUNT_TYPES = {
  BANK: 'bank',
  MOBILE_MONEY: 'mobile_money',
  CRYPTO: 'crypto',
  DIGITAL_WALLET: 'digital_wallet',
  CASH: 'cash',
  INVESTMENT: 'investment',
};

export const ACCOUNT_ICONS = {
  [ACCOUNT_TYPES.BANK]: '🏦',
  [ACCOUNT_TYPES.MOBILE_MONEY]: '📱',
  [ACCOUNT_TYPES.CRYPTO]: '₿',
  [ACCOUNT_TYPES.DIGITAL_WALLET]: '💳',
  [ACCOUNT_TYPES.CASH]: '💵',
  [ACCOUNT_TYPES.INVESTMENT]: '📈',
};

export const ACCOUNT_COLORS = {
  [ACCOUNT_TYPES.BANK]: '#3b82f6',
  [ACCOUNT_TYPES.MOBILE_MONEY]: '#10b981',
  [ACCOUNT_TYPES.CRYPTO]: '#f59e0b',
  [ACCOUNT_TYPES.DIGITAL_WALLET]: '#8b5cf6',
  [ACCOUNT_TYPES.CASH]: '#22c55e',
  [ACCOUNT_TYPES.INVESTMENT]: '#06b6d4',
};

// Quick Add Popular Accounts - EXACTLY 7 accounts as specified
export const POPULAR_ACCOUNTS = [
  { name: 'CRDB – PLC', type: ACCOUNT_TYPES.BANK, icon: '🏦', color: '#0066b2' },
  { name: 'NMB', type: ACCOUNT_TYPES.BANK, icon: '🏦', color: '#10b981' },
  { name: 'M-Pesa', type: ACCOUNT_TYPES.MOBILE_MONEY, icon: '📱', color: '#10b981' },
  { name: 'Airtel Money', type: ACCOUNT_TYPES.MOBILE_MONEY, icon: '📱', color: '#ed1c24' },
  { name: 'Mix By Yas', type: ACCOUNT_TYPES.MOBILE_MONEY, icon: '📱', color: '#8b5cf6' },
  { name: 'Binance', type: ACCOUNT_TYPES.DIGITAL_WALLET, icon: '💳', color: '#f0b90b' },
  { name: 'Cash Kibubu', type: ACCOUNT_TYPES.CASH, icon: '💵', color: '#22c55e' },
];

export const DEFAULT_ACCOUNTS = [
  {
    id: '1',
    name: 'Main Bank Account',
    type: ACCOUNT_TYPES.BANK,
    icon: '🏦',
    color: '#3b82f6',
    balance: 0,
    currency: 'USD',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Cash Wallet',
    type: ACCOUNT_TYPES.CASH,
    icon: '💵',
    color: '#22c55e',
    balance: 0,
    currency: 'USD',
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
];
