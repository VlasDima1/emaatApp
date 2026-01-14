import React, { FC, useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity, MorningCheckinData } from '../../types';
import { XIcon, StarIcon, ClockIcon } from '../Icons';

interface MorningCheckinScreenProps {
    activity: ChallengeActivity;
    onComplete: (activity: ChallengeActivity) => void;
    onClose: () => void;
}

const StarRating: FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => {
    return (
        <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                    <StarIcon
                        className={`w-10 h-10 transition-colors ${
                            star <= rating ? 'text-amber-400' : 'text-gray-300'
                        }`}
                    />
                </button>
            ))}
        </div>
    );
};

const MorningCheckinScreen: FC<MorningCheckinScreenProps> = ({ activity, onComplete, onClose }) => {
    const { t, language } = useLanguage();
    const [duration, setDuration] = useState({ hours: 8, minutes: 0 });
    const [quality, setQuality] = useState(3);
    const [isGateOpen, setIsGateOpen] = useState(false);

    const isEarly = useMemo(() => new Date() < new Date(activity.scheduledAt), [activity.scheduledAt]);

    const handleSubmit = () => {
        const updatedActivity: ChallengeActivity = {
            ...activity,
            status: 'completed',
            completedAt: new Date(),
            data: {
                sleepDuration: duration,
                sleepQuality: quality,
            } as MorningCheckinData
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
                    <h3 className="text-2xl font-bold text-brand-dark">{t('challenge.morningCheckin.title')}</h3>
                    <p className="text-gray-500 mt-1">{t('challenge.morningCheckin.subtitle')}</p>
                </div>
                
                <div className="space-y-6 my-8">
                    <div>
                        <label className="block text-center text-sm font-medium text-gray-700 mb-2">{t('challenge.morningCheckin.durationLabel')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={duration.hours} 
                                    onChange={e => setDuration(d => ({ ...d, hours: parseInt(e.target.value, 10) || 0 }))} 
                                    className="w-full p-2 border border-gray-300 rounded-lg text-center" 
                                    min="0"
                                    max="23"
                                />
                                <span className="absolute right-3 top-2 text-gray-500 text-sm">{t('addMemoryScreen.hours')}</span>
                            </div>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={duration.minutes} 
                                    onChange={e => setDuration(d => ({ ...d, minutes: parseInt(e.target.value, 10) || 0 }))} 
                                    className="w-full p-2 border border-gray-300 rounded-lg text-center" 
                                    step="5"
                                    min="0"
                                    max="59"
                                />
                                <span className="absolute right-3 top-2 text-gray-500 text-sm">{t('addMemoryScreen.minutesAbbr')}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-center text-sm font-medium text-gray-700 mb-2">{t('challenge.morningCheckin.qualityLabel')}</label>
                        <StarRating rating={quality} setRating={setQuality} />
                    </div>
                </div>

                <button onClick={handleSubmit} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    {t('challenge.morningCheckin.saveButton')}
                </button>
            </div>
        </div>
    );
};

export default MorningCheckinScreen;