

import React, { FC } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { PlusIcon, HomeIcon, ClipboardListIcon, CalendarIcon, ChartBarIcon, SettingsIcon, BedIcon } from '../Icons';

interface TimelineWelcomeProps {
    onStartSleepChallenge: () => void;
    hasChallengeActive?: boolean;
}

const TimelineWelcome: FC<TimelineWelcomeProps> = ({ onStartSleepChallenge, hasChallengeActive }) => {
    const { t } = useLanguage();

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-in space-y-6 mb-4">
            <div className="text-center">
                <h3 className="text-xl font-bold text-brand-dark">{t('timelineWelcome.title')}</h3>
                <p className="text-gray-600 mt-2">{t('timelineWelcome.subtitle')}</p>
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">{t('timelineWelcome.fabTitle')}</h4>
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                            <PlusIcon className="w-7 h-7" />
                        </div>
                        <p className="text-sm text-gray-700">{t('timelineWelcome.fabDescription')}</p>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">{t('timelineWelcome.tabsTitle')}</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3"><HomeIcon className="w-6 h-6 text-gray-500 flex-shrink-0" /><p className="text-sm text-gray-700"><b>{t('nav.timeline')}:</b> {t('timelineWelcome.timelineDescription')}</p></div>
                        <div className="flex items-center gap-3"><ClipboardListIcon className="w-6 h-6 text-gray-500 flex-shrink-0" /><p className="text-sm text-gray-700"><b>{t('nav.plan')}:</b> {t('timelineWelcome.planDescription')}</p></div>
                        <div className="flex items-center gap-3"><CalendarIcon className="w-6 h-6 text-gray-500 flex-shrink-0" /><p className="text-sm text-gray-700"><b>{t('nav.agenda')}:</b> {t('timelineWelcome.agendaDescription')}</p></div>
                        <div className="flex items-center gap-3"><ChartBarIcon className="w-6 h-6 text-gray-500 flex-shrink-0" /><p className="text-sm text-gray-700"><b>{t('nav.stats')}:</b> {t('timelineWelcome.statsDescription')}</p></div>
                        <div className="flex items-center gap-3"><SettingsIcon className="w-6 h-6 text-gray-500 flex-shrink-0" /><p className="text-sm text-gray-700"><b>{t('nav.settings')}:</b> {t('timelineWelcome.settingsDescription')}</p></div>
                    </div>
                </div>
            </div>

            {!hasChallengeActive && (
                <div className="pt-6 border-t text-center bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <BedIcon className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-lg text-indigo-800 mb-2">{t('timelineWelcome.startChallengeTitle')}</h4>
                    <p className="text-sm text-indigo-700 mb-4">{t('timelineWelcome.startSleepChallengeInstruction')}</p>
                    <button 
                        onClick={onStartSleepChallenge}
                        className="w-full max-w-xs mx-auto py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                        {t('timelineWelcome.startSleepChallengeButton')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TimelineWelcome;