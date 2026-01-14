
import React, { FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity } from '../../types';
import { XIcon, BrainCircuitIcon, DumbbellIcon, ActivityIcon } from '../Icons';

interface ChallengeIntroductionScreenMovementProps {
    activity: ChallengeActivity;
    onStart: () => void;
    onClose: () => void;
}

const ChallengeIntroductionScreenMovement: FC<ChallengeIntroductionScreenMovementProps> = ({ activity, onStart, onClose }) => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex justify-center items-center animate-fade-in">
            <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <header className="flex justify-between items-start p-6 pb-2">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-dark">{t('challenge.beweegChallenge.introduction.title')}</h2>
                        <p className="text-gray-600">{t('challenge.beweegChallenge.introduction.subtitle')}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                </header>

                 {/* Visual for Movement Challenge */}
                 <div className="w-full h-48 bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center relative mb-6 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/30 to-transparent transform scale-150"></div>
                    </div>
                    <div className="flex flex-col items-center z-10 text-white">
                         <div className="flex items-center gap-4">
                            <DumbbellIcon className="w-16 h-16 text-white drop-shadow-lg transform -rotate-12" />
                            <ActivityIcon className="w-16 h-16 text-white drop-shadow-lg" />
                         </div>
                         <h3 className="font-bold text-xl mt-3 tracking-wide text-sky-50 uppercase">Unleash Your Energy</h3>
                    </div>
                </div>

                <div className="space-y-6 px-6 pb-6">
                    <div className="p-4 bg-sky-50 border-l-4 border-sky-400 rounded-r-lg">
                        <h3 className="font-bold text-lg text-sky-800 mb-2">{t('challenge.beweegChallenge.introduction.whyTitle')}</h3>
                        <p className="text-sky-700">{t('challenge.beweegChallenge.introduction.whyContent')}</p>
                    </div>
                     <div className="p-4 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
                        <h3 className="font-bold text-lg text-emerald-800 mb-2">{t('challenge.beweegChallenge.introduction.whatTitle')}</h3>
                        <p className="text-emerald-700">{t('challenge.beweegChallenge.introduction.whatContent')}</p>
                    </div>
                </div>

                <div className="px-6 pb-8">
                    <button 
                        onClick={onStart} 
                        className="w-full py-4 px-6 bg-brand-primary text-white font-bold text-lg rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <BrainCircuitIcon className="w-6 h-6" />
                        {t('challenge.beweegChallenge.introduction.startButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChallengeIntroductionScreenMovement;
