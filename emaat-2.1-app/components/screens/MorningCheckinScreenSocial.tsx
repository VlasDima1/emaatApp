import React, { FC, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity, SocialMorningCheckinData } from '../../types';
import { XIcon, UsersIcon } from '../Icons';
import Slider from '../Slider';

interface MorningCheckinScreenSocialProps {
    activity: ChallengeActivity;
    onComplete: (activity: ChallengeActivity) => void;
    onClose: () => void;
}

const MorningCheckinScreenSocial: FC<MorningCheckinScreenSocialProps> = ({ activity, onComplete, onClose }) => {
    const { t } = useLanguage();
    const [emotionalState, setEmotionalState] = useState(5);
    const [socialEnergy, setSocialEnergy] = useState(5);
    const [plannedAction, setPlannedAction] = useState('sayHello');
    const [otherActionText, setOtherActionText] = useState('');

    const actionOptions = [
        { key: 'sayHello', textKey: 'challenge.socialChallenge.morningCheckin.actionOption1' },
        { key: 'askQuestion', textKey: 'challenge.socialChallenge.morningCheckin.actionOption2' },
        { key: 'startConversation', textKey: 'challenge.socialChallenge.morningCheckin.actionOption3' },
        { key: 'sendMessage', textKey: 'challenge.socialChallenge.morningCheckin.actionOption4' },
    ];

    const handleSubmit = () => {
        const data: SocialMorningCheckinData = {
            emotionalState,
            socialEnergy,
            plannedAction,
        };
        if (plannedAction === 'other') {
            data.otherActionText = otherActionText;
        }
        
        const updatedActivity: ChallengeActivity = {
            ...activity,
            status: 'completed',
            completedAt: new Date(),
            data,
        };
        onComplete(updatedActivity);
    };

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex flex-col justify-center items-center animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <header className="flex justify-end items-center mb-2">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                </header>
                <div className="text-center mb-6">
                     <div className="mx-auto w-20 h-20 mb-4 p-3 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center">
                        <UsersIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-dark">{t('challenge.socialChallenge.morningCheckin.title')}</h3>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-center text-sm font-medium text-gray-700 mb-2">{t('challenge.socialChallenge.morningCheckin.emotionalStateLabel')}</label>
                        <Slider value={emotionalState} onChange={setEmotionalState} minLabel={t('challenge.socialChallenge.eveningCheckin.negative')} maxLabel={t('challenge.socialChallenge.eveningCheckin.positive')} />
                    </div>
                     <div>
                        <label className="block text-center text-sm font-medium text-gray-700 mb-2">{t('challenge.socialChallenge.morningCheckin.socialEnergyLabel')}</label>
                        <Slider value={socialEnergy} onChange={setSocialEnergy} minLabel={t('challenge.socialChallenge.morningCheckin.low')} maxLabel={t('challenge.socialChallenge.morningCheckin.high')} />
                    </div>
                    <div>
                        <label className="block text-center text-sm font-medium text-gray-700 mb-2">{t('challenge.socialChallenge.morningCheckin.plannedActionLabel')}</label>
                        <div className="space-y-2">
                            {actionOptions.map(opt => (
                                <label key={opt.key} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${plannedAction === opt.key ? 'bg-indigo-50 border-indigo-400' : 'bg-gray-50 border-gray-200'}`}>
                                    <input type="radio" name="social-action" value={opt.key} checked={plannedAction === opt.key} onChange={() => setPlannedAction(opt.key)} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"/>
                                    <span className="ml-3 text-sm font-medium text-gray-700">{t(opt.textKey)}</span>
                                </label>
                            ))}
                             <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${plannedAction === 'other' ? 'bg-indigo-50 border-indigo-400' : 'bg-gray-50 border-gray-200'}`}>
                                <input type="radio" name="social-action" value="other" checked={plannedAction === 'other'} onChange={() => setPlannedAction('other')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"/>
                                <span className="ml-3 text-sm font-medium text-gray-700">{t('common.otherOption')}</span>
                            </label>
                            {plannedAction === 'other' && (
                                <input
                                    type="text"
                                    value={otherActionText}
                                    onChange={e => setOtherActionText(e.target.value)}
                                    placeholder={t('challenge.socialChallenge.morningCheckin.otherPlaceholder')}
                                    className="mt-2 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <button onClick={handleSubmit} className="w-full mt-8 py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    {t('challenge.socialChallenge.morningCheckin.saveButton')}
                </button>
            </div>
        </div>
    );
};

export default MorningCheckinScreenSocial;
