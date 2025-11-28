import { Construction } from 'lucide-react';
import Card from '../../components/common/Card';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/helpers';

const Investments = () => {
  const { investments, baseCurrency, displayCurrency } = useFinance();

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalGain = totalCurrentValue - totalInvested;
  const totalROI = totalInvested > 0 ? ((totalGain / totalInvested) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Investment Tracker</h1>
        <p className="text-gray-600 mt-1">Track your investments and portfolio performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-600">Total Invested</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvested, baseCurrency, displayCurrency)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">Current Value</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalCurrentValue, baseCurrency, displayCurrency)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">Total Gain/Loss</p>
          <p className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain, baseCurrency, displayCurrency)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">ROI</p>
          <p className={`text-2xl font-bold ${totalROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalROI >= 0 ? '+' : ''}{totalROI}%
          </p>
        </Card>
      </div>

      {/* Investments List */}
      <Card>
        <div className="text-center py-16">
          <Construction className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
          <p className="text-gray-500">Investment tracking feature is under development</p>
          <p className="text-sm text-gray-400 mt-2">
            You'll be able to track stocks, crypto, and other investments here
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Investments;
