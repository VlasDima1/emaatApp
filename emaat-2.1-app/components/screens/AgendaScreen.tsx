
import React, { FC, useMemo, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Goals, Reminder, ChallengeActivity, ChallengeState, Action, LifeStep } from '../../types';
import { ACTIVITIES } from '../../constants';
import { BrainCircuitIcon, ClipboardCheckIcon, ChevronLeftIcon, ChevronRightIcon, BedIcon, DumbbellIcon, UtensilsIcon, StarIcon, ScaleIcon, SmokingIcon, PencilIcon, UsersIcon, ClockIcon, CheckCircleIcon, CircleIcon, XIcon, LeafIcon } from '../Icons';
import { sleepChallengeContent } from '../../challenges/sleepChallenge/content';
import { beweegChallengeContent } from '../../challenges/beweegChallenge/content';
import { voedingChallengeContent } from '../../challenges/voedingChallenge/content';
import { stopRokenChallengeContent } from '../../challenges/stopRokenChallenge/content';
import { socialChallengeContent } from '../../challenges/socialChallenge/content';
import { stressChallengeContent } from '../../challenges/stressChallenge/content';

interface AgendaScreenProps {
    dispatch: React.Dispatch<Action>;
    goals: Goals;
    reminders: Reminder[];
    challenge?: ChallengeState;
    lifeStory: LifeStep[];
    challengeHistory: ChallengeActivity[];
    onSelectChallengeActivity: (activity: ChallengeActivity) => void;
    onLogFromReminder: (reminder: Reminder) => void;
}

type WeeklyGoal = { activityId: string, count: number };
type AgendaItem = 
    | (Reminder & { itemType: 'reminder'; date: Date }) 
    | (ChallengeActivity & { itemType: 'challenge'; date: Date })
    | (LifeStep & { itemType: 'step'; date: Date });

type GroupedAgenda = { [key: string]: AgendaItem[] };

const dateToDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`,
    };
};

const dateTimeLocalToDate = (dateStr: string, timeStr: string) => {
    return new Date(`${dateStr}T${timeStr}`);
};

// Helper to get local date string YYYY-MM-DD
const getLocalDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const AgendaScreen: FC<AgendaScreenProps> = ({ dispatch, goals, reminders, challenge, lifeStory, challengeHistory, onSelectChallengeActivity, onLogFromReminder }) => {
    const { t, language } = useLanguage();
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    const [displayDate, setDisplayDate] = useState(new Date());
    const [selectedDateKey, setSelectedDateKey] = useState<string | null>(getLocalDateKey(new Date()));

    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [itemToReschedule, setItemToReschedule] = useState<AgendaItem | null>(null);
    const [newScheduleDate, setNewScheduleDate] = useState('');
    const [newScheduleTime, setNewScheduleTime] = useState('');

    const { weeklyGoals, scheduledItemsByDate } = useMemo(() => {
        const weekly: WeeklyGoal[] = [];
        if (goals.strength?.daysPerWeek) {
            weekly.push({ activityId: 'exercise', count: goals.strength.daysPerWeek });
        }
        if (goals.socialContact?.timesPerWeek) {
            weekly.push({ activityId: 'social', count: goals.socialContact.timesPerWeek });
        }
        if (goals.dailyWalking?.daysPerWeek) {
            weekly.push({ activityId: 'nature', count: goals.dailyWalking.daysPerWeek });
        }

        const daily: AgendaItem[] = [];
        
        // Reminders (Future)
        daily.push(...reminders.map(r => ({ ...r, date: r.predictedAt, itemType: 'reminder' as const })));
        
        // Active Challenge (Pending + Completed)
        const activeChallengeActivities = challenge?.activities || [];
        daily.push(...activeChallengeActivities.map(c => ({ 
            ...c, 
            // If completed, show on completion date, otherwise scheduled date
            date: c.status === 'completed' && c.completedAt ? c.completedAt : c.scheduledAt, 
            itemType: 'challenge' as const 
        })));

        // Challenge History (Completed from past challenges)
        daily.push(...challengeHistory.map(c => ({
            ...c,
            date: c.completedAt || c.scheduledAt,
            itemType: 'challenge' as const
        })));

        // Life Story (Regular logs, excluding those that are part of a challenge to avoid duplication)
        daily.push(...lifeStory
            .filter(step => !step.challengeActivityId)
            .map(s => ({ ...s, date: s.timestamp, itemType: 'step' as const }))
        );
        
        const grouped: GroupedAgenda = daily
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .reduce((acc, item) => {
                // Use local date key to avoid timezone issues
                const dateKey = getLocalDateKey(item.date);
                if (!acc[dateKey]) acc[dateKey] = [];
                acc[dateKey].push(item);
                return acc;
            }, {} as GroupedAgenda);

        return { weeklyGoals: weekly, scheduledItemsByDate: grouped };
    }, [goals, reminders, challenge, challengeHistory, lifeStory]);
    
    const handleItemClick = (item: AgendaItem) => {
        if (item.itemType === 'reminder') onLogFromReminder(item);
        if (item.itemType === 'challenge') {
            if (item.status === 'pending' || item.type === 'braintainment') {
                onSelectChallengeActivity(item);
            }
        }
    };

    const openRescheduleModal = (item: AgendaItem) => {
        const { date: dateStr, time: timeStr } = dateToDateTimeLocal(item.date);
        setNewScheduleDate(dateStr);
        setNewScheduleTime(timeStr);
        setItemToReschedule(item);
        setIsRescheduleModalOpen(true);
    };

    const handleReschedule = () => {
        if (!itemToReschedule) return;

        const newDate = dateTimeLocalToDate(newScheduleDate, newScheduleTime);

        if (itemToReschedule.itemType === 'reminder') {
            dispatch({ type: 'UPDATE_REMINDER_TIME', payload: { id: itemToReschedule.id, newDate } });
        } else if (itemToReschedule.itemType === 'challenge') {
            dispatch({ type: 'UPDATE_CHALLENGE_ACTIVITY_TIME', payload: { id: itemToReschedule.id, newDate } });
        }

        setIsRescheduleModalOpen(false);
        setItemToReschedule(null);
    };

    const renderActivityItem = (item: AgendaItem, index: number) => {
        let activity, title, Icon;
        let isCompleted = false;
        
        if (item.itemType === 'challenge') {
            isCompleted = item.status === 'completed';
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
            activity = { id: config.id, icon: config.icon, color: config.color };
            Icon = activity.icon;
            
            let specificTitle: string | undefined;
            if (item.type === 'braintainment') {
                const content = config.content[item.day as keyof typeof config.content];
                if (content) {
                    specificTitle = content[language]?.title;
                }
            }
            
            title = specificTitle || t(`challenge.${item.challengeId}.${item.type}.title`);
            
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
                    title = t(`challenge.${item.challengeId}.name`);
                    break;
                case 'dailyAssignment':
                    Icon = PencilIcon;
                    break;
                case 'weighIn':
                    Icon = ScaleIcon;
                    activity = { ...activity, color: 'text-teal-500' };
                    break;
            }
        } else if (item.itemType === 'step') {
             isCompleted = true;
             activity = item.activity;
             title = item.overrideTitle || t(`activities.${activity.id}.name`);
             Icon = activity.icon;
        } else {
             // Reminder
             activity = ACTIVITIES.find(a => a.id === item.activityId);
             if (!activity) return null;
             title = t(`activities.${activity.id}.name`);
             Icon = activity.icon;
             isCompleted = false;
        }

        const isClickable = !isCompleted || (item.itemType === 'challenge' && item.type === 'braintainment');

        return (
            <li key={`${item.id}-${index}`}>
                <div className={`flex items-center gap-4 w-full text-left p-2 -m-2 rounded-md ${isClickable ? 'hover:bg-gray-50' : ''}`}>
                    <div className="w-16 text-right font-mono text-sm font-semibold text-gray-800">
                        {formatTime(item.date)}
                    </div>
                     {isCompleted ? (
                        <CheckCircleIcon className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                    ) : (
                        <CircleIcon className="w-6 h-6 text-gray-300 flex-shrink-0" />
                    )}
                    <button onClick={() => handleItemClick(item)} disabled={!isClickable} className="flex items-center gap-3 flex-grow disabled:cursor-default text-left">
                        <div className={`flex-shrink-0 p-2 rounded-full ${isCompleted ? 'bg-emerald-50' : 'bg-gray-100'} ${activity.color}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <p className={`font-semibold ${isCompleted ? 'text-gray-500 line-through' : 'text-brand-dark'}`}>{title}</p>
                    </button>
                    {!isCompleted && item.itemType !== 'step' && (
                        <button onClick={() => openRescheduleModal(item)} className="p-1 text-gray-400 hover:text-brand-primary rounded-full">
                            <ClockIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </li>
        );
    };
    
    const formatTime = (date: Date) => new Intl.DateTimeFormat(language, { hour: 'numeric', minute: '2-digit', hour12: false }).format(date);

    const handlePrev = () => {
        const newDate = new Date(displayDate);
        if (viewMode === 'week') newDate.setDate(newDate.getDate() - 7);
        else newDate.setMonth(newDate.getMonth() - 1);
        setDisplayDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(displayDate);
        if (viewMode === 'week') newDate.setDate(newDate.getDate() + 7);
        else newDate.setMonth(newDate.getMonth() + 1);
        setDisplayDate(newDate);
    };
    
    const renderWeekView = () => {
        // Calculate start of the week (Monday) based on displayDate
        const startOfWeek = new Date(displayDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const weekDates = Array.from({ length: 7 }, (_, i) => {
             const d = new Date(startOfWeek);
             d.setDate(d.getDate() + i);
             return d;
        });

        const formatDateHeader = (date: Date) => {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            
            if (date.toDateString() === today.toDateString()) return t('agendaScreen.today');
            if (date.toDateString() === tomorrow.toDateString()) return t('agendaScreen.tomorrow');
            return new Intl.DateTimeFormat(language, { weekday: 'long', month: 'short', day: 'numeric' }).format(date);
        };

        const weekLabel = `${new Intl.DateTimeFormat(language, { day: 'numeric', month: 'short'}).format(weekDates[0])} - ${new Intl.DateTimeFormat(language, { day: 'numeric', month: 'short'}).format(weekDates[6])}`;

        return (
             <section>
                 <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-lg shadow-sm">
                    <button onClick={handlePrev} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-6 h-6 text-gray-600" /></button>
                    <h3 className="text-lg font-semibold text-gray-800">{weekLabel}</h3>
                    <button onClick={handleNext} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-6 h-6 text-gray-600" /></button>
                 </div>
                 
                 <div className="space-y-4">
                    {weekDates.map(date => {
                        // Use local date key
                        const dateKey = getLocalDateKey(date);
                        const items = scheduledItemsByDate[dateKey] || [];
                        if (items.length === 0) return null;

                        return (
                            <div key={dateKey}>
                                <h4 className="font-bold text-brand-primary mb-2 sticky top-0 bg-brand-light/90 py-1">{formatDateHeader(date)}</h4>
                                <ul className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                                    {items.map(renderActivityItem)}
                                </ul>
                            </div>
                        );
                    })}
                     {weekDates.every(d => !scheduledItemsByDate[getLocalDateKey(d)]) && (
                        <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500">{t('agendaScreen.noUpcoming')}</p>
                        </div>
                     )}
                 </div>
            </section>
        );
    };
    
    const renderMonthView = () => {
        const month = displayDate.getMonth();
        const year = displayDate.getFullYear();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday is 0
        const grid: (Date | null)[] = Array(startDayOfWeek).fill(null);
        for (let i = 1; i <= daysInMonth; i++) {
            grid.push(new Date(year, month, i));
        }

        const monthName = new Intl.DateTimeFormat(language, { month: 'long', year: 'numeric' }).format(displayDate);
        const weekdays = Array.from({length: 7}, (_, i) => new Intl.DateTimeFormat(language, { weekday: 'short'}).format(new Date(2023, 0, i+2)));
        
        const selectedItems = selectedDateKey ? scheduledItemsByDate[selectedDateKey] || [] : [];

        return (
            <section>
                <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-lg shadow-sm">
                    <button onClick={handlePrev} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-6 h-6 text-gray-600" /></button>
                    <h3 className="text-lg font-semibold text-gray-800">{monthName}</h3>
                    <button onClick={handleNext} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-6 h-6 text-gray-600" /></button>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-500 mb-2">
                        {weekdays.map(day => <div key={day}>{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {grid.map((date, i) => {
                            if (!date) return <div key={`empty-${i}`}></div>;
                            // Use local date key
                            const dateKey = getLocalDateKey(date);
                            const hasItems = scheduledItemsByDate[dateKey]?.length > 0;
                            const isToday = date.toDateString() === new Date().toDateString();
                            const isSelected = dateKey === selectedDateKey;
                            
                            return (
                                <button key={dateKey} onClick={() => setSelectedDateKey(dateKey)} className={`relative flex items-center justify-center aspect-square rounded-full transition-colors ${isSelected ? 'bg-brand-primary text-white' : isToday ? 'bg-indigo-100 text-brand-dark' : 'hover:bg-gray-100'}`}>
                                    <span className="text-sm">{date.getDate()}</span>
                                    {hasItems && <div className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-brand-primary'}`}></div>}
                                </button>
                            );
                        })}
                    </div>
                </div>
                {selectedItems.length > 0 ? (
                     <div className="mt-4">
                        <ul className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                           {selectedItems.map(renderActivityItem)}
                        </ul>
                    </div>
                ) : selectedDateKey && (
                     <div className="mt-4 text-center text-gray-500 py-4">
                         {t('agendaScreen.noUpcoming')}
                     </div>
                )}
            </section>
        );
    };

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 animate-fade-in">
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-brand-dark">{t('agendaScreen.title')}</h2>
                 <div className="flex items-center gap-2">
                    <button onClick={() => { setDisplayDate(new Date()); setSelectedDateKey(getLocalDateKey(new Date())); }} className="text-sm font-semibold text-brand-primary bg-indigo-100 px-3 py-1 rounded-md hover:bg-indigo-200">{t('agendaScreen.todayButton')}</button>
                    <div className="flex items-center space-x-1 bg-gray-200 rounded-full p-0.5">
                        <button onClick={() => setViewMode('week')} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${viewMode === 'week' ? 'bg-white text-brand-primary shadow' : 'text-gray-500'}`}>{t('agendaScreen.week')}</button>
                        <button onClick={() => setViewMode('month')} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${viewMode === 'month' ? 'bg-white text-brand-primary shadow' : 'text-gray-500'}`}>{t('agendaScreen.month')}</button>
                    </div>
                 </div>
            </header>

            <div className="max-w-2xl mx-auto space-y-6">
                {weeklyGoals.length > 0 && (
                    <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('agendaScreen.weeklyGoals')}</h3>
                        <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                            {weeklyGoals.map(({ activityId, count }) => {
                                const activity = ACTIVITIES.find(a => a.id === activityId);
                                if (!activity) return null;
                                return (
                                    <div key={activityId} className="flex items-center gap-4">
                                        <div className={`flex-shrink-0 p-2 rounded-full bg-gray-100 ${activity.color}`}>
                                            <activity.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-brand-dark">{t(`activities.${activityId}.name`)}</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">{t('agendaScreen.timesAWeek', { count })}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
                
                {viewMode === 'week' ? renderWeekView() : renderMonthView()}
            </div>
            {isRescheduleModalOpen && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
                        <button onClick={() => setIsRescheduleModalOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                        <h3 className="text-xl font-bold text-brand-dark mb-4">Reschedule Activity</h3>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input type="date" value={newScheduleDate} onChange={e => setNewScheduleDate(e.target.value)} className="w-full p-2 mt-1 border border-gray-300 rounded-lg" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Time</label>
                                <input type="time" value={newScheduleTime} onChange={e => setNewScheduleTime(e.target.value)} className="w-full p-2 mt-1 border border-gray-300 rounded-lg" />
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                             <button onClick={() => setIsRescheduleModalOpen(false)} className="w-full py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
                            <button onClick={handleReschedule} className="w-full py-2 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgendaScreen;
