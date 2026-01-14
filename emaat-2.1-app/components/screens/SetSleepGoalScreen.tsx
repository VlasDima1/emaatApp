import React, { FC, useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
// FIX: Update import statements for `Goals`, `ReminderSettings`, and `ChallengeId` to correct paths and resolve module resolution errors.
// FIX: Updated import statements for `Goals` and `ReminderSettings` to correct paths and resolve module resolution errors that arose from breaking a circular dependency.
import type { Goals, ReminderSettings } from '../../goals/types';
import type { ChallengeId } from '../../types';
import { XIcon, BrainCircuitIcon } from '../Icons';
import { GOAL_CONFIG } from '../../goals';
import ConfirmationModal from '../ConfirmationModal';

interface SetGoalScreenProps {
    goalKey: keyof Goals;
    goals: Goals;
    onSave: (goalKey: keyof Goals, goalData: any) => void;
    onClose: () => void;
    onStartChallenge: (challengeId: ChallengeId) => void;
}

const SetGoalScreen: FC<SetGoalScreenProps> = ({ goalKey, goals, onSave, onClose, onStartChallenge }) => {
    const { t } = useLanguage();
    const config = GOAL_CONFIG[goalKey];
    
    // Initialize state from existing goal or config defaults
    const existingGoal = goals[goalKey];
    const [params, setParams] = useState(() => {
        const initialState: Record<string, any> = {};
        config.params.forEach((p: any) => {
            const defaultValue = p.defaultValueKey ? t(p.defaultValueKey) : p.defaultValue;
            initialState[p.id] = existingGoal ? (existingGoal as any)[p.id] : defaultValue;
        });
        return initialState;
    });

    const [reminder, setReminder] = useState<ReminderSettings | null>(
        existingGoal && (existingGoal as any).reminder ? (existingGoal as any).reminder : null
    );

    const [challengeModalOpen, setChallengeModalOpen] = useState(false);

    const handleParamChange = (id: string, value: any) => {
        setParams(prev => ({ ...prev, [id]: value }));
    };

    const handleReminderToggle = () => {
        if (reminder) {
            setReminder(null);
        } else {
            setReminder({ frequency: 'daily', durationWeeks: 4 });
        }
    };

    const handleReminderChange = (field: keyof ReminderSettings, value: any) => {
        if (reminder) {
            setReminder(prev => ({ ...prev!, [field]: value }));
        }
    };

    const handleSubmit = () => {
        const goalData = { ...params };
        if (reminder) {
            goalData.reminder = reminder;
            // If there's a frequency parameter, derive its value from the reminder settings
            if ('frequency' in goalData) {
                if (reminder.frequency === 'daily') {
                    goalData.frequency = 7;
                } else if (Array.isArray(reminder.frequency)) {
                    goalData.frequency = reminder.frequency.length;
                }
            }
        }
        onSave(goalKey, goalData);

        if (config.relatedChallengeId) {
            setChallengeModalOpen(true);
        } else {
            onClose();
        }
    };
    
    const handleChallengeConfirm = () => {
        if (config.relatedChallengeId) {
            onStartChallenge(config.relatedChallengeId);
        }
        setChallengeModalOpen(false);
        onClose();
    };

    const isSubmitDisabled = config.params.some((p: any) => p.required && !params[p.id]);
    const dayKeys = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex flex-col justify-center items-center animate-fade-in">
            {config.relatedChallengeId && (
                <ConfirmationModal
                    isOpen={challengeModalOpen}
                    onClose={onClose}
                    onConfirm={handleChallengeConfirm}
                    title={t('setGoalScreen.challengeModal.title')}
                    message={t('setGoalScreen.challengeModal.message', { goalName: t(config.nameKey), challengeName: t(`challenge.${config.relatedChallengeId}.name`) })}
                    confirmText={t('setGoalScreen.challengeModal.confirm')}
                    cancelText={t('setGoalScreen.challengeModal.cancel')}
                />
            )}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <header className="flex justify-end items-center mb-2">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                </header>
                <h3 className="text-2xl font-bold text-brand-dark text-center mb-4">{t(config.nameKey)}</h3>
                
                {/* Dynamic Parameter Fields */}
                <div className="space-y-4 mb-6">
                    {config.params
                        .filter((p: any) => {
                            // If reminders are on, don't show the separate frequency field
                            if (p.id === 'frequency' && reminder) {
                                return false;
                            }
                             if (p.id === 'daysPerWeek' && reminder) {
                                return false;
                            }
                            return true;
                        })
                        .map((p: any) => (
                        <div key={p.id}>
                            <label htmlFor={p.id} className="block text-sm font-medium text-gray-700">{t(p.labelKey)}</label>
                            {p.type === 'number' && (
                                <div className="flex items-center gap-2 mt-1">
                                    <input id={p.id} type="number" value={params[p.id]} onChange={e => handleParamChange(p.id, parseInt(e.target.value, 10) || 0)} className="block w-full p-2 border border-gray-300 rounded-md shadow-sm" min={p.min} max={p.max} step={p.step} />
                                    {p.unitKey && <span className="text-gray-600">{t(p.unitKey)}</span>}
                                </div>
                            )}
                            {p.type === 'time' && (
                                <input id={p.id} type="time" value={params[p.id]} onChange={e => handleParamChange(p.id, e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            )}
                            {p.type === 'text' && (
                                <input id={p.id} type="text" value={params[p.id]} onChange={e => handleParamChange(p.id, e.target.value)} placeholder={p.placeholderKey ? t(p.placeholderKey) : (p.placeholder || '')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            )}
                            {p.type === 'select' && (
                                <select id={p.id} value={params[p.id]} onChange={e => handleParamChange(p.id, e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                                    {p.options?.map((opt: any) => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}
                                </select>
                            )}
                        </div>
                    ))}
                </div>

                {/* Reminder Settings */}
                <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg border">
                    <label htmlFor="reminder-toggle" className="flex items-center justify-between cursor-pointer">
                        <span className="font-semibold text-gray-800">{t('setGoalScreen.reminders.title')}</span>
                        <div className="relative">
                            <input type="checkbox" id="reminder-toggle" className="sr-only peer" checked={!!reminder} onChange={handleReminderToggle} />
                            <div className="block w-12 h-6 rounded-full bg-gray-300 peer-checked:bg-brand-secondary transition"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform peer-checked:translate-x-6"></div>
                        </div>
                    </label>
                    {reminder && (
                        <div className="space-y-4 pt-4 border-t animate-fade-in">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('setGoalScreen.reminders.frequency')}</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => handleReminderChange('frequency', 'daily')} className={`py-2 rounded-md font-semibold ${reminder.frequency === 'daily' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>{t('setGoalScreen.reminders.daily')}</button>
                                    <button onClick={() => handleReminderChange('frequency', [] as number[])} className={`py-2 rounded-md font-semibold ${Array.isArray(reminder.frequency) ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>{t('setGoalScreen.reminders.specificDays')}</button>
                                </div>
                                {Array.isArray(reminder.frequency) && (
                                    <div className="grid grid-cols-7 gap-1 mt-2">
                                        {dayKeys.map((dayKey, index) => (
                                            <button 
                                                key={index}
                                                onClick={() => {
                                                    // FIX: Add type guard to ensure frequency is an array before using .includes()
                                                    if (Array.isArray(reminder.frequency)) {
                                                        const currentFreq = reminder.frequency;
                                                        const newFreq = currentFreq.includes(index) ? currentFreq.filter(d => d !== index) : [...currentFreq, index];
                                                        handleReminderChange('frequency', newFreq);
                                                    }
                                                }}
                                                className={`aspect-square rounded-full font-bold text-xs ${
                                                    // FIX: Add type guard here as well for class name generation
                                                    Array.isArray(reminder.frequency) && reminder.frequency.includes(index) ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                                                }`}
                                            >{t(`setGoalScreen.reminders.days.${dayKey}`)}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('setGoalScreen.reminders.duration')}</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <input type="number" value={reminder.durationWeeks} onChange={e => handleReminderChange('durationWeeks', parseInt(e.target.value, 10))} className="block w-full p-2 border border-gray-300 rounded-md" min="1" max="12"/>
                                    <span className="text-gray-600">{t('setGoalScreen.reminders.weeks')}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <BrainCircuitIcon className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-indigo-800">{t('setGoalScreen.habitTipTitle')}</h4>
                    <p className="text-sm text-indigo-700 mt-1">{t(config.habitTipKey)}</p>
                </div>
                <button onClick={handleSubmit} disabled={isSubmitDisabled} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400">{t('common.setGoalButton')}</button>
            </div>
        </div>
    );
};

export default SetGoalScreen;
