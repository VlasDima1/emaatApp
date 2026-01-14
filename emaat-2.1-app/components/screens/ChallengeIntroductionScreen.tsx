
import React, { FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity } from '../../types';
import { XIcon, BrainCircuitIcon, BedIcon, StarIcon, ClockIcon } from '../Icons';

interface ChallengeIntroductionScreenProps {
    activity: ChallengeActivity;
    onStart: () => void;
    onClose: () => void;
}

const colorConfig: Record<string, { whyClass: string; whatClass: string }> = {
    sleepChallenge: { whyClass: 'bg-indigo-50 border-indigo-400 text-indigo-800 text-indigo-700', whatClass: 'bg-emerald-50 border-emerald-400 text-emerald-800 text-emerald-700' },
    beweegChallenge: { whyClass: 'bg-sky-50 border-sky-400 text-sky-800 text-sky-700', whatClass: 'bg-emerald-50 border-emerald-400 text-emerald-800 text-emerald-700' },
    voedingChallenge: { whyClass: 'bg-emerald-50 border-emerald-400 text-emerald-800 text-emerald-700', whatClass: 'bg-sky-50 border-sky-400 text-sky-800 text-sky-700' },
    stopRokenChallenge: { whyClass: 'bg-slate-50 border-slate-400 text-slate-800 text-slate-700', whatClass: 'bg-emerald-50 border-emerald-400 text-emerald-800 text-emerald-700' },
    socialChallenge: { whyClass: 'bg-amber-50 border-amber-400 text-amber-800 text-amber-700', whatClass: 'bg-emerald-50 border-emerald-400 text-emerald-800 text-emerald-700' },
    stressChallenge: { whyClass: 'bg-teal-50 border-teal-400 text-teal-800 text-teal-700', whatClass: 'bg-emerald-50 border-emerald-400 text-emerald-800 text-emerald-700' },
};

const ChallengeIntroductionScreen: FC<ChallengeIntroductionScreenProps> = ({ activity, onStart, onClose }) => {
    const { t } = useLanguage();
    const { challengeId } = activity;

    const colors = colorConfig[challengeId] || colorConfig.sleepChallenge;
    const [whyBg, whyBorder, whyTitleText, whyContentText] = colors.whyClass.split(' ');
    const [whatBg, whatBorder, whatTitleText, whatContentText] = colors.whatClass.split(' ');

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex justify-center items-center animate-fade-in">
            <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <header className="flex justify-between items-start p-6 pb-2">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-dark">{t(`challenge.${challengeId}.introduction.title`)}</h2>
                        <p className="text-gray-600">{t(`challenge.${challengeId}.introduction.subtitle`)}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                </header>

                {/* Visual for Sleep Challenge (Default) */}
                <div className="w-full h-48 bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center relative mb-6 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <StarIcon className="absolute top-4 left-10 w-8 h-8 text-white animate-pulse" />
                        <StarIcon className="absolute bottom-8 right-12 w-6 h-6 text-white animate-pulse" style={{ animationDelay: '1s' }} />
                        <StarIcon className="absolute top-10 right-1/4 w-4 h-4 text-white animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </div>
                    <div className="flex flex-col items-center z-10 text-white">
                         <div className="relative">
                            <BedIcon className="w-20 h-20 text-white drop-shadow-lg" />
                            <div className="absolute -top-2 -right-2 bg-emerald-400 rounded-full p-1 shadow-lg animate-bounce">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                         </div>
                         <h3 className="font-bold text-xl mt-2 tracking-wide text-indigo-100">Recharge & Revitalize</h3>
                    </div>
                </div>

                <div className="space-y-6 px-6 pb-6">
                    <div className={`p-4 ${whyBg} border-l-4 ${whyBorder} rounded-r-lg`}>
                        <h3 className={`font-bold text-lg ${whyTitleText} mb-2`}>{t(`challenge.${challengeId}.introduction.whyTitle`)}</h3>
                        <p className={whyContentText}>{t(`challenge.${challengeId}.introduction.whyContent`)}</p>
                    </div>
                    <div className={`p-4 ${whatBg} border-l-4 ${whatBorder} rounded-r-lg`}>
                        <h3 className={`font-bold text-lg ${whatTitleText} mb-2`}>{t(`challenge.${challengeId}.introduction.whatTitle`)}</h3>
                        <p className={whatContentText}>{t(`challenge.${challengeId}.introduction.whatContent`)}</p>
                    </div>
                </div>

                <div className="px-6 pb-8">
                    <button 
                        onClick={onStart} 
                        className="w-full py-4 px-6 bg-brand-primary text-white font-bold text-lg rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <BrainCircuitIcon className="w-6 h-6" />
                        {t(`challenge.${challengeId}.introduction.startButton`)}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChallengeIntroductionScreen;
