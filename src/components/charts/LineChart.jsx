import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const LineChart = ({ data, dataKeys, colors, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          stroke="#64748b"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#64748b"
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
        />
        <Legend />
        {dataKeys.map((key, index) => (
          <Line 
            key={key}
            type="monotone" 
            dataKey={key} 
            stroke={colors[index] || '#0ea5e9'} 
            strokeWidth={2}
            dot={{ fill: colors[index] || '#0ea5e9', r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
