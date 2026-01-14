import React, { FC, useState, useEffect } from 'react';
import { Reminder, ChallengeActivity } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { ACTIVITIES } from '../../constants';
import { BrainCircuitIcon, ClipboardCheckIcon, BedIcon, DumbbellIcon, UtensilsIcon, ScaleIcon, SmokingIcon, PencilIcon, UsersIcon, LeafIcon } from '../Icons';
import { sleepChallengeContent } from '../../challenges/sleepChallenge/content';
import { beweegChallengeContent } from '../../challenges/beweegChallenge/content';
import { voedingChallengeContent } from '../../challenges/voedingChallenge/content';
import { stopRokenChallengeContent } from '../../challenges/stopRokenChallenge/content';
import { socialChallengeContent } from '../../challenges/socialChallenge/content';
import { stressChallengeContent } from '../../challenges/stressChallenge/content';

type UpcomingItem = (Reminder & { itemType: 'reminder' }) | (ChallengeActivity & { itemType: 'challenge' });

interface UpcomingActivityCardProps {
    item: UpcomingItem;
    onLogFromReminder: (reminder: Reminder) => void;
    onSelectChallengeActivity: (activity: ChallengeActivity) => void;
}

const Countdown: FC<{ to: Date }> = ({ to }) => {
    const { t } = useLanguage();
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const diff = to.getTime() - now.getTime();

    if (diff <= 0) {
        return <span className="font-mono text-lg">{t('mainScreen.countdownNow')}</span>;
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return <span className="font-mono text-lg">{t('mainScreen.countdownDays', { d: days, h: hours })}</span>
    if (hours > 0) return <span className="font-mono text-lg">{t('mainScreen.countdownHours', { h: hours, m: minutes })}</span>
    return <span className="font-mono text-lg">{t('mainScreen.countdownMinutes', { m: minutes, s: seconds })}</span>
}

const UpcomingActivityCard: FC<UpcomingActivityCardProps> = ({ item, onLogFromReminder, onSelectChallengeActivity }) => {
    const { t, language } = useLanguage();
    
    const scheduledAt = item.itemType === 'reminder' ? item.predictedAt : item.scheduledAt;
    
    let activity, title, Icon, action, buttonText, activityName;

    if (item.itemType === 'reminder') {
        activity = ACTIVITIES.find(a => a.id === item.activityId);
        if (!activity) return null;
        title = t(`activities.${activity.id}.name`);
        activityName = title;
        Icon = activity.icon;
        action = () => onLogFromReminder(item);
        buttonText = t(`activities.${activity.id}.logAction`);
    } else { // challenge
        const getChallengeConfig = () => {
            switch (item.challengeId) {
                case 'beweegChallenge': return { id: 'exercise', icon: DumbbellIcon, color: 'text-sky-500', content: beweegChallengeContent };
                case 'voedingChallenge': return { id: 'meal', icon: UtensilsIcon, color: 'text-emerald-500', content: voedingChallengeContent };
                case 'stopRokenChallenge': return { id: 'smoke', icon: SmokingIcon, color: 'text-slate-500', content: stopRokenChallengeContent };
                case 'socialChallenge': return { id: 'social', icon: UsersIcon, color: 'text-amber-500', content: socialChallengeContent };
                case 'stressChallenge': return { id: 'relax', icon: LeafIcon, color: 'text-teal-500', content: stressChallengeContent };
                case 'sleepChallenge':
                default:
                    return { id: 'sleep', icon: BedIcon, color: 'text-indigo-500', content: sleepChallengeContent };
            }
        };
        const config = getChallengeConfig();
        activity = { id: config.id, color: config.color, icon: config.icon };
        Icon = activity.icon;

        let specificTitle: string | undefined;
        if (item.type === 'braintainment') {
            const content = config.content[item.day as keyof typeof config.content];
            if (content) {
                specificTitle = content[language]?.title;
            }
        }

        title = specificTitle || t(`challenge.${item.challengeId}.${item.type}.title`);
        activityName = t(`challenge.${item.challengeId}.name`);

        switch(item.type) {
            case 'morningCheckin':
            case 'eveningCheckin':
                Icon = ClipboardCheckIcon;
                break;
            case 'breakfastCheckin':
            case 'lunchCheckin':
            case 'dinnerCheckin':
                Icon = UtensilsIcon;
                break;
            case 'braintainment':
                 Icon = BrainCircuitIcon;
                break;
             case 'introduction':
                title = activityName;
                break;
            case 'dailyAssignment':
                Icon = PencilIcon;
                break;
             case 'weighIn':
                Icon = ScaleIcon;
                activity = { ...activity, color: 'text-teal-500' };
                break;
        }
        action = () => onSelectChallengeActivity(item);
        buttonText = t('common.done');
    }
    
    const formattedTime = new Intl.DateTimeFormat(language, { hour: 'numeric', minute: '2-digit' }).format(scheduledAt);

    return (
        <div className="bg-indigo-50 p-4 rounded-lg shadow-sm border border-dashed border-indigo-200 animate-fade-in">
            <div className="flex items-center">
                <div className={`p-3 rounded-full bg-indigo-100 ${activity.color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4 flex-grow">
                    <p className="font-semibold text-brand-dark">
                        {title}
                    </p>
                    <p className="text-sm text-gray-500">
                        {formattedTime}
                    </p>
                </div>
                 <div className="text-right">
                    <Countdown to={scheduledAt} />
                 </div>
            </div>
            <button
                onClick={action}
                className="mt-3 w-full px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors text-sm shadow"
                aria-label={t('reminders.logNowAria', { activityName })}
            >
                {buttonText}
            </button>
        </div>
    );
};

export default UpcomingActivityCard;