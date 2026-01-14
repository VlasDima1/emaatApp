import React, { FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Survey } from '../../types';
import { XIcon } from '../Icons';
import { SURVEYS } from '../../surveys';

interface SelectSurveyScreenProps {
    onSelect: (survey: Survey) => void;
    onClose: () => void;
}

const SelectSurveyScreen: FC<SelectSurveyScreenProps> = ({ onSelect, onClose }) => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 animate-fade-in">
            <header className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-brand-dark">{t('surveys.selectTitle')}</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-brand-dark"><XIcon className="w-7 h-7" /></button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SURVEYS.map(survey => {
                    const Icon = survey.icon;
                    return (
                        <button 
                            key={survey.id} 
                            onClick={() => onSelect(survey)}
                            className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-white shadow hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-primary hover:-translate-y-1 transition-transform"
                        >
                            <div className="p-3 rounded-full bg-gray-100 text-brand-primary">
                                <Icon className="w-8 h-8" />
                            </div>
                            <span className="mt-2 font-semibold text-brand-dark">{t(survey.nameKey)}</span>
                            <p className="text-xs text-gray-500 mt-1">{t(survey.descriptionKey)}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SelectSurveyScreen;
