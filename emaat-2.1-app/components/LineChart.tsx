

import React, { FC } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ChartData {
    label: string;
    value: number;
}

interface LineChartProps {
    title: string;
    data1: ChartData[];
    label1?: string;
    data2?: ChartData[];
    label2?: string;
    color1: string;
    color2?: string;
    maxValue: number;
    minValue?: number;
}

const LineChart: FC<LineChartProps> = ({ title, data1, label1, data2, label2, color1, color2, maxValue, minValue = 0 }) => {
    const { t } = useLanguage();
    const chartHeight = 150;
    const chartWidth = 300;
    const data = data1.length > (data2?.length || 0) ? data1 : (data2 || data1);
    const range = maxValue - minValue;

    const getPath = (d: ChartData[], maxVal: number, minVal: number) => {
        if (d.length < 2) return '';
        const valueRange = maxVal - minVal;
        if (valueRange <= 0) return '';
        return d
            .map((item, index) => {
                const x = (index / (d.length - 1)) * chartWidth;
                const y = chartHeight - ((item.value - minVal) / valueRange) * chartHeight;
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');
    };

    const path1 = getPath(data1, maxValue, minValue);
    const path2 = data2 ? getPath(data2, maxValue, minValue) : '';

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-brand-dark mb-4 text-center">{title}</h3>
            {data.length > 0 ? (
                <>
                    <svg
                        viewBox={`-30 0 ${chartWidth + 30} ${chartHeight + 30}`}
                        width="100%"
                        height="190"
                        aria-labelledby="title"
                        role="img"
                    >
                        <title id="title">{title}</title>
                        {[0, 0.25, 0.5, 0.75, 1].map(tick => (
                            <g key={tick} className="text-gray-400">
                                <line
                                    x1="0"
                                    x2={chartWidth}
                                    y1={chartHeight * (1 - tick)}
                                    y2={chartHeight * (1 - tick)}
                                    stroke="currentColor"
                                    strokeWidth="0.5"
                                    strokeDasharray="2,2"
                                />
                                <text x="-5" y={chartHeight * (1 - tick) + 4} textAnchor="end" className="text-[10px] fill-current">
                                    {Math.round(minValue + range * tick)}
                                </text>
                            </g>
                        ))}

                        {data.map((item, index) => (
                            <text
                                key={item.label}
                                x={data.length > 1 ? (index / (data.length - 1)) * chartWidth : chartWidth / 2}
                                y={chartHeight + 15}
                                textAnchor="middle"
                                className="text-[10px] font-semibold fill-gray-600"
                            >
                                {item.label}
                            </text>
                        ))}
                        
                        {path1 && <path d={path1} className={`${color1}`} strokeWidth="2" fill="none" style={{ animation: `line-draw 1s 0.2s ease-out forwards`, strokeDasharray: 500, strokeDashoffset: 500 }} />}
                        {path2 && color2 && <path d={path2} className={`${color2}`} strokeWidth="2" fill="none" style={{ animation: `line-draw 1s 0.4s ease-out forwards`, strokeDasharray: 500, strokeDashoffset: 500 }} />}

                        {data1.map((item, index) => {
                            const x = data1.length > 1 ? (index / (data1.length - 1)) * chartWidth : chartWidth / 2;
                            const y = range > 0 ? chartHeight - ((item.value - minValue) / range) * chartHeight : chartHeight;
                            return <circle key={`d1-${index}`} cx={x} cy={y} r="2" className={`${color1.replace('stroke', 'fill')}`} style={{ animation: `dot-appear 0.1s ${1.2 + index*0.05}s ease-out forwards`, opacity: 0 }}/>
                        })}
                        {data2 && color2 && data2.map((item, index) => {
                            const x = data2.length > 1 ? (index / (data2.length - 1)) * chartWidth : chartWidth / 2;
                            const y = range > 0 ? chartHeight - ((item.value - minValue) / range) * chartHeight : chartHeight;
                            return <circle key={`d2-${index}`} cx={x} cy={y} r="2" className={`${color2.replace('stroke', 'fill')}`} style={{ animation: `dot-appear 0.1s ${1.4 + index*0.05}s ease-out forwards`, opacity: 0 }}/>
                        })}
                    </svg>
                    {(label1 || (label2 && data2)) && (
                        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                            {label1 && (
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-3 h-3 rounded-full ${color1.replace('stroke', 'bg')}`}></div>
                                    <span className="font-medium text-gray-600">{label1}</span>
                                </div>
                            )}
                            {label2 && data2 && color2 && (
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-3 h-3 rounded-full ${color2.replace('stroke', 'bg')}`}></div>
                                    <span className="font-medium text-gray-600">{label2}</span>
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center text-gray-500 py-8"><p>{t('statsScreen.noData')}</p></div>
            )}
             <style>{`
                @keyframes line-draw { to { stroke-dashoffset: 0; } }
                @keyframes dot-appear { to { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default LineChart;
