import React, { FC, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity, MovementEveningCheckinData, MovementChallengeGoal } from '../../types';
import { XIcon, ActivityIcon } from '../Icons';

interface EveningCheckinScreenMovementProps {
    activity: ChallengeActivity;
    goal?: MovementChallengeGoal;
    onComplete: (activity: ChallengeActivity) => void;
    onClose: () => void;
}

const EveningCheckinScreenMovement: FC<EveningCheckinScreenMovementProps> = ({ activity, goal, onComplete, onClose }) => {
    const { t } = useLanguage();
    const [steps, setSteps] = useState(goal?.steps || 6000);

    const handleSubmit = () => {
        const updatedActivity: ChallengeActivity = {
            ...activity,
            status: 'completed',
            completedAt: new Date(),
            data: {
                steps,
            } as MovementEveningCheckinData
        };
        onComplete(updatedActivity);
    };

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex flex-col justify-center items-center animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <header className="flex justify-end items-center mb-2">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                </header>
                <div className="text-center">
                    <div className="mx-auto w-20 h-20 mb-4 p-3 rounded-full bg-lime-100 text-lime-600 flex items-center justify-center">
                        <ActivityIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-dark">{t('challenge.beweegChallenge.eveningCheckin.title')}</h3>
                    <p className="text-gray-500 mt-1">{t('challenge.beweegChallenge.eveningCheckin.subtitle')}</p>
                    {goal && (
                        <p className="text-sm text-gray-500 mt-1">{t('challenge.beweegChallenge.eveningCheckin.goal', { count: goal.steps })}</p>
                    )}
                </div>
                
                <div className="my-8">
                    <label htmlFor="steps-input" className="block text-center text-sm font-medium text-gray-700 mb-2">{t('challenge.beweegChallenge.eveningCheckin.stepsLabel')}</label>
                    <div className="relative">
                        <input 
                            id="steps-input"
                            type="number" 
                            value={steps} 
                            onChange={e => setSteps(parseInt(e.target.value, 10) || 0)} 
                            className="w-full p-3 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
                            step="100"
                        />
                    </div>
                </div>

                <button onClick={handleSubmit} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    {t('common.saveChanges')}
                </button>
            </div>
        </div>
    );
};

export default EveningCheckinScreenMovement;