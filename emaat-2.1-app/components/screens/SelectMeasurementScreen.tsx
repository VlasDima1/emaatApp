import React, { FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { MeasurementType } from '../../types';
import { XIcon } from '../Icons';
import { MEASUREMENT_CONFIG } from '../../constants';

interface SelectMeasurementScreenProps {
    onSelect: (type: MeasurementType) => void;
    onClose: () => void;
}

const SelectMeasurementScreen: FC<SelectMeasurementScreenProps> = ({ onSelect, onClose }) => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 animate-fade-in">
            <header className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-brand-dark">{t('measurements.selectTitle')}</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-brand-dark"><XIcon className="w-7 h-7" /></button>
            </header>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(Object.keys(MEASUREMENT_CONFIG) as MeasurementType[]).map(type => {
                    const config = MEASUREMENT_CONFIG[type];
                    return (
                        <button 
                            key={type} 
                            onClick={() => onSelect(type)}
                            className="flex flex-col items-center justify-center p-4 rounded-lg bg-white shadow hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-primary hover:-translate-y-1 transition-transform"
                        >
                            <div className={`p-3 rounded-full bg-gray-100 ${config.color}`}>
                                <config.icon className="w-8 h-8" />
                            </div>
                            <span className="mt-2 font-semibold text-sm text-brand-dark text-center">{t(`measurements.types.${type}.name`)}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SelectMeasurementScreen;