
import React, { FC } from 'react';
import { Reminder } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ACTIVITIES } from '../constants';

interface ReminderCardProps {
    reminder: Reminder;
    onLog: (reminder: Reminder) => void;
}

const ReminderCard: FC<ReminderCardProps> = ({ reminder, onLog }) => {
    const { t, language } = useLanguage();
    const activity = ACTIVITIES.find(a => a.id === reminder.activityId);

    if (!activity) return null;

    const activityName = t(`activities.${activity.id}.name`);
    const buttonText = t(`activities.${activity.id}.logAction`);

    const animationClass = reminder.activityId === 'sleep'
        ? 'animate-medium-fade-in'
        : 'animate-slow-fade-in';

    return (
        <li className={`bg-white/50 p-4 rounded-lg shadow-sm border border-dashed border-indigo-300 ${animationClass}`}>
            <div className="flex items-center">
                <div className={`p-3 rounded-full bg-indigo-100 ${activity.color}`}>
                    <activity.icon className="w-6 h-6" />
                </div>
                <div className="ml-4 flex-grow">
                    <p className="font-semibold text-brand-dark">
                        {t('reminders.prompt', { activityName })}
                    </p>
                    <p className="text-sm text-gray-500">
                        {new Intl.DateTimeFormat(language, { hour: 'numeric', minute: '2-digit' }).format(reminder.predictedAt)}
                    </p>
                </div>
                <button
                    onClick={() => onLog(reminder)}
                    className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors text-sm shadow"
                    aria-label={t('reminders.logNowAria', { activityName })}
                >
                    {buttonText}
                </button>
            </div>
        </li>
    );
};

export default ReminderCard;
