
import React, { FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Activity } from '../../types';
import { XIcon } from '../Icons';
import { ACTIVITIES } from '../../constants';

interface ActivityLoggerProps {
    level: number;
    allHabitsUnlocked: boolean;
    onSelectActivity: (activity: Activity) => void;
    onClose: () => void;
}

const ActivityLogger: FC<ActivityLoggerProps> = ({ level, allHabitsUnlocked, onSelectActivity, onClose }) => {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 animate-fade-in">
            <header className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-brand-dark">{t('activityLogger.title')}</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-brand-dark"><XIcon className="w-7 h-7" /></button>
            </header>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ACTIVITIES.filter(a => a.id !== 'smoke').map(activity => {
                    const isLocked = !allHabitsUnlocked && activity.minLevel > level;
                    return (
                        <button key={activity.id} disabled={isLocked} onClick={() => !isLocked && onSelectActivity(activity)} className={`relative flex flex-col items-center justify-center p-4 rounded-lg transition-all transform ${isLocked ? 'bg-gray-100 filter grayscale opacity-60 cursor-not-allowed' : 'bg-white shadow hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-primary hover:-translate-y-1'}`}>
                            {isLocked && (<div className="absolute top-1 right-1 bg-brand-dark text-white text-xs font-bold rounded-full px-1.5 py-0.5">{t('common.level')} {activity.minLevel}</div>)}
                            <div className={`p-3 rounded-full bg-gray-200 ${activity.color}`}><activity.icon className="w-8 h-8" /></div>
                            <span className="mt-2 font-semibold text-sm text-brand-dark text-center">{t(`activities.${activity.id}.name`)}</span>
                            {!isLocked && <span className="text-xs text-gray-500">{t(`activities.${activity.id}.description`)}</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ActivityLogger;
