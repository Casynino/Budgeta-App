export const CURRENCIES = {
  // Major World Currencies
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    decimals: 2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    decimals: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    decimals: 2,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    flag: '🇯🇵',
    decimals: 0,
  },
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    flag: '🇨🇳',
    decimals: 2,
  },
  
  // African Currencies
  TZS: {
    code: 'TZS',
    symbol: 'TSh',
    name: 'Tanzanian Shilling',
    flag: '🇹🇿',
    decimals: 0,
  },
  KES: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    flag: '🇰🇪',
    decimals: 2,
  },
  UGX: {
    code: 'UGX',
    symbol: 'USh',
    name: 'Ugandan Shilling',
    flag: '🇺🇬',
    decimals: 0,
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    flag: '🇿🇦',
    decimals: 2,
  },
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    flag: '🇳🇬',
    decimals: 2,
  },
  EGP: {
    code: 'EGP',
    symbol: 'E£',
    name: 'Egyptian Pound',
    flag: '🇪🇬',
    decimals: 2,
  },
  
  // Other Popular Currencies
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    decimals: 2,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    flag: '🇦🇺',
    decimals: 2,
  },
  CHF: {
    code: 'CHF',
    symbol: 'Fr',
    name: 'Swiss Franc',
    flag: '🇨🇭',
    decimals: 2,
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    decimals: 2,
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    flag: '🇧🇷',
    decimals: 2,
  },
  MXN: {
    code: 'MXN',
    symbol: 'Mex$',
    name: 'Mexican Peso',
    flag: '🇲🇽',
    decimals: 2,
  },
  
  // Cryptocurrency
  BTC: {
    code: 'BTC',
    symbol: '₿',
    name: 'Bitcoin',
    flag: '₿',
    decimals: 8,
  },
  ETH: {
    code: 'ETH',
    symbol: 'Ξ',
    name: 'Ethereum',
    flag: 'Ξ',
    decimals: 6,
  },
};

// Exchange rates (relative to USD as base)
// In production, these would come from an API
export const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CNY: 7.24,
  TZS: 2500,
  KES: 129.50,
  UGX: 3750,
  ZAR: 18.50,
  NGN: 790,
  EGP: 30.90,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  INR: 83.12,
  BRL: 4.98,
  MXN: 17.05,
  BTC: 0.000027, // ~$37,000 per BTC
  ETH: 0.00051,  // ~$1,960 per ETH
};

// Popular currency groups for quick selection
export const CURRENCY_GROUPS = {
  POPULAR: ['USD', 'EUR', 'GBP', 'JPY', 'CNY'],
  AFRICA: ['TZS', 'KES', 'UGX', 'ZAR', 'NGN', 'EGP'],
  AMERICAS: ['USD', 'CAD', 'BRL', 'MXN'],
  EUROPE: ['EUR', 'GBP', 'CHF'],
  ASIA: ['JPY', 'CNY', 'INR'],
  CRYPTO: ['BTC', 'ETH'],
};

// Convert amount from one currency to another
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  
  // Convert to USD first, then to target currency
  const amountInUSD = amount / fromRate;
  const convertedAmount = amountInUSD * toRate;
  
  return convertedAmount;
};

// Format currency with proper symbol and decimals
export const formatCurrencyValue = (amount, currencyCode = 'USD') => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const absAmount = Math.abs(amount);
  
  const formatted = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  });
  
  const sign = amount < 0 ? '-' : '';
  
  // Handle different symbol positions
  if (currencyCode === 'EUR') {
    return `${sign}${formatted}${currency.symbol}`;
  } else {
    return `${sign}${currency.symbol}${formatted}`;
  }
};

// Get currency info
export const getCurrencyInfo = (code) => {
  return CURRENCIES[code] || CURRENCIES.USD;
};

// Get all currency codes
export const getAllCurrencyCodes = () => {
  return Object.keys(CURRENCIES);
};

// Get currencies by group
export const getCurrenciesByGroup = (group) => {
  return CURRENCY_GROUPS[group] || [];
};
