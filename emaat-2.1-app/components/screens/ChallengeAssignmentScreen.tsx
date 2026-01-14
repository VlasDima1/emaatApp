import React, { FC, useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity, DailyAssignmentData } from '../../types';
import { XIcon, PencilIcon } from '../Icons';
import { stopRokenChallengeContent } from '../../challenges/stopRokenChallenge/content';

interface ChallengeAssignmentScreenProps {
    activity: ChallengeActivity;
    onComplete: (activity: ChallengeActivity) => void;
    onClose: () => void;
}

const ChallengeAssignmentScreen: FC<ChallengeAssignmentScreenProps> = ({ activity, onComplete, onClose }) => {
    const { t, language } = useLanguage();
    const [reflection, setReflection] = useState('');

    const content = useMemo(() => {
        if (activity.challengeId === 'stopRokenChallenge') {
            const dayContent = stopRokenChallengeContent[activity.day as keyof typeof stopRokenChallengeContent];
            return dayContent ? dayContent[language] : null;
        }
        return null;
    }, [activity.challengeId, activity.day, language]);

    const handleSubmit = () => {
        const updatedActivity: ChallengeActivity = {
            ...activity,
            status: 'completed',
            completedAt: new Date(),
            data: {
                reflection: reflection.trim(),
            } as DailyAssignmentData
        };
        onComplete(updatedActivity);
    };
    
    if (!content || !content.assignment) {
         return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
                <p>Assignment not found for this day.</p>
                <button onClick={onClose}>Close</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex flex-col justify-center items-center animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <header className="flex justify-end items-center mb-2">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                </header>
                <div className="text-center">
                     <div className="mx-auto w-20 h-20 mb-4 p-3 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                        <PencilIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-dark">{t('challenge.stopRokenChallenge.dailyAssignment.title')}</h3>
                    <p className="text-gray-500 mt-1">{t('challenge.braintainment.day', { day: activity.day })}</p>
                </div>
                
                <div className="my-6 p-4 bg-gray-50 rounded-lg border">
                    <p className="font-semibold text-gray-800">{t('challenge.stopRokenChallenge.dailyAssignment.title')}:</p>
                    <p className="text-gray-700 mt-2 whitespace-pre-line">{content.assignment}</p>
                </div>

                <div>
                    <label htmlFor="reflection-input" className="block text-sm font-medium text-gray-700 mb-2 text-center">{t('addMemoryScreen.textPlaceholder')}</label>
                    <textarea 
                        id="reflection-input"
                        value={reflection} 
                        onChange={(e) => setReflection(e.target.value)} 
                        rows={4} 
                        placeholder={t('addMemoryScreen.textPlaceholder')} 
                        className="w-full p-2 border border-gray-300 rounded-lg mb-2 focus:ring-brand-primary focus:border-brand-primary" 
                    />
                </div>

                <button onClick={handleSubmit} className="w-full mt-4 py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    {t('common.done')}
                </button>
            </div>
        </div>
    );
};

export default ChallengeAssignmentScreen;
