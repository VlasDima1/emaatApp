
import React, { FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity } from '../../types';
import { XIcon, BrainCircuitIcon, LeafIcon, WindIcon, HeartPulseIcon } from '../Icons';

interface ChallengeIntroductionScreenStressProps {
    activity: ChallengeActivity;
    onStart: () => void;
    onClose: () => void;
}

const ChallengeIntroductionScreenStress: FC<ChallengeIntroductionScreenStressProps> = ({ activity, onStart, onClose }) => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex justify-center items-center animate-fade-in">
            <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <header className="flex justify-between items-start p-6 pb-2">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-dark">{t('challenge.stressChallenge.introduction.title')}</h2>
                        <p className="text-gray-600">{t('challenge.stressChallenge.introduction.subtitle')}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                </header>

                 {/* Visual for Stress Challenge */}
                 <div className="w-full h-48 bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center relative mb-6 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDuration: '4s' }}></div>
                    </div>
                    <div className="flex flex-col items-center z-10 text-white">
                         <div className="relative">
                            <LeafIcon className="w-20 h-20 text-white drop-shadow-lg" />
                            <WindIcon className="absolute bottom-0 right-0 w-10 h-10 text-white/80 drop-shadow-md animate-float" />
                         </div>
                         <h3 className="font-bold text-xl mt-2 tracking-wide text-teal-50">Find Your Inner Calm</h3>
                    </div>
                </div>

                <div className="space-y-6 px-6 pb-6">
                    <div className="p-4 bg-teal-50 border-l-4 border-teal-400 rounded-r-lg">
                        <h3 className="font-bold text-lg text-teal-800 mb-2">{t('challenge.stressChallenge.introduction.whyTitle')}</h3>
                        <p className="text-teal-700">{t('challenge.stressChallenge.introduction.whyContent')}</p>
                    </div>
                     <div className="p-4 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
                        <h3 className="font-bold text-lg text-emerald-800 mb-2">{t('challenge.stressChallenge.introduction.whatTitle')}</h3>
                        <p className="text-emerald-700">{t('challenge.stressChallenge.introduction.whatContent')}</p>
                    </div>
                </div>

                <div className="px-6 pb-8">
                    <button 
                        onClick={onStart} 
                        className="w-full py-4 px-6 bg-brand-primary text-white font-bold text-lg rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <BrainCircuitIcon className="w-6 h-6" />
                        {t('challenge.stressChallenge.introduction.startButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChallengeIntroductionScreenStress;
