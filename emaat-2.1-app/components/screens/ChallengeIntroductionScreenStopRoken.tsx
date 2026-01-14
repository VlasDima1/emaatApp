
import React, { FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity } from '../../types';
import { XIcon, BrainCircuitIcon, LungsIcon, WindIcon, AwardIcon } from '../Icons';

interface ChallengeIntroductionScreenStopRokenProps {
    activity: ChallengeActivity;
    onStart: () => void;
    onClose: () => void;
}

const ChallengeIntroductionScreenStopRoken: FC<ChallengeIntroductionScreenStopRokenProps> = ({ activity, onStart, onClose }) => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex justify-center items-center animate-fade-in">
            <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <header className="flex justify-between items-start p-6 pb-2">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-dark">{t('challenge.stopRokenChallenge.introduction.title')}</h2>
                        <p className="text-gray-600">{t('challenge.stopRokenChallenge.introduction.subtitle')}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                </header>

                 {/* Visual for Quit Smoking Challenge */}
                 <div className="w-full h-48 bg-gradient-to-br from-slate-500 to-teal-600 flex items-center justify-center relative mb-6 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <WindIcon className="absolute top-4 right-10 w-24 h-24 text-white animate-float" style={{ animationDuration: '8s' }} />
                        <WindIcon className="absolute bottom-2 left-10 w-16 h-16 text-white animate-float" style={{ animationDuration: '6s' }} />
                    </div>
                    <div className="flex flex-col items-center z-10 text-white">
                         <div className="relative">
                            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/50">
                                <LungsIcon className="w-16 h-16 text-white drop-shadow-md" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-amber-400 rounded-full p-2 shadow-lg">
                                <AwardIcon className="w-6 h-6 text-white" />
                            </div>
                         </div>
                         <h3 className="font-bold text-xl mt-3 tracking-wide text-teal-50">Breathe Free & Strong</h3>
                    </div>
                </div>


                <div className="space-y-6 px-6 pb-6">
                    <div className="p-4 bg-slate-50 border-l-4 border-slate-400 rounded-r-lg">
                        <h3 className="font-bold text-lg text-slate-800 mb-2">{t('challenge.stopRokenChallenge.introduction.whyTitle')}</h3>
                        <p className="text-slate-700">{t('challenge.stopRokenChallenge.introduction.whyContent')}</p>
                    </div>
                     <div className="p-4 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
                        <h3 className="font-bold text-lg text-emerald-800 mb-2">{t('challenge.stopRokenChallenge.introduction.whatTitle')}</h3>
                        <p className="text-emerald-700">{t('challenge.stopRokenChallenge.introduction.whatContent')}</p>
                    </div>
                </div>

                <div className="px-6 pb-8">
                    <button 
                        onClick={onStart} 
                        className="w-full py-4 px-6 bg-brand-primary text-white font-bold text-lg rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <BrainCircuitIcon className="w-6 h-6" />
                        {t('challenge.stopRokenChallenge.introduction.startButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChallengeIntroductionScreenStopRoken;
