import React, { FC, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { XIcon, CheckCircleIcon, ExclamationTriangleIcon } from './Icons';

interface WeightGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    currentWeight: number;
    targetWeight: number;
    targetDate: string;
}

const WeightGoalModal: FC<WeightGoalModalProps> = ({ isOpen, onClose, onConfirm, currentWeight, targetWeight, targetDate }) => {
    const { t } = useLanguage();

    const { weeklyChange, isLoss, isGain, isHealthy } = useMemo(() => {
        const totalChange = targetWeight - currentWeight;
        const weeks = (new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 7);

        if (weeks <= 0) return { weeklyChange: 0, isLoss: false, isGain: false, isHealthy: false };

        const changePerWeek = Math.abs(totalChange / weeks);
        const loss = totalChange < 0;
        const gain = totalChange > 0;
        
        let healthy = false;
        if (loss && changePerWeek >= 0.25 && changePerWeek <= 1.0) {
            healthy = true;
        } else if (gain && changePerWeek >= 0.25 && changePerWeek <= 0.75) {
            healthy = true;
        }

        return { weeklyChange: changePerWeek, isLoss: loss, isGain: gain, isHealthy: healthy };
    }, [currentWeight, targetWeight, targetDate]);

    if (!isOpen) return null;

    const renderGuidance = () => {
        if (isLoss) {
            return (
                <div>
                    <h4 className="font-bold text-lg text-brand-dark flex items-center gap-2">
                        <CheckCircleIcon className="w-6 h-6 text-emerald-500" />
                        {t('setGoalScreen.weightGoalModal.lossTitle')}
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">{t('setGoalScreen.weightGoalModal.lossGuideline')}</p>
                    <div className="mt-4 space-y-3 text-xs bg-gray-50 p-3 rounded-md">
                        <p><strong className="text-emerald-700">{t('setGoalScreen.weightGoalModal.healthyLossWhyTitle')}</strong> {t('setGoalScreen.weightGoalModal.healthyLossWhyBody')}</p>
                        <div>
                            <p className="font-semibold">{t('setGoalScreen.weightGoalModal.calorieDeficitTitle')}</p>
                            <ul className="list-disc list-inside ml-2">
                                <li>{t('setGoalScreen.weightGoalModal.calorieDeficitSlow')}</li>
                                <li>{t('setGoalScreen.weightGoalModal.calorieDeficitMedium')}</li>
                                <li>{t('setGoalScreen.weightGoalModal.calorieDeficitFast')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }
        if (isGain) {
            return (
                <div>
                    <h4 className="font-bold text-lg text-brand-dark flex items-center gap-2">
                        <CheckCircleIcon className="w-6 h-6 text-emerald-500" />
                        {t('setGoalScreen.weightGoalModal.gainTitle')}
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">{t('setGoalScreen.weightGoalModal.gainGuideline')}</p>
                     <div className="mt-4 space-y-3 text-xs bg-gray-50 p-3 rounded-md">
                        <p><strong className="text-emerald-700">{t('setGoalScreen.weightGoalModal.healthyGainWhyTitle')}</strong> {t('setGoalScreen.weightGoalModal.healthyGainWhyBody')}</p>
                         <div>
                            <p className="font-semibold">{t('setGoalScreen.weightGoalModal.calorieSurplusTitle')}</p>
                            <ul className="list-disc list-inside ml-2">
                                <li>{t('setGoalScreen.weightGoalModal.calorieSurplusSlow')}</li>
                                <li>{t('setGoalScreen.weightGoalModal.calorieSurplusFast')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                <h3 className="text-xl font-bold text-brand-dark mb-4">{t('setGoalScreen.weightGoalModal.title')}</h3>
                
                <div className={`p-4 rounded-lg mb-4 text-center ${isHealthy ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                    <div className="flex items-center justify-center gap-2">
                         {isHealthy 
                            ? <CheckCircleIcon className="w-5 h-5" /> 
                            : <ExclamationTriangleIcon className="w-5 h-5" />
                         }
                        <p className="font-semibold">{isHealthy ? t('setGoalScreen.weightGoalModal.healthyPace') : t('setGoalScreen.weightGoalModal.ambitiousPace')}</p>
                    </div>
                    <p className="font-bold text-2xl mt-1">{weeklyChange.toFixed(2)} kg / {t('setGoalScreen.weightGoalModal.week')}</p>
                </div>

                <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-4">
                    {renderGuidance()}
                     <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
                        <p className="font-semibold">{t('setGoalScreen.weightGoalModal.nuancesTitle')}</p>
                        <ul className="list-disc list-inside ml-2">
                            <li>{t('setGoalScreen.weightGoalModal.nuance1')}</li>
                            <li>{t('setGoalScreen.weightGoalModal.nuance2')}</li>
                            <li>{t('setGoalScreen.weightGoalModal.nuance3')}</li>
                            <li>{t('setGoalScreen.weightGoalModal.nuance4')}</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button onClick={onClose} className="w-full py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                        {t('setGoalScreen.weightGoalModal.cancel')}
                    </button>
                    <button onClick={onConfirm} className="w-full py-2 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700">
                        {t('setGoalScreen.weightGoalModal.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WeightGoalModal;