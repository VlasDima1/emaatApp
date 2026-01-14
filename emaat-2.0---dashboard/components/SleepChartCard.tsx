import React from 'react';
import { DailyDataPoint } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SleepIcon } from './icons';

interface SleepChartCardProps {
  data: DailyDataPoint[];
}

const SleepChartCard: React.FC<SleepChartCardProps> = ({ data }) => {
  const chartData = data.map(d => ({ name: d.date.substring(5).replace('-', '/'), value: d.value }));
  const chartColor = '#6366f1'; // Indigo for sleep

  // Calculate statistics
  const sleepHours = data.map(d => d.value);
  const totalHours = sleepHours.reduce((acc, hours) => acc + hours, 0);
  const averageHours = totalHours / sleepHours.length;
  
  const mean = averageHours;
  const squaredDifferences = sleepHours.map(hours => Math.pow(hours - mean, 2));
  const avgSquaredDifference = squaredDifferences.reduce((acc, val) => acc + val, 0) / squaredDifferences.length;
  const stdDev = Math.sqrt(avgSquaredDifference);

  const getConsistencyText = (stdDev: number): string => {
      if (stdDev < 0.5) return 'Zeer consistent';
      if (stdDev < 1.0) return 'Consistent';
      if (stdDev < 1.5) return 'Wisselend';
      return 'Zeer wisselend';
  };
  const consistencyText = getConsistencyText(stdDev);
  
  const getConsistencyColor = (stdDev: number): string => {
    if (stdDev < 0.5) return 'text-green-600';
    if (stdDev < 1.0) return 'text-emerald-600';
    if (stdDev < 1.5) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div style={{ color: chartColor }}>
          <SleepIcon className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-bold text-gray-800">Uren geslapen</h4>
          <p className="text-xs text-gray-500">Over de afgelopen 14 dagen</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center mb-4 border-t border-b border-gray-100 py-3">
        <div>
            <p className="text-sm text-gray-500">Gemiddeld</p>
            <p className="text-xl font-bold text-indigo-600">{averageHours.toFixed(1)}u</p>
        </div>
        <div>
            <p className="text-sm text-gray-500">Consistentie</p>
            <p className={`text-xl font-bold ${getConsistencyColor(stdDev)}`}>{consistencyText}</p>
        </div>
      </div>

      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} unit="u" domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
              }}
              labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
              formatter={(value: number) => [`${value} uur`, null]}
              cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}
            />
            <ReferenceLine y={averageHours} label={{ value: `Gem: ${averageHours.toFixed(1)}u`, position: 'insideTopLeft', fill: '#4b5563', fontSize: 10 }} stroke="#4b5563" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} dot={{ r: 3, fill: chartColor }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SleepChartCard;
