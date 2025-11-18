import React from 'react';
import { Receipt, Construction } from 'lucide-react';
import Card from '../../components/common/Card';

const Recurring = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recurring Payments</h1>
        <p className="text-gray-600 mt-1">Manage subscriptions, bills, and recurring expenses</p>
      </div>

      <Card>
        <div className="text-center py-16">
          <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
          <p className="text-gray-500">Recurring payments feature is under development</p>
          <p className="text-sm text-gray-400 mt-2">
            Track and manage subscriptions, rent, bills, and other recurring payments
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Recurring;
