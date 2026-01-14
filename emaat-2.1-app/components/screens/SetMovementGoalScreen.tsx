import React, { FC, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { MovementChallengeGoal } from '../../types';
import { XIcon, BrainCircuitIcon } from '../Icons';

interface SetMovementGoalScreenProps {
    goal?: MovementChallengeGoal;
    onGoalSet: (goal: MovementChallengeGoal) => void;
    onClose: () => void;
}

const SetMovementGoalScreen: FC<SetMovementGoalScreenProps> = ({ goal, onGoalSet, onClose }) => {
    const { t } = useLanguage();
    const [steps, setSteps] = useState(goal?.steps || 6000);

    const handleSubmit = () => {
        onGoalSet({ steps });
    };

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex flex-col justify-center items-center animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <header className="flex justify-end items-center mb-2"><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button></header>
                <h3 className="text-2xl font-bold text-brand-dark text-center mb-4">{t('challenge.beweegChallenge.setGoal.title')}</h3>
                <div className="space-y-4 mb-6">
                    <div>
                        <label htmlFor="steps-input" className="block text-sm font-medium text-gray-700">{t('challenge.beweegChallenge.setGoal.stepsLabel')}</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input 
                                id="steps-input" 
                                type="number" 
                                value={steps} 
                                onChange={e => setSteps(parseInt(e.target.value, 10) || 0)} 
                                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                step="500"
                            />
                            <span className="text-gray-600">{t('addMemoryScreen.steps')}</span>
                        </div>
                    </div>
                </div>
                <div className="text-center mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <BrainCircuitIcon className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-indigo-800">{t('setGoalScreen.habitTipTitle')}</h4>
                    <p className="text-sm text-indigo-700 mt-1">{t('challenge.beweegChallenge.setGoal.habitTipBody')}</p>
                </div>
                <button onClick={handleSubmit} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">{t('common.setGoalButton')}</button>
            </div>
        </div>
    );
};

export default SetMovementGoalScreen;