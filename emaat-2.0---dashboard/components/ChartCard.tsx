
import React from 'react';
import { Challenge, Domain } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getDomainMeta } from '../utils/domainUtils';

interface ChartCardProps {
  challenge: Challenge;
}

const ChartCard: React.FC<ChartCardProps> = ({ challenge }) => {
  const { domain, data, progress } = challenge;
  const isComplete = progress === 100;
  const chartData = data.map(d => ({ name: d.date.substring(5).replace('-', '/'), value: d.value }));
  
  const { unit, icon: Icon, colorHex: chartColor } = getDomainMeta(domain);
  const iconElement = Icon ? <Icon className="h-6 w-6" /> : null;
  
  const ChartComponent = domain === Domain.Beweeg ? BarChart : LineChart;
  const ChartElement = domain === Domain.Beweeg 
    ? <Bar dataKey="value" fill={chartColor} /> 
    : <Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} dot={{ r: 3, fill: chartColor }} activeDot={{ r: 6 }} />;

  return (
    <div className={`bg-white p-5 rounded-xl shadow-sm transition-all duration-300 ${!isComplete && progress > 0 && 'ring-2 ring-blue-500'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
            <div style={{ color: chartColor }}>
                {iconElement}
            </div>
          <div>
            <h4 className="font-bold text-gray-800">{domain}</h4>
            <p className={`text-xs font-medium ${isComplete ? 'text-green-600' : progress > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
              {isComplete ? 'Challenge Voltooid' : progress > 0 ? 'Bezig' : 'Nog niet gestart'}
            </p>
          </div>
        </div>
        <div className={`text-sm font-bold px-2.5 py-1 rounded-full ${isComplete ? 'bg-green-100 text-green-800' : progress > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          {progress}%
        </div>
      </div>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <ChartComponent data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
              }}
              labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
              formatter={(value: number, name: string) => [`${value} ${unit}`, null]}
              cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}
            />
            {ChartElement}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
