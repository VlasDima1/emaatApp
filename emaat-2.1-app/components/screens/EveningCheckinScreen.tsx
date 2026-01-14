import React, { FC, useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity, EveningCheckinData } from '../../types';
import { XIcon, ClockIcon } from '../Icons';
import { EVENING_CHECKIN_QUESTIONS } from '../../challenges/sleepChallenge/content/index';


interface EveningCheckinScreenProps {
    activity: ChallengeActivity;
    onComplete: (activity: ChallengeActivity) => void;
    onClose: () => void;
}

const EveningCheckinScreen: FC<EveningCheckinScreenProps> = ({ activity, onComplete, onClose }) => {
    const { t, language } = useLanguage();
    const [answers, setAnswers] = useState<Record<string, boolean>>(() => 
        EVENING_CHECKIN_QUESTIONS.reduce((acc, q) => ({...acc, [q]: false}), {})
    );
    const [isGateOpen, setIsGateOpen] = useState(false);

    const isEarly = useMemo(() => new Date() < new Date(activity.scheduledAt), [activity.scheduledAt]);

    const handleToggle = (questionKey: string) => {
        setAnswers(prev => ({ ...prev, [questionKey]: !prev[questionKey] }));
    };

    const handleSubmit = () => {
        const updatedActivity: ChallengeActivity = {
            ...activity,
            status: 'completed',
            completedAt: new Date(),
            data: answers as EveningCheckinData,
        };
        onComplete(updatedActivity);
    };

    const formattedDateTime = new Intl.DateTimeFormat(language, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(activity.scheduledAt));

    if (isEarly && !isGateOpen) {
        return (
            <div className="min-h-screen bg-brand-light font-sans p-4 flex flex-col justify-center items-center animate-fade-in">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                    <header className="flex justify-end items-center mb-2">
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                    </header>
                    <div className="text-center">
                        <div className="mx-auto w-20 h-20 mb-4 p-3 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center">
                            <ClockIcon className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-bold text-brand-dark">{t('challenge.earlyAccess.title')}</h3>
                        <p className="text-gray-600 mt-2 px-4">{t('challenge.earlyAccess.message', { dateTime: formattedDateTime })}</p>
                    </div>
                    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button onClick={onClose} className="w-full py-3 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                            {t('challenge.earlyAccess.goBackButton')}
                        </button>
                        <button onClick={() => setIsGateOpen(true)} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                            {t('challenge.earlyAccess.completeButton')}
                        </button>
                    </div>
                </div>
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
                    <h3 className="text-2xl font-bold text-brand-dark">{t('challenge.eveningCheckin.title')}</h3>
                    <p className="text-gray-500 mt-1">{t('challenge.eveningCheckin.subtitle')}</p>
                </div>

                <div className="space-y-3 my-8">
                    {EVENING_CHECKIN_QUESTIONS.map(qKey => (
                         <label key={qKey} htmlFor={`check-${qKey}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border cursor-pointer">
                            <span className="block text-sm text-gray-800 font-medium pr-4">{t(`challenge.eveningCheckin.${qKey}`)}</span>
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    id={`check-${qKey}`} 
                                    className="sr-only peer" 
                                    checked={answers[qKey]} 
                                    onChange={() => handleToggle(qKey)} 
                                />
                                <div className="block w-12 h-6 rounded-full bg-gray-300 peer-checked:bg-brand-secondary transition"></div>
                                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform peer-checked:translate-x-6"></div>
                            </div>
                        </label>
                    ))}
                </div>

                <button onClick={handleSubmit} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    {t('challenge.eveningCheckin.saveButton')}
                </button>
            </div>
        </div>
    );
};

export default EveningCheckinScreen;