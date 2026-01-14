import React, { FC, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity, SocialEveningCheckinData } from '../../types';
import { XIcon, UsersIcon } from '../Icons';
import Slider from '../Slider';

interface EveningCheckinScreenSocialProps {
    activity: ChallengeActivity;
    onComplete: (activity: ChallengeActivity) => void;
    onClose: () => void;
}

const EveningCheckinScreenSocial: FC<EveningCheckinScreenSocialProps> = ({ activity, onComplete, onClose }) => {
    const { t } = useLanguage();
    const [interactionQuality, setInteractionQuality] = useState(5);
    const [actionCompleted, setActionCompleted] = useState<'yes' | 'partly' | 'no'>('no');
    const [socialSelfEsteem, setSocialSelfEsteem] = useState(5);

    const handleSubmit = () => {
        const data: SocialEveningCheckinData = {
            interactionQuality,
            actionCompleted,
            socialSelfEsteem,
        };
        
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
                    <h3 className="text-2xl font-bold text-brand-dark">{t('challenge.socialChallenge.eveningCheckin.title')}</h3>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-center text-sm font-medium text-gray-700 mb-2">{t('challenge.socialChallenge.eveningCheckin.interactionQualityLabel')}</label>
                        <Slider value={interactionQuality} onChange={setInteractionQuality} minLabel={t('challenge.socialChallenge.eveningCheckin.negative')} maxLabel={t('challenge.socialChallenge.eveningCheckin.positive')} />
                    </div>
                    <div>
                        <label className="block text-center text-sm font-medium text-gray-700 mb-2">{t('challenge.socialChallenge.eveningCheckin.actionCompletedLabel')}</label>
                        <div className="grid grid-cols-3 gap-2">
                           <button onClick={() => setActionCompleted('yes')} className={`py-2 rounded-lg font-semibold transition-colors ${actionCompleted === 'yes' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}>{t('challenge.socialChallenge.eveningCheckin.actionCompletedYes')}</button>
                           <button onClick={() => setActionCompleted('partly')} className={`py-2 rounded-lg font-semibold transition-colors ${actionCompleted === 'partly' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'}`}>{t('challenge.socialChallenge.eveningCheckin.actionCompletedPartly')}</button>
                           <button onClick={() => setActionCompleted('no')} className={`py-2 rounded-lg font-semibold transition-colors ${actionCompleted === 'no' ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-700'}`}>{t('challenge.socialChallenge.eveningCheckin.actionCompletedNo')}</button>
                        </div>
                    </div>
                     <div>
                        <label className="block text-center text-sm font-medium text-gray-700 mb-2">{t('challenge.socialChallenge.eveningCheckin.socialSelfEsteemLabel')}</label>
                        <Slider value={socialSelfEsteem} onChange={setSocialSelfEsteem} minLabel={t('challenge.socialChallenge.eveningCheckin.lessConfident')} maxLabel={t('challenge.socialChallenge.eveningCheckin.moreConfident')} />
                    </div>
                </div>

                <button onClick={handleSubmit} className="w-full mt-8 py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    {t('challenge.socialChallenge.eveningCheckin.saveButton')}
                </button>
            </div>
        </div>
    );
};

export default EveningCheckinScreenSocial;
