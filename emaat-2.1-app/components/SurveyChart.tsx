

import React, { FC } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ChartDataSeries {
    label: string;
    data: { x: string; y: number }[];
    color: string;
}

interface SurveyChartProps {
    title: string;
    series: ChartDataSeries[];
    maxValue: number;
}

const SurveyChart: FC<SurveyChartProps> = ({ title, series, maxValue }) => {
    const { t } = useLanguage();
    const chartHeight = 150;
    const chartWidth = 300;
    const allXLabels = [...new Set(series.flatMap(s => s.data.map(d => d.x)))].sort();

    const getPath = (data: { x: string; y: number }[], maxVal: number) => {
        if (data.length < 2) return '';
        return data
            .map(item => {
                const index = allXLabels.indexOf(item.x);
                const x = (index / (allXLabels.length - 1)) * chartWidth;
                const y = chartHeight - (item.y / maxVal) * chartHeight;
                return `${data.indexOf(item) === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-brand-dark mb-4 text-center">{title}</h3>
            {allXLabels.length > 0 ? (
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
                                <line x1="0" x2={chartWidth} y1={chartHeight * (1 - tick)} y2={chartHeight * (1 - tick)} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                                <text x="-5" y={chartHeight * (1 - tick) + 4} textAnchor="end" className="text-[10px] fill-current">{Math.round(maxValue * tick)}</text>
                            </g>
                        ))}
                        {allXLabels.map((label, index) => (
                            <text key={label} x={allXLabels.length > 1 ? (index / (allXLabels.length - 1)) * chartWidth : chartWidth / 2} y={chartHeight + 15} textAnchor="middle" className="text-[10px] font-semibold fill-gray-600">{label}</text>
                        ))}
                        {series.map((s, sIndex) => {
                            const path = getPath(s.data, maxValue);
                            return (
                                <g key={s.label}>
                                    <path d={path} className={s.color} strokeWidth="2" fill="none" style={{ animation: `line-draw 1s ${0.2 * (sIndex + 1)}s ease-out forwards`, strokeDasharray: 500, strokeDashoffset: 500 }} />
                                    {s.data.map((item, index) => {
                                        const xIndex = allXLabels.indexOf(item.x);
                                        const x = allXLabels.length > 1 ? (xIndex / (allXLabels.length - 1)) * chartWidth : chartWidth / 2;
                                        const y = chartHeight - (item.y / maxValue) * chartHeight;
                                        return <circle key={`${s.label}-${index}`} cx={x} cy={y} r="2" className={s.color.replace('stroke', 'fill')} style={{ animation: `dot-appear 0.1s ${1.2 + 0.2 * sIndex + index * 0.05}s ease-out forwards`, opacity: 0 }} />
                                    })}
                                </g>
                            );
                        })}
                    </svg>
                    <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                        {series.map(s => (
                            <div key={s.label} className="flex items-center gap-1.5">
                                <div className={`w-3 h-3 rounded-full ${s.color.replace('stroke', 'bg')}`}></div>
                                <span className="font-medium text-gray-600">{s.label}</span>
                            </div>
                        ))}
                    </div>
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

export default SurveyChart;
