import React from 'react';
import { Target, Construction } from 'lucide-react';
import Card from '../../components/common/Card';

const Goals = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Goals</h1>
        <p className="text-gray-600 mt-1">Set and track your financial goals and wishlist</p>
      </div>

      <Card>
        <div className="text-center py-16">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
          <p className="text-gray-500">Goals and wishlist feature is under development</p>
          <p className="text-sm text-gray-400 mt-2">
            Set financial goals, track progress, and manage your wishlist items
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Goals;
