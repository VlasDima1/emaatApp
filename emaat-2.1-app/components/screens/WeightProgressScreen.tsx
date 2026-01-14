import React, { FC, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { WeightMeasurement, WeightGoal, UserInfo, BMICategory, ChallengeId } from '../../types';
import { XIcon, ScaleIcon, DumbbellIcon, UtensilsIcon } from '../Icons';

interface WeightProgressScreenProps {
    newMeasurement: WeightMeasurement;
    goal: WeightGoal;
    userInfo: UserInfo;
    onStartChallenge: (challengeId: ChallengeId) => void;
    onClose: () => void;
}

const WeightProgressScreen: FC<WeightProgressScreenProps> = ({ newMeasurement, goal, userInfo, onStartChallenge, onClose }) => {
    const { t } = useLanguage();

    const {
        progressPercentage,
        weightChange,
        isLossGoal,
        newBmi,
        bmiCategory,
        motivation,
        advice,
        challengeSuggestion
    } = useMemo(() => {
        const totalGoal = goal.targetWeight - goal.startWeight;
        const achieved = newMeasurement.value - goal.startWeight;
        const progress = totalGoal !== 0 ? Math.min(Math.max((achieved / totalGoal) * 100, 0), 100) : 100;

        const change = newMeasurement.value - goal.startWeight;
        const lossGoal = totalGoal < 0;

        let bmi: number | null = null;
        let category: BMICategory = 'healthy';
        if (userInfo.height) {
            const heightInMeters = userInfo.height / 100;
            bmi = newMeasurement.value / (heightInMeters * heightInMeters);
            if (bmi < 18.5) category = 'underweight';
            else if (bmi >= 25 && bmi < 30) category = 'overweight';
            else if (bmi >= 30) category = 'obese';
        }
        
        // --- Determine Motivation & Advice ---
        let mot: string;
        let adv: string;
        let challenge: { id: ChallengeId, textKey: string, icon: React.ComponentType<{className?: string}> } | null = null;

        if ((lossGoal && change < 0) || (!lossGoal && change > 0)) { // Making progress
            mot = t('weightProgressScreen.motivation.positive');
            adv = t('weightProgressScreen.advice.positive');
            challenge = { id: 'beweegChallenge', textKey: 'weightProgressScreen.challenge.movement', icon: DumbbellIcon };
        } else if (Math.abs(change) < 0.2) { // Stagnated
            mot = t('weightProgressScreen.motivation.stagnated');
            adv = t('weightProgressScreen.advice.stagnated');
            challenge = { id: 'voedingChallenge', textKey: 'weightProgressScreen.challenge.nutrition', icon: UtensilsIcon };
        } else { // Regressed
            mot = t('weightProgressScreen.motivation.negative');
            adv = t('weightProgressScreen.advice.negative');
            challenge = { id: 'voedingChallenge', textKey: 'weightProgressScreen.challenge.nutrition', icon: UtensilsIcon };
        }

        return {
            progressPercentage: progress,
            weightChange: change,
            isLossGoal: lossGoal,
            newBmi: bmi,
            bmiCategory: category,
            motivation: mot,
            advice: adv,
            challengeSuggestion: challenge
        };

    }, [newMeasurement, goal, userInfo.height, t]);

    const progressColor = progressPercentage > 80 ? 'bg-emerald-500' : progressPercentage > 40 ? 'bg-sky-500' : 'bg-amber-500';

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex flex-col justify-center items-center animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <header className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-brand-dark">{t('weightProgressScreen.title')}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                </header>

                <div className="space-y-6">
                    {/* Progress Bar */}
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">{t('weightProgressScreen.progressTitle')}</p>
                        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                            <div className={`${progressColor} h-4 rounded-full transition-all duration-500`} style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                           {t('weightProgressScreen.goal', { start: goal.startWeight, current: newMeasurement.value, target: goal.targetWeight })}
                        </p>
                    </div>

                    {/* New BMI */}
                    {newBmi && (
                        <div className="text-center p-4 bg-gray-50 rounded-lg border">
                             <p className="text-sm font-medium text-gray-600">{t('weightProgressScreen.newBmiTitle')}</p>
                             <p className="text-4xl font-bold text-brand-dark mt-1">{newBmi.toFixed(1)}</p>
                             <p className="text-sm font-semibold text-gray-700">{t(`bmiCard.categories.${bmiCategory}`)}</p>
                        </div>
                    )}
                    
                    {/* Motivation & Advice */}
                    <div className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg">
                        <h4 className="font-bold text-lg text-indigo-800 mb-2">{motivation}</h4>
                        <p className="text-sm text-indigo-700">{advice}</p>
                    </div>

                    {/* Challenge Suggestion */}
                    {challengeSuggestion && (
                        <div className="text-center">
                            <h4 className="font-semibold text-gray-700 mb-3">{t('weightProgressScreen.suggestionTitle')}</h4>
                             <button onClick={() => onStartChallenge(challengeSuggestion.id)} className="w-full flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border">
                                <div className="p-3 rounded-full bg-gray-100 text-brand-primary">
                                    <challengeSuggestion.icon className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-brand-primary">{t(`challenge.${challengeSuggestion.id}.name`)}</p>
                                    <p className="text-sm text-gray-600">{t(challengeSuggestion.textKey)}</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <button onClick={onClose} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700">
                        {t('common.closeButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WeightProgressScreen;
