
import React, { FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity } from '../../types';
import { XIcon, BrainCircuitIcon, UsersIcon, HeartIcon, MessageCircleIcon } from '../Icons';

interface ChallengeIntroductionScreenSocialProps {
    activity: ChallengeActivity;
    onStart: () => void;
    onClose: () => void;
}

const ChallengeIntroductionScreenSocial: FC<ChallengeIntroductionScreenSocialProps> = ({ activity, onStart, onClose }) => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex justify-center items-center animate-fade-in">
            <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <header className="flex justify-between items-start p-6 pb-2">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-dark">{t('challenge.socialChallenge.introduction.title')}</h2>
                        <p className="text-gray-600">{t('challenge.socialChallenge.introduction.subtitle')}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                </header>

                {/* Visual for Social Challenge */}
                <div className="w-full h-48 bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center relative mb-6 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <MessageCircleIcon className="absolute top-6 left-8 w-12 h-12 text-white animate-bounce" style={{ animationDuration: '3s' }} />
                        <MessageCircleIcon className="absolute bottom-6 right-8 w-10 h-10 text-white animate-bounce" style={{ animationDuration: '4s' }} />
                    </div>
                    <div className="flex flex-col items-center z-10 text-white">
                         <div className="flex items-center justify-center">
                             <UsersIcon className="w-16 h-16 text-white drop-shadow-lg" />
                             <HeartIcon className="w-8 h-8 text-white/90 drop-shadow-md -ml-3 -mt-6 animate-pulse" />
                         </div>
                         <h3 className="font-bold text-xl mt-3 tracking-wide text-amber-50">Connect & Belong</h3>
                    </div>
                </div>

                <div className="space-y-6 px-6 pb-6">
                    <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                        <h3 className="font-bold text-lg text-amber-800 mb-2">{t('challenge.socialChallenge.introduction.whyTitle')}</h3>
                        <p className="text-amber-700">{t('challenge.socialChallenge.introduction.whyContent')}</p>
                    </div>
                     <div className="p-4 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
                        <h3 className="font-bold text-lg text-emerald-800 mb-2">{t('challenge.socialChallenge.introduction.whatTitle')}</h3>
                        <p className="text-emerald-700">{t('challenge.socialChallenge.introduction.whatContent')}</p>
                    </div>
                </div>

                <div className="px-6 pb-8">
                    <button 
                        onClick={onStart} 
                        className="w-full py-4 px-6 bg-brand-primary text-white font-bold text-lg rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <BrainCircuitIcon className="w-6 h-6" />
                        {t('challenge.socialChallenge.introduction.startButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChallengeIntroductionScreenSocial;
