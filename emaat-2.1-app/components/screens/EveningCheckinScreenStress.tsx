import React, { FC, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity, StressEveningCheckinData } from '../../types';
import { XIcon, HeartPulseIcon } from '../Icons';

interface EveningCheckinScreenStressProps {
    activity: ChallengeActivity;
    onComplete: (activity: ChallengeActivity) => void;
    onClose: () => void;
}

const EveningCheckinScreenStress: FC<EveningCheckinScreenStressProps> = ({ activity, onComplete, onClose }) => {
    const { t } = useLanguage();
    const [pulseBefore, setPulseBefore] = useState('');
    const [pulseAfter, setPulseAfter] = useState('');
    const [relaxationActivity, setRelaxationActivity] = useState('');

    const handleSubmit = () => {
        const updatedActivity: ChallengeActivity = {
            ...activity,
            status: 'completed',
            completedAt: new Date(),
            data: {
                pulseBefore: parseInt(pulseBefore, 10) || 0,
                pulseAfter: parseInt(pulseAfter, 10) || 0,
                relaxationActivity: relaxationActivity.trim(),
            } as StressEveningCheckinData
        };
        onComplete(updatedActivity);
    };

    const isSubmitDisabled = !pulseBefore || !pulseAfter || !relaxationActivity.trim();

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex flex-col justify-center items-center animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <header className="flex justify-end items-center mb-2">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                </header>
                <div className="text-center">
                     <div className="mx-auto w-20 h-20 mb-4 p-3 rounded-full bg-teal-100 text-teal-500 flex items-center justify-center">
                        <HeartPulseIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-dark">{t('challenge.stressChallenge.eveningCheckin.title')}</h3>
                    <p className="text-gray-500 mt-1 px-4">{t('challenge.stressChallenge.eveningCheckin.instruction')}</p>
                     <div className="mt-4 text-xs text-left text-gray-600 bg-gray-50 p-3 rounded-md border">
                        <p className="font-semibold">{t('challenge.stressChallenge.howToMeasurePulse.title')}</p>
                        <p>{t('challenge.stressChallenge.howToMeasurePulse.instruction')}</p>
                    </div>
                </div>
                
                <div className="space-y-6 my-8">
                     <div>
                        <label htmlFor="activity-input" className="block text-center text-sm font-medium text-gray-700 mb-2">{t('challenge.stressChallenge.eveningCheckin.activityLabel')}</label>
                        <input 
                            id="activity-input"
                            type="text"
                            value={relaxationActivity}
                            onChange={e => setRelaxationActivity(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg text-center"
                            placeholder={t('challenge.stressChallenge.eveningCheckin.activityPlaceholder')}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="pulse-before-evening" className="block text-center text-sm font-medium text-gray-700 mb-2">{t('challenge.stressChallenge.morningCheckin.pulseBeforeLabel')}</label>
                            <input 
                                id="pulse-before-evening"
                                type="number"
                                value={pulseBefore}
                                onChange={e => setPulseBefore(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg text-center"
                                placeholder="e.g., 75"
                            />
                        </div>
                        <div>
                            <label htmlFor="pulse-after-evening" className="block text-center text-sm font-medium text-gray-700 mb-2">{t('challenge.stressChallenge.morningCheckin.pulseAfterLabel')}</label>
                            <input 
                                id="pulse-after-evening"
                                type="number"
                                value={pulseAfter}
                                onChange={e => setPulseAfter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg text-center"
                                placeholder="e.g., 68"
                            />
                        </div>
                    </div>
                </div>

                <button onClick={handleSubmit} disabled={isSubmitDisabled} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors">
                    {t('challenge.stressChallenge.eveningCheckin.saveButton')}
                </button>
            </div>
        </div>
    );
};

export default EveningCheckinScreenStress;