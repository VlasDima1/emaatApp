

import React, { FC } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ChartData {
    label: string;
    value: number;
}

interface BarChartProps {
    title: string;
    data: ChartData[];
    lineData?: ChartData[];
    goalValue?: number;
    barColor: string;
    lineColor?: string;
    goalColor?: string;
    maxValue: number;
    lineMaxValue?: number;
    yAxisLabel?: string;
    lineYAxisLabel?: string;
}

export const BarChart: FC<BarChartProps> = ({ 
    title, data, lineData, goalValue, barColor, lineColor = 'stroke-blue-500', 
    goalColor = 'stroke-rose-500', maxValue, lineMaxValue, yAxisLabel, lineYAxisLabel 
}) => {
    const { t } = useLanguage();
    const chartHeight = 150;
    const chartWidth = 300; // Assuming a fixed width for simplicity
    const hasLineData = lineData && lineData.length > 0 && lineMaxValue;

    // FIX: Add a `> 0` check to the `barWidth` calculation to ensure it doesn't result in a division by zero or negative width, improving component stability when `data.length` is 0.
    const barWidth = data.length > 0 ? (chartWidth - (data.length - 1) * 5) / data.length : 0;

    // Create a map for quick line data lookup
    // FIX: Handle case where lineData is undefined to prevent runtime error with `new Map(undefined)`.
    const lineDataMap = new Map(lineData ? lineData.map(item => [item.label, item.value]) : []);

    // FIX: The arithmetic error can occur if the data sources are mismatched.
    // Iterating over the main `data` array and looking up line values is more robust
    // and correctly aligns the line path with the bar positions.
    const linePath = data
        .map((item: ChartData, index: number) => {
            const lineValue = lineDataMap.get(item.label);
            // FIX: Add a more explicit type guard for `lineValue` and `lineMaxValue` to ensure they are numbers, and also check for division by zero. This resolves the arithmetic operation type error.
            if (typeof lineValue !== 'number' || typeof lineMaxValue !== 'number' || lineMaxValue === 0) return null;
            const x = index * (barWidth + 5) + barWidth / 2;
            const y = chartHeight - (lineValue / lineMaxValue) * chartHeight;
            return { x, y };
        })
        .filter((p): p is {x: number, y: number} => p !== null)
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');


    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-brand-dark mb-4 text-center">{title}</h3>
            {data.length > 0 ? (
                <div className="relative">
                    <svg
                        viewBox={`-30 0 ${chartWidth + (hasLineData ? 60 : 30)} ${chartHeight + 30}`}
                        width="100%"
                        height="190"
                        aria-labelledby="title"
                        role="img"
                    >
                        <title id="title">{title}</title>
                        {/* Y-axis (Left) */}
                        <g className="text-gray-400">
                           {yAxisLabel && <text x="-30" y="10" className="text-[10px] font-bold fill-current">{yAxisLabel}</text>}
                           {[0, 0.25, 0.5, 0.75, 1].map(tick => (
                                <g key={tick}>
                                    <line
                                        x1="0"
                                        x2={chartWidth}
                                        y1={chartHeight * (1 - tick)}
                                        y2={chartHeight * (1 - tick)}
                                        stroke="currentColor"
                                        strokeWidth="0.5"
                                        strokeDasharray="2,2"
                                    />
                                    <text
                                        x="-5"
                                        y={chartHeight * (1 - tick) + 4}
                                        textAnchor="end"
                                        className="text-[10px] fill-current"
                                    >
                                        {Math.round(maxValue * tick)}</text>
                                </g>
                            ))}
                        </g>

                        {/* Y-axis (Right, for line data) */}
                        {hasLineData && lineMaxValue && (
                             <g className="text-gray-400">
                                {lineYAxisLabel && <text x={chartWidth + 30} y="10" textAnchor="end" className="text-[10px] font-bold fill-current">{lineYAxisLabel}</text>}
                                {[0, 0.25, 0.5, 0.75, 1].map(tick => (
                                    <text
                                        key={tick}
                                        x={chartWidth + 5}
                                        y={chartHeight * (1 - tick) + 4}
                                        textAnchor="start"
                                        className="text-[10px] fill-current"
                                    >
                                        {Math.round(lineMaxValue * tick)}
                                    </text>
                                ))}
                            </g>
                        )}
                        

                        {/* Bars and X-axis labels */}
                        {data.map((item, index) => {
                            const barHeight = (item.value / maxValue) * chartHeight;
                            const x = index * (barWidth + 5);
                            return (
                                <g key={item.label}>
                                    <rect
                                        x={x}
                                        y={chartHeight - barHeight}
                                        width={barWidth}
                                        height={barHeight}
                                        className={barColor}
                                        style={{ animation: `bar-grow 1s ${index * 0.05}s ease-out forwards`, transformOrigin: `bottom`, transform: 'scaleY(0)' }}
                                    />
                                    <text
                                        x={x + barWidth / 2}
                                        y={chartHeight + 15}
                                        textAnchor="middle"
                                        className="text-[10px] font-semibold fill-gray-600"
                                    >
                                        {item.label}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Line Path */}
                        {linePath && <path d={linePath} className={`${lineColor}`} strokeWidth="2" fill="none" style={{ animation: `line-draw 1s 0.5s ease-out forwards`, strokeDasharray: 500, strokeDashoffset: 500 }} />}

                        {/* Goal line */}
                        {goalValue !== undefined && goalValue > 0 && (
                             <line
                                x1="0"
                                x2={chartWidth}
                                y1={chartHeight - (goalValue / maxValue) * chartHeight}
                                y2={chartHeight - (goalValue / maxValue) * chartHeight}
                                className={goalColor}
                                strokeWidth="1.5"
                                strokeDasharray="4,4"
                            />
                        )}
                    </svg>
                     <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className={`w-3 h-3 rounded-sm ${barColor.replace('fill', 'bg')}`}></div>
                            <span className="font-medium text-gray-600">{yAxisLabel || t('statsScreen.value')}</span>
                        </div>
                         {lineData && lineYAxisLabel && (
                            <div className="flex items-center gap-1.5">
                                <div className={`w-3 h-0.5 rounded-full ${lineColor.replace('stroke', 'bg')}`}></div>
                                <span className="font-medium text-gray-600">{lineYAxisLabel}</span>
                            </div>
                        )}
                        {goalValue !== undefined && goalValue > 0 && (
                            <div className="flex items-center gap-1.5">
                                 <svg width="12" height="12" viewBox="0 0 12 12"><line x1="0" y1="6" x2="12" y2="6" className={goalColor} strokeWidth="1.5" strokeDasharray="3,3"/></svg>
                                <span className="font-medium text-gray-600">{t('statsScreen.goal')} ({goalValue})</span>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500 py-8"><p>{t('statsScreen.noData')}</p></div>
            )}
            <style>{`
                @keyframes bar-grow { to { transform: scaleY(1); } }
                @keyframes line-draw { to { stroke-dashoffset: 0; } }
            `}</style>
        </div>
    );
};

export default BarChart;
