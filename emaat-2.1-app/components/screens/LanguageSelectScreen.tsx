

import React, { FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher';
import { ArrowRightIcon } from '../Icons';

interface LanguageSelectScreenProps {
    onContinue: () => void;
}

const LanguageSelectScreen: FC<LanguageSelectScreenProps> = ({ onContinue }) => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-light font-sans p-4">
            <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-brand-dark">{t('languageSelectScreen.title')}</h1>
                <div className="flex justify-center mb-8">
                    <LanguageSwitcher theme="light" />
                </div>
                <button 
                    onClick={onContinue} 
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl cursor-pointer bg-brand-primary text-white font-bold text-lg hover:bg-indigo-700 transition-all duration-300"
                >
                    <span>{t('languageSelectScreen.continueButton')}</span>
                    <ArrowRightIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default LanguageSelectScreen;