import React, { useState } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { CURRENCIES, CURRENCY_GROUPS, getCurrenciesByGroup } from '../../constants/currencies';
import { useFinance } from '../../context/FinanceContext';

const CurrencySelector = ({ compact = false }) => {
  const { displayCurrency, setDisplayCurrency } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('POPULAR');

  const currentCurrency = CURRENCIES[displayCurrency] || CURRENCIES.USD;

  const handleSelectCurrency = (code) => {
    setDisplayCurrency(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Filter currencies based on search and active tab
  const getFilteredCurrencies = () => {
    let currencies = [];
    
    if (searchQuery) {
      // Search across all currencies
      currencies = Object.keys(CURRENCIES).filter(code => {
        const currency = CURRENCIES[code];
        return (
          currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          currency.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    } else {
      // Show currencies by group
      const groupCodes = getCurrenciesByGroup(activeTab);
      currencies = groupCodes.length > 0 
        ? groupCodes 
        : Object.keys(CURRENCIES);
    }

    return currencies;
  };

  const filteredCurrencies = getFilteredCurrencies();

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-primary-500 transition-all"
        >
          <span className="text-lg">{currentCurrency.flag}</span>
          <span className="text-white font-medium">{currentCurrency.code}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            <div className="absolute right-0 mt-2 w-72 bg-dark-800 border border-dark-600 rounded-xl shadow-card-hover z-50 max-h-96 overflow-hidden flex flex-col">
              {/* Search */}
              <div className="p-3 border-b border-dark-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search currencies..."
                    className="w-full pl-10 pr-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
                  />
                </div>
              </div>

              {/* Tabs */}
              {!searchQuery && (
                <div className="flex gap-1 p-2 border-b border-dark-700 overflow-x-auto">
                  {Object.keys(CURRENCY_GROUPS).map((group) => (
                    <button
                      key={group}
                      onClick={() => setActiveTab(group)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        activeTab === group
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-dark-700'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              )}

              {/* Currency List */}
              <div className="overflow-y-auto flex-1">
                {filteredCurrencies.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No currencies found
                  </div>
                ) : (
                  filteredCurrencies.map((code) => {
                    const currency = CURRENCIES[code];
                    const isSelected = code === displayCurrency;
                    
                    return (
                      <button
                        key={code}
                        onClick={() => handleSelectCurrency(code)}
                        className={`w-full px-4 py-3 flex items-center justify-between hover:bg-dark-700 transition-colors ${
                          isSelected ? 'bg-dark-700' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{currency.flag}</span>
                          <div className="text-left">
                            <p className="text-white font-medium text-sm">{currency.code}</p>
                            <p className="text-gray-500 text-xs">{currency.name}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-primary-500" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Full version with more details
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-primary-500 transition-all min-w-[200px]"
      >
        <span className="text-2xl">{currentCurrency.flag}</span>
        <div className="flex-1 text-left">
          <p className="text-white font-semibold">{currentCurrency.code}</p>
          <p className="text-gray-400 text-xs">{currentCurrency.name}</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute left-0 mt-2 w-80 bg-dark-800 border border-dark-600 rounded-xl shadow-card-hover z-50 max-h-[500px] overflow-hidden flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-dark-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search currencies..."
                  className="w-full pl-10 pr-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {/* Tabs */}
            {!searchQuery && (
              <div className="flex gap-2 p-3 border-b border-dark-700 overflow-x-auto">
                {Object.keys(CURRENCY_GROUPS).map((group) => (
                  <button
                    key={group}
                    onClick={() => setActiveTab(group)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === group
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-dark-700'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            )}

            {/* Currency List */}
            <div className="overflow-y-auto flex-1">
              {filteredCurrencies.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No currencies found
                </div>
              ) : (
                filteredCurrencies.map((code) => {
                  const currency = CURRENCIES[code];
                  const isSelected = code === displayCurrency;
                  
                  return (
                    <button
                      key={code}
                      onClick={() => handleSelectCurrency(code)}
                      className={`w-full px-4 py-3 flex items-center justify-between hover:bg-dark-700 transition-colors ${
                        isSelected ? 'bg-dark-700' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{currency.flag}</span>
                        <div className="text-left">
                          <p className="text-white font-semibold">{currency.code}</p>
                          <p className="text-gray-500 text-sm">{currency.name}</p>
                          <p className="text-gray-600 text-xs mt-0.5">Symbol: {currency.symbol}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-primary-500" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencySelector;
