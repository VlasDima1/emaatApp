import React, { FC, useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity, StressMorningCheckinData } from '../../types';
import { XIcon, HeartPulseIcon } from '../Icons';

interface MorningCheckinScreenStressProps {
    activity: ChallengeActivity;
    onComplete: (activity: ChallengeActivity) => void;
    onClose: () => void;
}

const MorningCheckinScreenStress: FC<MorningCheckinScreenStressProps> = ({ activity, onComplete, onClose }) => {
    const { t } = useLanguage();
    const [pulseBefore, setPulseBefore] = useState('');
    const [pulseAfter, setPulseAfter] = useState('');
    const [timer, setTimer] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    // FIX: Changed NodeJS.Timeout to number for browser compatibility as setTimeout in browser returns a number.
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isTimerRunning && timer > 0) {
            timerRef.current = window.setTimeout(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0) {
            setIsTimerRunning(false);
            // Optionally play a sound
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isTimerRunning, timer]);

    const handleStartTimer = () => {
        setTimer(60);
        setIsTimerRunning(true);
    };

    const handleSubmit = () => {
        const updatedActivity: ChallengeActivity = {
            ...activity,
            status: 'completed',
            completedAt: new Date(),
            data: {
                pulseBefore: parseInt(pulseBefore, 10) || 0,
                pulseAfter: parseInt(pulseAfter, 10) || 0,
            } as StressMorningCheckinData
        };
        onComplete(updatedActivity);
    };

    const isSubmitDisabled = !pulseBefore || !pulseAfter;
    const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
    const seconds = (timer % 60).toString().padStart(2, '0');

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
                    <h3 className="text-2xl font-bold text-brand-dark">{t('challenge.stressChallenge.morningCheckin.title')}</h3>
                    <p className="text-gray-500 mt-1 px-4">{t('challenge.stressChallenge.morningCheckin.instruction')}</p>
                    <div className="mt-4 text-xs text-left text-gray-600 bg-gray-50 p-3 rounded-md border">
                        <p className="font-semibold">{t('challenge.stressChallenge.howToMeasurePulse.title')}</p>
                        <p>{t('challenge.stressChallenge.howToMeasurePulse.instruction')}</p>
                    </div>
                </div>
                
                <div className="space-y-6 my-8">
                    <div>
                        <label htmlFor="pulse-before" className="block text-center text-sm font-medium text-gray-700 mb-2">{t('challenge.stressChallenge.morningCheckin.pulseBeforeLabel')}</label>
                        <input 
                            id="pulse-before"
                            type="number"
                            value={pulseBefore}
                            onChange={e => setPulseBefore(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg text-center"
                            placeholder="e.g., 70"
                        />
                    </div>
                    
                    <div className="text-center">
                        <div className="font-mono text-5xl font-bold text-brand-dark my-4">{minutes}:{seconds}</div>
                        <button onClick={handleStartTimer} disabled={isTimerRunning} className="w-full py-3 px-4 bg-brand-secondary text-white font-semibold rounded-lg hover:bg-emerald-600 disabled:bg-gray-400 transition-colors">
                            {isTimerRunning ? t('challenge.stressChallenge.morningCheckin.timerRunning') : t('challenge.stressChallenge.morningCheckin.timerButton')}
                        </button>
                    </div>

                    <div>
                        <label htmlFor="pulse-after" className="block text-center text-sm font-medium text-gray-700 mb-2">{t('challenge.stressChallenge.morningCheckin.pulseAfterLabel')}</label>
                        <input 
                            id="pulse-after"
                            type="number"
                            value={pulseAfter}
                            onChange={e => setPulseAfter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg text-center"
                            placeholder="e.g., 62"
                        />
                    </div>
                </div>

                <button onClick={handleSubmit} disabled={isSubmitDisabled} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors">
                    {t('challenge.stressChallenge.morningCheckin.saveButton')}
                </button>
            </div>
        </div>
    );
};

export default MorningCheckinScreenStress;