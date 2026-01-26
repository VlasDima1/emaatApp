
import React, { FC, useMemo, useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LifeStep, UserInfo, Language, Badge, Memory, Activity, Reminder, ChallengeActivity, View, BraintainmentData, Measurement, MeasurementType, SurveyResult, Goals, MorningCheckinData, MovementMorningCheckinData, MovementEveningCheckinData, ChallengeState, SurveyInterpretationLevel, RegularSleepGoal, JournalEntry, JournalId, MovementChallengeGoal, StressMorningCheckinData, StressEveningCheckinData, BMICardInfo, CommunityGoal } from '../../types';
import MiniMe from '../MiniMe';
import { PlusIcon, StarIcon, AwardIcon, SpinnerIcon, ClipboardCheckIcon, BrainCircuitIcon, BedIcon, LockIcon, DumbbellIcon, ClipboardDocumentListIcon, UtensilsIcon, ScaleIcon, SmokingIcon, PencilIcon, UsersIcon, MessageCircleIcon, LeafIcon, ChevronRightIcon } from '../Icons';
import { useAsset } from '../../hooks/useAsset';
import ReminderCard from '../ReminderCard';
import UpcomingActivityCard from '../UpcomingActivityCard';
import { ACTIVITIES, MEASUREMENT_CONFIG } from '../../constants';
import { sleepChallengeContent } from '../../challenges/sleepChallenge/content';
import { beweegChallengeContent } from '../../challenges/beweegChallenge/content';
import { voedingChallengeContent } from '../../challenges/voedingChallenge/content';
import { stopRokenChallengeContent } from '../../challenges/stopRokenChallenge/content';
import { socialChallengeContent } from '../../challenges/socialChallenge/content';
import { stressChallengeContent } from '../../challenges/stressChallenge/content';
import FabMenu from '../FabMenu';
import { SURVEYS } from '../../surveys';
import TimelineWelcome from '../TimelineWelcome';
import JournalEntryCard from '../JournalEntryCard';
import { formatGoalText } from '../../utils';
import BMICard from '../BMICard';
import ChallengeResultDisplay from '../ChallengeResultDisplay';

const formatDate = (date: Date, lang: Language) => new Intl.DateTimeFormat(lang === 'nl' ? 'nl-NL' : 'en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(date);

const MemoryPhoto: FC<{ memoryKey: string }> = ({ memoryKey }) => {
    const [photoUrl, loading] = useAsset(memoryKey);

    if (loading) {
        return <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0"><SpinnerIcon className="w-6 h-6 text-gray-400 animate-spin" /></div>;
    }

    if (photoUrl) {
        return <img src={photoUrl} alt="memory" className="w-16 h-16 rounded-md object-cover flex-shrink-0" />;
    }

    return null;
}

const MemoryDetailsDisplay: FC<{ memory: Memory, activity?: Activity }> = ({ memory, activity }) => {
    const { t } = useLanguage();
    const details: string[] = [];

    if (memory.walking) {
        const key = memory.walking.unit === 'steps' ? 'mainScreen.memoryDetailsWalkingSteps' : 'mainScreen.memoryDetailsWalkingMinutes';
        details.push(t(key, { value: memory.walking.value }));
    }
    if (memory.duration) {
        const key = activity?.id === 'sleep' ? 'mainScreen.memoryDetailsSleep' : 'mainScreen.memoryDetailsDuration';
        details.push(t(key, { h: memory.duration.hours, m: memory.duration.minutes }));
    }
    if (memory.meal) {
        const mealType = t(`addMemoryScreen.${memory.meal.type}`);
        details.push(t('mainScreen.memoryDetailsMeal', { mealType: mealType, description: memory.meal.description }));
    }
    if (memory.social) {
        details.push(t('mainScreen.memoryDetailsSocial', { description: memory.social.description }));
    }

    if (details.length === 0) return null;

    return (
        <div className="text-sm text-gray-700 space-y-1">
            {details.map((detail, i) => <p key={i} className="leading-tight">- {detail}</p>)}
        </div>
    );
};

const ChallengeActivityCard: FC<{
    item: ChallengeActivity;
    onSelect: (item: ChallengeActivity) => void;
    language: Language;
    goals: Goals;
}> = ({ item, onSelect, language, goals }) => {
    const { t } = useLanguage();
    const isCompleted = item.status === 'completed';
    const isIntroduction = item.type === 'introduction';
    const isStartCard = isCompleted && isIntroduction;

    const getChallengeConfig = () => {
        switch (item.challengeId) {
            case 'beweegChallenge': return { color: 'text-sky-500', icon: DumbbellIcon, content: beweegChallengeContent };
            case 'voedingChallenge': return { color: 'text-emerald-500', icon: UtensilsIcon, content: voedingChallengeContent };
            case 'stopRokenChallenge': return { color: 'text-slate-500', icon: SmokingIcon, content: stopRokenChallengeContent };
            case 'socialChallenge': return { color: 'text-amber-500', icon: UsersIcon, content: socialChallengeContent };
            case 'stressChallenge': return { color: 'text-teal-500', icon: LeafIcon, content: stressChallengeContent };
            case 'sleepChallenge':
            default: return { color: 'text-indigo-500', icon: BedIcon, content: sleepChallengeContent };
        }
    };

    const config = getChallengeConfig();
    let activityStyle = { color: config.color, icon: config.icon };

    let title: string;
    let summary: string | null = null;
    let Icon = activityStyle.icon;

    const challengeNameKey = `challenge.${item.challengeId}.name`;

    switch (item.type) {
        case 'introduction':
            title = t(challengeNameKey);
            break;
        case 'morningCheckin':
        case 'eveningCheckin':
        case 'breakfastCheckin':
        case 'lunchCheckin':
        case 'dinnerCheckin':
        case 'snackCheckin':
        case 'drinkCheckin':
            title = t(`challenge.${item.challengeId}.${item.type}.title`);
            Icon = item.challengeId === 'voedingChallenge' ? UtensilsIcon : ClipboardCheckIcon;
            break;
        case 'braintainment':
            const content = config.content[item.day as keyof typeof config.content]?.[language];
            title = content?.title || t(`challenge.${item.challengeId}.braintainment.title`);
            summary = content?.summary || null;
            Icon = BrainCircuitIcon;
            break;
        case 'dailyAssignment':
            title = t(`challenge.${item.challengeId}.dailyAssignment.title`);
            Icon = PencilIcon;
            break;
        case 'weighIn':
            title = t(`challenge.${item.challengeId}.weighIn.title`);
            Icon = ScaleIcon;
            activityStyle = { color: 'text-teal-500', icon: ScaleIcon };
            break;
        default:
            title = "Challenge Activity";
            Icon = StarIcon;
    }

    const quizPoints = (item.data && 'quizScore' in item.data && typeof (item.data as BraintainmentData).quizScore === 'number')
        ? (item.data as BraintainmentData).quizScore
        : 0;
    
    const movementMorningData = (item.challengeId === 'beweegChallenge' && item.type === 'morningCheckin' && item.data && 'didExercise' in item.data) ? item.data as MovementMorningCheckinData : null;
    const stressCheckinData = (item.challengeId === 'stressChallenge' && (item.type === 'morningCheckin' || item.type === 'eveningCheckin') && item.data && 'pulseBefore' in item.data) ? item.data as StressMorningCheckinData | StressEveningCheckinData : null;
    const hasDetails = item.data && (item.type === 'morningCheckin' || item.type === 'eveningCheckin' || item.type === 'dailyAssignment');

    return (
        <li
            onClick={isStartCard ? undefined : () => onSelect(item)}
            className={`p-4 rounded-lg shadow-sm transition-shadow ${
                isStartCard 
                ? 'bg-gradient-to-tr from-indigo-100 to-emerald-100' 
                : isCompleted 
                ? 'bg-emerald-50 text-emerald-800' 
                : 'bg-white hover:shadow-md'
            } ${!isStartCard && 'cursor-pointer'}`}
        >
            <div className="flex items-start">
                <div className={`mt-1 p-3 rounded-full ${isCompleted ? isStartCard ? 'bg-white/50' : 'bg-emerald-100' : 'bg-gray-100'} ${activityStyle.color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                             {isStartCard ? (
                                <h3 className="font-bold text-lg text-brand-dark">{t('mainScreen.challengeStartedTitle', { challengeName: title })}</h3>
                             ) : (
                                <p className="font-semibold text-brand-dark">{title}</p>
                             )}
                            {summary && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{summary}</p>}
                            <p className="text-sm text-gray-500 mt-1">{formatDate(item.completedAt || item.scheduledAt, language)}</p>
                        </div>
                        {isCompleted && !isStartCard ? (
                            <div className="flex items-center gap-1 font-bold text-emerald-600 flex-shrink-0 ml-2">
                                <StarIcon className="w-4 h-4" />
                                {t('common.done')}!
                                {quizPoints > 0 && (
                                    <span className="ml-2 text-xs font-bold text-brand-secondary bg-emerald-100 px-1.5 py-0.5 rounded">
                                        +{quizPoints * 5} pts
                                    </span>
                                )}
                                {movementMorningData && movementMorningData.didExercise && (
                                     <span className="ml-2 text-xs font-bold text-brand-secondary bg-emerald-100 px-1.5 py-0.5 rounded">
                                        +5 pts
                                    </span>
                                )}
                                {stressCheckinData && typeof stressCheckinData.earnedPoints === 'number' && stressCheckinData.earnedPoints > 0 && (
                                    <span className="ml-2 text-xs font-bold text-brand-secondary bg-emerald-100 px-1.5 py-0.5 rounded">
                                        +{stressCheckinData.earnedPoints} pts
                                    </span>
                                )}
                            </div>
                        ) : null}
                    </div>
                     {isCompleted && (item.memory || hasDetails || isStartCard) && (
                        <div className={`mt-3 pt-3 border-t ${isStartCard ? 'border-indigo-200' : 'border-emerald-100'} flex items-start gap-3`}>
                            {item.memory?.photoUrl && <MemoryPhoto memoryKey={item.memory.photoUrl} />}
                            <div className="flex-grow space-y-2">
                                {isStartCard && (() => {
                                    const whyContent = t(`challenge.${item.challengeId}.introduction.whyContent`);
                                    const whatContent = t(`challenge.${item.challengeId}.introduction.whatContent`);
                                    
                                    let goalText: string | null = null;
                                    if (item.challengeId === 'sleepChallenge' && goals.regularSleep) {
                                        const sleepActivityMock: Activity = { id: 'sleep', icon: BedIcon, color: 'text-indigo-500', points: 0, pillar: 'sleep', minLevel: 1 };
                                        goalText = formatGoalText(sleepActivityMock, goals.regularSleep, t);
                                    } else if (item.challengeId === 'beweegChallenge' && goals.movementChallenge) {
                                        goalText = t('goalCheckScreen.goalTemplates.movementChallenge', { steps: goals.movementChallenge.steps });
                                    }
                                    
                                    return (
                                        <div className={`space-y-3 text-sm bg-indigo-50 p-3 rounded-md`}>
                                            <p className="text-indigo-800">{whyContent}</p>
                                            <p className="text-indigo-800">{whatContent}</p>
                                            {goalText && (
                                                <div className="pt-2 border-t border-indigo-200">
                                                    <p className="font-bold text-indigo-900">{t('planScreen.setGoal')}:</p>
                                                    <p className="text-indigo-800">{goalText}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                                
                                {hasDetails && <ChallengeResultDisplay item={item} goals={goals} />}

                                {item.memory?.isPrivate && (
                                    <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                                        <LockIcon className="w-3 h-3"/>
                                        <span>{t('common.private')}</span>
                                    </div>
                                )}
                                {item.memory?.content && (<p className="text-sm text-gray-600 italic bg-emerald-100 p-2 rounded-md">"{item.memory.content.substring(0, 100)}{item.memory.content.length > 100 ? '...' : ''}"</p>)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
}

const MeasurementCard: FC<{ item: Measurement; language: Language; }> = ({ item, language }) => {
    const { t } = useLanguage();
    const config = MEASUREMENT_CONFIG[item.type];
    const { icon: Icon, color } = config;

    const renderValue = () => {
        switch (item.type) {
            case 'heartRate': return <><span className="text-2xl font-bold">{item.value}</span> <span className="text-sm">{t('measurements.types.heartRate.unit')}</span></>;
            case 'bloodPressure': return <><span className="text-2xl font-bold">{item.systolic}/{item.diastolic}</span> <span className="text-sm">{t('measurements.types.bloodPressure.unit')}</span></>;
            case 'bloodGlucose': return <><span className="text-2xl font-bold">{item.value}</span> <span className="text-sm">{t('measurements.types.bloodGlucose.unit')}</span></>;
            case 'steps': return <><span className="text-2xl font-bold">{item.value}</span> <span className="text-sm">{t('measurements.types.steps.unit')}</span></>;
            case 'weight': return <><span className="text-2xl font-bold">{item.value}</span> <span className="text-sm">{t('measurements.types.weight.unit')}</span></>;
            case 'temperature': return <><span className="text-2xl font-bold">{item.value}</span> <span className="text-sm">{t('measurements.types.temperature.unit')}</span></>;
            case 'oxygenSaturation': return <><span className="text-2xl font-bold">{item.value}</span> <span className="text-sm">{t('measurements.types.oxygenSaturation.unit')}</span></>;
            case 'sleepDuration': return <><span className="text-2xl font-bold">{item.hours}h {item.minutes}m</span></>;
            case 'smoke': return <><span className="text-2xl font-bold">{item.value}</span> <span className="text-sm">{t('measurements.types.smoke.unit')}</span></>;
            default: return null;
        }
    };

    return (
         <li className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-start">
                <div className={`mt-1 p-3 rounded-full bg-gray-100 ${color}`}><Icon className="w-6 h-6" /></div>
                <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-brand-dark">{t(`measurements.types.${item.type}.name`)}</p>
                            <p className="text-sm text-gray-500">{formatDate(item.timestamp, language)}</p>
                        </div>
                        <div className={`font-bold ${color}`}>
                           {renderValue()}
                        </div>
                    </div>
                     {item.memory && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-3">
                            {item.memory.photoUrl && <MemoryPhoto memoryKey={item.memory.photoUrl} />}
                            <div className="flex-grow space-y-2">
                                {item.memory.isPrivate && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                        <LockIcon className="w-3 h-3"/>
                                        <span>{t('common.private')}</span>
                                    </div>
                                )}
                                {item.memory.content && (<p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded-md">"{item.memory.content.substring(0, 100)}{item.memory.content.length > 100 ? '...' : ''}"</p>)}
                                <MemoryDetailsDisplay memory={item.memory} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
};

const SurveyCard: FC<{ item: SurveyResult; onSelect: (item: SurveyResult) => void; language: Language; }> = ({ item, onSelect, language }) => {
    const { t } = useLanguage();
    const survey = SURVEYS.find(s => s.id === item.surveyId);

    if (!survey) {
        return null;
    }

    const Icon = survey.icon;
    const color = 'text-purple-500';

    const interpretations = Object.entries(item.interpretation || {}).map(([dimension, level]) => {
        const dimensionName = t(`surveys.${item.surveyId}.dimensions.${dimension}`);
        const interpretationText = t(`surveys.${item.surveyId}.interpretations.${dimension}.${level}`);
        const adviceText = t(`surveys.${item.surveyId}.advice.${dimension}.${level}`);
        const score = item.scores[dimension];
        
        return { dimensionName, interpretationText, adviceText, level: level as SurveyInterpretationLevel, score, dimension };
    });

    return (
        <li onClick={() => onSelect(item)} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start">
                <div className={`mt-1 p-3 rounded-full bg-gray-100 ${color}`}><Icon className="w-6 h-6" /></div>
                <div className="ml-4 flex-grow">
                    <p className="font-semibold text-brand-dark">{t(survey.nameKey)}</p>
                    <p className="text-sm text-gray-500">{formatDate(item.timestamp, language)}</p>
                    {interpretations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                            {interpretations.map(({ dimensionName, interpretationText, adviceText, level, score, dimension }, index) => {
                                const levelColors: Record<SurveyInterpretationLevel, { bg: string; border: string; text: string }> = {
                                    low: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
                                    moderate: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
                                    high: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800' },
                                };
                                const colors = levelColors[level];

                                const hasInterpretation = interpretationText && interpretationText !== `surveys.${item.surveyId}.interpretations.${dimension}.${level}`;
                                const hasAdvice = adviceText && adviceText !== `surveys.${item.surveyId}.advice.${dimension}.${level}`;
                                if (!hasInterpretation) {
                                    return null;
                                }

                                return (
                                    <div key={index} className={`p-3 rounded-md border-l-4 ${colors.bg} ${colors.border}`}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className={`font-semibold text-sm ${colors.text}`}>{dimensionName}</span>
                                            <span className={`font-bold text-lg ${colors.text}`}>{score.toFixed(survey.id === 'pam13' ? 1 : 0)}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className={`text-xs ${colors.text}`}>
                                                <span className="font-bold">Conclusion:</span> {interpretationText}
                                            </p>
                                            {hasAdvice && (
                                                <p className={`text-xs pt-2 border-t ${colors.border} ${colors.text}`}>
                                                    <span className="font-bold">Advice:</span> {adviceText}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
};


interface MainScreenProps {
    userInfo: UserInfo;
    avatar: string | null;
    level: number;
    points: number;
    goals: Goals;
    lifeStory: LifeStep[];
    measurements: Measurement[];
    surveys: SurveyResult[];
    initialBMI?: BMICardInfo | null;
    currentStreak: number;
    communityGoal: CommunityGoal | null;
    lastEarnedCommunityBadge: Badge | undefined;
    reminders: Reminder[];
    challenge?: ChallengeState;
    challengeHistory: ChallengeActivity[];
    activeJournal?: JournalId;
    journalHistory: JournalEntry[];
    lastActivityDate: string | null;
    onLogActivity: () => void;
    onLogMeasurement: () => void;
    onFillSurvey: () => void;
    onLogSmoke: () => void;
    onShowAvatarDetails: () => void;
    onOpenChatbot: () => void;
    onLogJournal: () => void;
    onSelectStep: (step: LifeStep) => void;
    onSelectChallengeActivity: (activity: ChallengeActivity) => void;
    onSelectSurvey: (result: SurveyResult) => void;
    onLogFromReminder: (reminder: Reminder) => void;
    onStartSleepChallenge: () => void;
    onLogSnack: () => void;
    onLogDrink: () => void;
}

const MainScreen: FC<MainScreenProps> = ({ userInfo, avatar, level, points, goals, lifeStory, measurements, surveys, initialBMI, currentStreak, communityGoal, lastEarnedCommunityBadge, reminders, challenge, challengeHistory, activeJournal, journalHistory, lastActivityDate, onLogActivity, onLogMeasurement, onFillSurvey, onLogSmoke, onShowAvatarDetails, onOpenChatbot, onLogJournal, onSelectStep, onSelectChallengeActivity, onSelectSurvey, onLogFromReminder, onStartSleepChallenge, onLogSnack, onLogDrink }) => {
    const { t, language } = useLanguage();
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getBadgeName = (badge: Badge) => t(`badges.activities.${badge.activityId}.${badge.tier}`);

    const { upcomingItem, pastItems } = useMemo(() => {
        const nowTime = now.getTime();
        
        const allPending = [
            ...reminders.map(r => ({ ...r, date: r.predictedAt, itemType: 'reminder' as const })),
            ...(challenge?.activities || []).filter(a => a.status === 'pending').map(a => ({ ...a, date: a.scheduledAt, itemType: 'challenge' as const }))
        ]
        .sort((a, b) => a.date.getTime() - b.date.getTime());
        
        const nextUpcomingItem = allPending.find(item => item.date.getTime() > nowTime) || null;
        
        const lifeStoryChallengeIds = new Set(lifeStory.map(s => s.challengeActivityId).filter(Boolean));
        
        const allCompletedChallengeActivities = [
            ...challengeHistory,
            ...(challenge?.activities || []).filter(a => a.status === 'completed')
        ];
        const uniqueChallengeActivities = Array.from(new Map(allCompletedChallengeActivities.map(item => [item.id, item])).values())
            .filter(item => !lifeStoryChallengeIds.has(item.id));


        const allPast = [
            ...lifeStory.map(s => ({ ...s, date: s.timestamp, itemType: 'step' as const })),
            ...uniqueChallengeActivities.map(a => ({ ...a, date: a.completedAt || a.scheduledAt, itemType: 'challenge' as const })),
            ...measurements.map(m => ({ ...m, date: m.timestamp, itemType: 'measurement' as const })),
            ...surveys.map(s => ({ ...s, date: s.timestamp, itemType: 'survey' as const })),
            ...journalHistory.map(j => ({ ...j, date: j.timestamp, itemType: 'journal' as const })),
            ...(initialBMI ? [{ ...initialBMI, date: initialBMI.timestamp, itemType: 'bmi' as const }] : []),
        ].sort((a, b) => b.date.getTime() - a.date.getTime());
        
        return { upcomingItem: nextUpcomingItem, pastItems: allPast };

    }, [lifeStory, reminders, challenge, measurements, surveys, challengeHistory, journalHistory, now, initialBMI]);
    
    // Check if any life steps (excluding initial weight measurement) have been logged
    const hasLoggedLifeSteps = lifeStory.length > 0;

    // Scroll to top when new items are added
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pastItems.length]);

    return (
        <div className="min-h-screen bg-brand-light font-sans">
            <main className="container mx-auto p-4 max-w-2xl">
                <MiniMe name={userInfo.name} avatar={avatar} level={level} points={points} communityGoal={communityGoal} lastEarnedCommunityBadge={lastEarnedCommunityBadge} onShowDetails={onShowAvatarDetails} />
                
                {/* Chat Button */}
                <button 
                    onClick={onOpenChatbot}
                    className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-xl shadow-md flex items-center gap-4 group transform transition-all hover:scale-[1.02] active:scale-95"
                >
                    <div className="p-2 bg-white/20 rounded-full text-white">
                        <MessageCircleIcon className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-grow">
                        <p className="font-bold text-white text-lg leading-tight">{t('mainScreen.chatWithEmaat')}</p>
                        <p className="text-indigo-100 text-xs">{t('chatbot.headerSubtitle')}</p>
                    </div>
                    <div className="text-white/60">
                        <ChevronRightIcon className="w-6 h-6" /> 
                    </div>
                </button>

                {upcomingItem && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-600 mb-2">{t('mainScreen.upcomingTitle')}</h2>
                        <UpcomingActivityCard 
                            item={upcomingItem}
                            onLogFromReminder={onLogFromReminder}
                            onSelectChallengeActivity={onSelectChallengeActivity}
                        />
                    </div>
                )}


                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-600 mb-2">{t('mainScreen.lifeStoryTitle')}</h2>
                    
                    {!hasLoggedLifeSteps ? (
                         <>
                            {initialBMI && <ul className="space-y-3 mb-4"><BMICard info={initialBMI} gender={userInfo.gender} /></ul>}
                            <TimelineWelcome onStartSleepChallenge={onStartSleepChallenge} />
                         </>
                    ) : (
                        <ul className="space-y-3">
                            {pastItems.map(item => {
                                if (item.itemType === 'step') {
                                    const step = item;
                                    
                                    // Try to find original activity to display summary if it's a braintainment step
                                    let braintainmentSummary: string | null = step.subtitle || null;

                                    if (!braintainmentSummary && step.challengeId && step.challengeActivityType === 'braintainment' && step.challengeActivityId) {
                                         const originalActivity = 
                                            challenge?.activities.find(a => a.id === step.challengeActivityId) || 
                                            challengeHistory.find(a => a.id === step.challengeActivityId);
                                         
                                         if (originalActivity) {
                                            let contentMap;
                                            switch(step.challengeId) {
                                                 case 'beweegChallenge': contentMap = beweegChallengeContent; break;
                                                 case 'voedingChallenge': contentMap = voedingChallengeContent; break;
                                                 case 'stopRokenChallenge': contentMap = stopRokenChallengeContent; break;
                                                 case 'socialChallenge': contentMap = socialChallengeContent; break;
                                                 case 'stressChallenge': contentMap = stressChallengeContent; break;
                                                 default: contentMap = sleepChallengeContent;
                                             }
                                             // @ts-ignore
                                             const content = contentMap[originalActivity.day as keyof typeof contentMap]?.[language];
                                             braintainmentSummary = content?.summary || null;
                                         }
                                    }

                                    return (
                                        <li key={step.id} onClick={() => onSelectStep(step)} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                            <div className="flex items-start">
                                                <div className={`mt-1 p-3 rounded-full bg-gray-100 ${step.activity.color}`}><step.activity.icon className="w-6 h-6" /></div>
                                                <div className="ml-4 flex-grow">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-semibold text-brand-dark">{step.overrideTitle || t(`activities.${step.activity.id}.name`)}</p>
                                                            {braintainmentSummary && <p className="text-sm text-gray-600 mt-1 line-clamp-3">{braintainmentSummary}</p>}
                                                            <p className="text-sm text-gray-500 mt-1">{formatDate(step.timestamp, language)}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1 font-bold text-brand-secondary flex-shrink-0 ml-2">
                                                            {step.pointsDoubled && <StarIcon className="w-4 h-4 text-amber-400" />}
                                                            <p>+{step.pointsAfter - step.pointsBefore} {t('common.pointsAbbreviation')}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Challenge Details Rendering for completed steps */}
                                                    {(step.challengeActivityType === 'morningCheckin' || step.challengeActivityType === 'eveningCheckin' || step.challengeActivityType === 'dailyAssignment') && (
                                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                                            <ChallengeResultDisplay item={step} goals={goals} />
                                                        </div>
                                                    )}

                                                    {step.memory && (
                                                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-3">
                                                            {step.memory.photoUrl && <MemoryPhoto memoryKey={step.memory.photoUrl} />}
                                                            <div className="flex-grow space-y-2">
                                                                {step.memory.isPrivate && (
                                                                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                                                        <LockIcon className="w-3 h-3"/>
                                                                        <span>{t('common.private')}</span>
                                                                    </div>
                                                                )}
                                                                {step.memory.content && (<p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded-md">"{step.memory.content.substring(0, 100)}{step.memory.content.length > 100 ? '...' : ''}"</p>)}
                                                                <MemoryDetailsDisplay memory={step.memory} activity={step.activity} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {step.earnedBadge && (
                                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-amber-700 bg-amber-50 p-2 rounded-md">
                                                    <AwardIcon className="w-5 h-5" />
                                                    <p className="text-sm font-semibold">{t('mainScreen.badgeUnlocked')}: {getBadgeName(step.earnedBadge)}</p>
                                                </div>
                                            )}
                                        </li>
                                    );
                                } else if (item.itemType === 'challenge') {
                                    return <ChallengeActivityCard key={item.id} item={item} onSelect={onSelectChallengeActivity} language={language} goals={goals} />;
                                } else if (item.itemType === 'measurement') {
                                    return <MeasurementCard key={item.id} item={item} language={language} />;
                                } else if (item.itemType === 'survey') {
                                    return <SurveyCard key={item.id} item={item} onSelect={onSelectSurvey} language={language} />;
                                } else if (item.itemType === 'journal') {
                                    return <JournalEntryCard key={item.id} entry={item} />;
                                } else if (item.itemType === 'bmi') {
                                    return <BMICard key="bmi-card" info={item} gender={userInfo.gender} />;
                                }
                                return null;
                            })}
                        </ul>
                    )}
                </div>
            </main>
            <FabMenu 
                onLogActivity={onLogActivity} 
                onLogMeasurement={onLogMeasurement} 
                onFillSurvey={onFillSurvey} 
                onLogSmoke={onLogSmoke} 
                onLogJournal={onLogJournal}
                onOpenChatbot={onOpenChatbot}
                onLogSnack={onLogSnack}
                onLogDrink={onLogDrink}
                challenge={challenge}
                activeJournal={activeJournal}
            />
        </div>
    );
};

export default MainScreen;
