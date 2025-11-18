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

export const POPULAR_ACCOUNTS = {
  // Banks
  BANKS: [
    { name: 'Chase Bank', type: ACCOUNT_TYPES.BANK, icon: '🏦', color: '#0c4da2' },
    { name: 'Bank of America', type: ACCOUNT_TYPES.BANK, icon: '🏦', color: '#e31837' },
    { name: 'Wells Fargo', type: ACCOUNT_TYPES.BANK, icon: '🏦', color: '#d71e28' },
    { name: 'Citibank', type: ACCOUNT_TYPES.BANK, icon: '🏦', color: '#003f8a' },
    { name: 'HSBC', type: ACCOUNT_TYPES.BANK, icon: '🏦', color: '#db0011' },
    { name: 'Standard Bank', type: ACCOUNT_TYPES.BANK, icon: '🏦', color: '#0033a1' },
    { name: 'Barclays', type: ACCOUNT_TYPES.BANK, icon: '🏦', color: '#00aeef' },
  ],
  
  // Mobile Money
  MOBILE_MONEY: [
    { name: 'M-Pesa', type: ACCOUNT_TYPES.MOBILE_MONEY, icon: '📱', color: '#10b981' },
    { name: 'TigoPesa', type: ACCOUNT_TYPES.MOBILE_MONEY, icon: '📱', color: '#0066b2' },
    { name: 'Airtel Money', type: ACCOUNT_TYPES.MOBILE_MONEY, icon: '📱', color: '#ed1c24' },
    { name: 'Vodacom M-Pesa', type: ACCOUNT_TYPES.MOBILE_MONEY, icon: '📱', color: '#e60000' },
    { name: 'MTN Mobile Money', type: ACCOUNT_TYPES.MOBILE_MONEY, icon: '📱', color: '#ffcb05' },
    { name: 'Orange Money', type: ACCOUNT_TYPES.MOBILE_MONEY, icon: '📱', color: '#ff7900' },
  ],
  
  // Crypto Wallets
  CRYPTO: [
    { name: 'Binance', type: ACCOUNT_TYPES.CRYPTO, icon: '₿', color: '#f0b90b' },
    { name: 'Coinbase', type: ACCOUNT_TYPES.CRYPTO, icon: '₿', color: '#0052ff' },
    { name: 'Kraken', type: ACCOUNT_TYPES.CRYPTO, icon: '₿', color: '#5741d9' },
    { name: 'Crypto.com', type: ACCOUNT_TYPES.CRYPTO, icon: '₿', color: '#002d74' },
    { name: 'Trust Wallet', type: ACCOUNT_TYPES.CRYPTO, icon: '₿', color: '#3375bb' },
    { name: 'MetaMask', type: ACCOUNT_TYPES.CRYPTO, icon: '₿', color: '#f6851b' },
  ],
  
  // Digital Wallets
  DIGITAL_WALLETS: [
    { name: 'PayPal', type: ACCOUNT_TYPES.DIGITAL_WALLET, icon: '💳', color: '#003087' },
    { name: 'WeChat Pay', type: ACCOUNT_TYPES.DIGITAL_WALLET, icon: '💳', color: '#09b83e' },
    { name: 'Alipay', type: ACCOUNT_TYPES.DIGITAL_WALLET, icon: '💳', color: '#1677ff' },
    { name: 'Google Pay', type: ACCOUNT_TYPES.DIGITAL_WALLET, icon: '💳', color: '#4285f4' },
    { name: 'Apple Pay', type: ACCOUNT_TYPES.DIGITAL_WALLET, icon: '💳', color: '#000000' },
    { name: 'Venmo', type: ACCOUNT_TYPES.DIGITAL_WALLET, icon: '💳', color: '#3d95ce' },
    { name: 'Cash App', type: ACCOUNT_TYPES.DIGITAL_WALLET, icon: '💳', color: '#00d54b' },
  ],
};

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
