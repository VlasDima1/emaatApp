import React, { FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity, MovementMorningCheckinData } from '../../types';
import { XIcon, DumbbellIcon } from '../Icons';

interface MorningCheckinScreenMovementProps {
    activity: ChallengeActivity;
    onComplete: (activity: ChallengeActivity) => void;
    onClose: () => void;
}

const MorningCheckinScreenMovement: FC<MorningCheckinScreenMovementProps> = ({ activity, onComplete, onClose }) => {
    const { t } = useLanguage();

    const handleSubmit = (didExercise: boolean) => {
        const updatedActivity: ChallengeActivity = {
            ...activity,
            status: 'completed',
            completedAt: new Date(),
            data: {
                didExercise,
            } as MovementMorningCheckinData
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
                     <div className="mx-auto w-20 h-20 mb-4 p-3 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center">
                        <DumbbellIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-dark">{t('challenge.beweegChallenge.morningCheckin.title')}</h3>
                    <p className="text-gray-500 mt-2 px-4">{t('challenge.beweegChallenge.morningCheckin.subtitle')}</p>
                </div>
                
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button onClick={() => handleSubmit(true)} className="w-full py-3 px-4 bg-brand-secondary text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors">
                        {t('common.yes')}
                    </button>
                    <button onClick={() => handleSubmit(false)} className="w-full py-3 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                        {t('common.no')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MorningCheckinScreenMovement;