import React from 'react';
import { DailyDataPoint } from '../types';
import { CheckCircleIcon, XCircleIcon, StarIcon } from './icons';

interface SleepMetricsTrackerProps {
  data: DailyDataPoint[];
}

const metrics = [
    { key: 'sleepQuality', label: 'Slaapkwaliteit (sterren)', type: 'stars' },
    { key: 'wentToBedOnTime', label: 'Op tijd naar bed' },
    { key: 'noAlcoholOrCoffee', label: 'Geen alcohol/koffie (2u voor slapen)' },
    { key: 'darkAndQuiet', label: 'Slaapkamer donker & stil' },
    { key: 'goodTemperature', label: 'Slaapkamer goede temperatuur' },
    { key: 'didMoveToday', label: 'Vandaag bewogen' },
    { key: 'noScreenTime', label: 'Geen schermtijd (30min voor slapen)' },
    { key: 'relaxingActivity', label: 'Ontspannende activiteit voor slapen' },
];

const SleepMetricsTracker: React.FC<SleepMetricsTrackerProps> = ({ data }) => {

  const renderCompactRating = (rating: number) => {
    const colorClass = rating >= 4 ? 'text-green-600 bg-green-50' : rating >= 3 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
    return (
      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-sm font-medium ${colorClass}`}>
        {rating}<StarIcon className="h-3 w-3" />
      </span>
    );
  };

  const renderCellContent = (metricKey: keyof DailyDataPoint['details'] | 'value', day: DailyDataPoint, metricType?: string) => {
    if (metricKey === 'value') {
      return <span className="text-sm font-semibold text-gray-700">{day.value}u</span>;
    }
    
    const value = day.details?.[metricKey];

    if (value === undefined || value === null) {
      return <span className="text-gray-300">-</span>;
    }

    // Handle star rating for sleep quality - compact display
    if (metricType === 'stars' && typeof value === 'number') {
      return renderCompactRating(value);
    }

    return value ? (
      <CheckCircleIcon className="h-6 w-6 text-green-500" />
    ) : (
      <XCircleIcon className="h-6 w-6 text-red-400" />
    );
  };

  const getSummaryColor = (successCount: number, total: number): string => {
    if (total === 0) return 'bg-gray-100 text-gray-600';
    const percentage = (successCount / total) * 100;

    if (percentage >= 80) {
      return 'bg-green-100 text-green-800'; // Good
    }
    if (percentage >= 50) {
      return 'bg-yellow-100 text-yellow-800'; // Needs improvement
    }
    return 'bg-red-100 text-red-800'; // Poor
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Slaap Dagboek</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        <th className="sticky left-0 bg-white p-3 text-sm font-semibold text-gray-600 text-left min-w-[300px]">Metric</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 text-center">Samenvatting</th>
                        {data.map((_, index) => (
                            <th key={index} className="p-3 text-sm font-semibold text-gray-600 text-center">{`Dag ${index + 1}`}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {metrics.map(metric => {
                        const metricType = (metric as any).type;
                        
                        // Calculate summary based on metric type
                        let summaryContent: React.ReactNode;
                        let summaryColorClass: string;
                        
                        if (metricType === 'stars') {
                            // Calculate average star rating
                            const ratings = data
                                .map(day => day.details?.sleepQuality)
                                .filter((r): r is number => typeof r === 'number');
                            if (ratings.length > 0) {
                                const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                                summaryColorClass = avgRating >= 4 ? 'text-green-600 bg-green-50' : avgRating >= 3 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
                                summaryContent = (
                                    <span className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-sm font-semibold ${summaryColorClass}`}>
                                        {avgRating.toFixed(1)}<StarIcon className="h-3 w-3" />
                                    </span>
                                );
                            } else {
                                summaryContent = <span className="text-gray-400">-</span>;
                                summaryColorClass = 'bg-gray-50';
                            }
                        } else {
                            const successCount = data.filter(day => day.details && day.details[metric.key as keyof DailyDataPoint['details']]).length;
                            summaryColorClass = getSummaryColor(successCount, data.length);
                            summaryContent = (
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${summaryColorClass}`}>
                                    {successCount} / {data.length}
                                </span>
                            );
                        }
                        
                        return (
                            <tr key={metric.key} className="hover:bg-gray-50">
                                <td className="sticky left-0 bg-white p-3 text-sm text-gray-700 font-medium whitespace-nowrap">
                                    {metric.label}
                                </td>
                                <td className={`p-3 text-center ${metricType === 'stars' ? summaryColorClass : ''}`}>
                                    {summaryContent}
                                </td>
                                {data.map(day => (
                                    <td key={day.date} className="p-3 text-center">
                                        <div className="flex justify-center items-center">
                                            {renderCellContent(metric.key as any, day, metricType)}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default SleepMetricsTracker;