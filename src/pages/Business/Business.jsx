import React from 'react';
import { Briefcase, Construction } from 'lucide-react';
import Card from '../../components/common/Card';

const Business = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Business Finance</h1>
        <p className="text-gray-600 mt-1">Manage finances for your businesses</p>
      </div>

      <Card>
        <div className="text-center py-16">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
          <p className="text-gray-500">Business finance mode is under development</p>
          <p className="text-sm text-gray-400 mt-2">
            Manage multiple businesses, track P&L, generate reports, and more
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Business;
