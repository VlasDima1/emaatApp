import React, { FC } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { BMICardInfo, Gender } from '../types';
import { ScaleIcon } from './Icons';

interface BMICardProps {
    info: BMICardInfo;
    gender: Gender;
}

const BMICard: FC<BMICardProps> = ({ info, gender }) => {
    const { t } = useLanguage();

    const categoryColors: Record<BMICardInfo['category'], { bg: string; border: string; text: string }> = {
        underweight: { bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-800' },
        healthy: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800' },
        overweight: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' },
        obese: { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-800' },
    };

    const colors = categoryColors[info.category];

    return (
        <li className={`p-4 rounded-lg shadow-sm ${colors.bg} border-l-4 ${colors.border}`}>
            <div className="flex items-start">
                <div className="mt-1 p-3 rounded-full bg-white/60 text-teal-500">
                    <ScaleIcon className="w-6 h-6" />
                </div>
                <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-brand-dark">{t('bmiCard.title')}</p>
                            <p className="text-sm text-gray-500">{new Date(info.timestamp).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-600">{t('bmiCard.yourBMI')}</p>
                            <p className={`font-bold text-2xl ${colors.text}`}>{info.bmi.toFixed(1)}</p>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200/50">
                        <div className="flex justify-between items-baseline mb-1">
                            <span className={`font-semibold text-sm ${colors.text}`}>{t(`bmiCard.categories.${info.category}`)}</span>
                        </div>
                        <div className="space-y-2">
                            <p className={`text-xs ${colors.text}`}>
                                <span className="font-bold">Advice:</span> {t(`bmiCard.advice.${info.category}`)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default BMICard;