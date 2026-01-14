

import React, { FC, useMemo } from 'react';
import { BloodGlucoseMeasurement, BloodGlucoseTiming } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface BloodGlucoseTableProps {
    title: string;
    data: BloodGlucoseMeasurement[];
}

const BloodGlucoseTable: FC<BloodGlucoseTableProps> = ({ title, data }) => {
    const { t } = useLanguage();
    const timings: BloodGlucoseTiming[] = ['N', 'NO', 'VM', 'NM', 'VA', 'NA', 'VS'];

    const groupedData = useMemo(() => {
        const grouped: { [date: string]: { [timing in BloodGlucoseTiming]?: number } } = {};
        
        const uniqueDates = [...new Set(data.map(d => d.timestamp.toISOString().split('T')[0]))]
            .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime())
            .slice(0, 7);

        data.forEach(item => {
            const dateKey = item.timestamp.toISOString().split('T')[0];
            if (uniqueDates.includes(dateKey)) {
                if (!grouped[dateKey]) {
                    grouped[dateKey] = {};
                }
                grouped[dateKey][item.timing] = item.value;
            }
        });
        return Object.entries(grouped).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
    }, [data]);

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
            <h3 className="font-semibold text-brand-dark mb-4 text-center">{title}</h3>
            {groupedData.length > 0 ? (
                <table className="w-full text-sm text-center">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 px-1 font-semibold text-gray-600">{t('statsScreen.bloodGlucoseDateHeader')}</th>
                            {timings.map(timing => (
                                <th key={timing} className="py-2 px-1 font-semibold text-gray-600" title={t(`measurements.timings.${timing}`)}>
                                    {t(`statsScreen.bloodGlucoseTimings.${timing}`)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {groupedData.map(([date, values]) => (
                            <tr key={date} className="border-b last:border-b-0">
                                <td className="py-2 px-1 font-medium text-gray-800">
                                    {new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'numeric' })}
                                </td>
                                {timings.map(timing => (
                                    <td key={timing} className="py-2 px-1 text-gray-700">
                                        {values[timing] !== undefined ? values[timing]?.toFixed(1) : '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    <p>{t('statsScreen.noData')}</p>
                </div>
            )}
        </div>
    );
};

export default BloodGlucoseTable;
