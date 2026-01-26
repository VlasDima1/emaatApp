



import React, { FC, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Goals, Activity, View, ChallengeState, ChallengeId, JournalId, Measurement } from '../../types';
import { ACTIVITIES } from '../../constants';
import { GOAL_CONFIG } from '../../goals';
import { formatGoalText, goalKeyToActivityIdMap } from '../../utils';
import { PencilIcon, PlusIcon, XIcon, BedIcon, DumbbellIcon, UtensilsIcon, CheckCircleIcon, SmokingIcon, UsersIcon, BookOpenIcon, ClipboardListIcon, LeafIcon, ScaleIcon, HeartIcon } from '../Icons';
import ConfirmationModal from '../ConfirmationModal';
import { JOURNAL_CONFIG } from '../../journals';

interface PlanScreenProps {
    goals: Goals;
    challenge?: ChallengeState;
    activeJournal?: JournalId;
    measurements: Measurement[];
    onNavigate: (view: View) => void;
    onRemoveGoal: (keyofGoals: keyof Goals) => void;
    onStartSleepChallenge: () => void;
    onStartMovementChallenge: () => void;
    onStartVoedingChallenge: () => void;
    onStartStopRokenChallenge: () => void;
    onStartSocialChallenge: () => void;
    onStartStressChallenge: () => void;
    onStartHartfalenChallenge: () => void;
    onStopChallenge: () => Promise<void>;
    onStartJournal: (journalId: JournalId) => void;
    onStopJournal: () => void;
}

const ALL_CHALLENGES: { id: ChallengeId, icon: React.ComponentType<{ className?: string }>, color: string }[] = [
    { id: 'sleepChallenge', icon: BedIcon, color: 'text-indigo-500' },
    { id: 'beweegChallenge', icon: DumbbellIcon, color: 'text-sky-500' },
    { id: 'voedingChallenge', icon: UtensilsIcon, color: 'text-emerald-500' },
    { id: 'stopRokenChallenge', icon: SmokingIcon, color: 'text-slate-500' },
    { id: 'socialChallenge', icon: UsersIcon, color: 'text-amber-500' },
    { id: 'stressChallenge', icon: LeafIcon, color: 'text-teal-500' },
    { id: 'hartfalenChallenge', icon: HeartIcon, color: 'text-rose-500' },
];

const PlanScreen: FC<PlanScreenProps> = ({ goals, challenge, activeJournal, measurements, onNavigate, onRemoveGoal, onStartSleepChallenge, onStartMovementChallenge, onStartVoedingChallenge, onStartStopRokenChallenge, onStartSocialChallenge, onStartStressChallenge, onStartHartfalenChallenge, onStopChallenge, onStartJournal, onStopJournal }) => {
    const { t } = useLanguage();
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    
    const activeGoalsWithDetails: {
        activity: Activity | { id: string; icon: React.FC<{className?: string}>; color: string; };
        goalKey: keyof Goals;
        goalText: string | null;
        isChallengeGoal: boolean;
    }[] = (Object.keys(goals) as (keyof Goals)[])
        .map(goalKey => {
            const goalData = goals[goalKey];
            if (!goalData) return null;

            const isChallengeGoal = goalKey.toLowerCase().includes('challenge');
            if (goalKey === 'regularSleep' && challenge?.id !== 'sleepChallenge') return null;
            if (goalKey === 'regularSleep' && !isChallengeGoal && challenge?.id === 'sleepChallenge') return null;


            const activityId = goalKeyToActivityIdMap[goalKey];
            let activity = activityId ? ACTIVITIES.find(a => a.id === activityId) : undefined;
            if (!activity) {
                 if (goalKey === 'regularSleep') {
                     activity = { id: 'sleep', icon: BedIcon, color: 'text-indigo-500', points: 0, pillar: 'sleep', minLevel: 1 } as Activity;
                 } else if (goalKey === 'weight') {
                    activity = { id: 'weight', icon: ScaleIcon, color: 'text-teal-500', points: 0, pillar: 'nutrition', minLevel: 1} as Activity;
                 } else {
                     return null;
                 }
            }

            return {
                activity,
                goalKey,
                goalText: formatGoalText(activity, goalData, t),
                isChallengeGoal: isChallengeGoal || goalKey === 'regularSleep',
            };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);


    const allGoalKeys = Object.keys(GOAL_CONFIG) as (keyof Goals)[];
    const activeGoalKeys = Object.keys(goals);
    const availableGoalKeys = allGoalKeys.filter(key => 
        !activeGoalKeys.includes(key) && 
        !key.toLowerCase().includes('challenge') &&
        key !== 'regularSleep'
    );

    // Use the passed props directly, as they now route to the preview
    const startHandlers: Record<ChallengeId, () => void> = {
        sleepChallenge: onStartSleepChallenge,
        beweegChallenge: onStartMovementChallenge,
        voedingChallenge: onStartVoedingChallenge,
        stopRokenChallenge: onStartStopRokenChallenge,
        socialChallenge: onStartSocialChallenge,
        stressChallenge: onStartStressChallenge,
        hartfalenChallenge: onStartHartfalenChallenge,
    };

    const handleStartChallenge = (challengeId: ChallengeId) => {
        const handler = startHandlers[challengeId];
        if (!challenge) {
            handler();
            return;
        }

        setModalConfig({
            isOpen: true,
            title: t('planScreen.switchChallengeConfirmationTitle'),
            message: t('planScreen.switchChallengeConfirmationMessage', {
                newChallengeName: t(`challenge.${challengeId}.name`),
                currentChallengeName: t(`challenge.${challenge.id}.name`),
            }),
            onConfirm: () => {
                onStopChallenge();
                handler();
                setModalConfig({ ...modalConfig, isOpen: false });
            },
        });
    };
    
    const handleStopChallenge = () => {
        if (!challenge) return;
        setModalConfig({
            isOpen: true,
            title: t('planScreen.stopChallengeConfirmationTitle'),
            message: t('planScreen.stopChallengeConfirmationMessage', { challengeName: t(`challenge.${challenge.id}.name`) }),
            onConfirm: () => {
                onStopChallenge();
                setModalConfig({ ...modalConfig, isOpen: false });
            },
        });
    };

    const handleNavigateToGoal = (goalKey: keyof Goals) => {
        const activityId = goalKeyToActivityIdMap[goalKey];
        const activity = activityId ? ACTIVITIES.find(a => a.id === activityId) : undefined;
        onNavigate({ name: 'setGoal', goalKey, activity, measurements, source: 'plan' });
    };

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 pb-24 animate-fade-in">
            <header className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-brand-dark">{t('planScreen.title')}</h2>
            </header>

            <div className="max-w-2xl mx-auto space-y-6">
                 {/* Journals Section */}
                <section>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('planScreen.journalsTitle')}</h3>
                    {activeJournal ? (
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                             <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 p-3 rounded-full bg-gray-100 text-teal-500">
                                    <BookOpenIcon className="w-6 h-6" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-brand-dark">{t(JOURNAL_CONFIG[activeJournal].nameKey)}</h3>
                                    <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold"><CheckCircleIcon className="w-4 h-4" /><span>{t('planScreen.active')}</span></div>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end gap-2">
                                <button onClick={() => onNavigate({ name: 'logJournal', journalId: activeJournal })} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200">
                                    <PencilIcon className="w-4 h-4" />{t('planScreen.logJournalButton')}
                                </button>
                                <button onClick={onStopJournal} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-rose-700 bg-rose-100 rounded-md hover:bg-rose-200">
                                    <XIcon className="w-4 h-4" />{t('planScreen.stopJournalButton')}
                                </button>
                            </div>
                        </div>
                    ) : (
                         <div className="text-center py-4 px-4 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500 text-sm mb-3">{t('planScreen.noActiveJournal')}</p>
                             <details className="group">
                                <summary className="cursor-pointer text-sm font-semibold text-brand-primary hover:underline list-none">
                                    {t('planScreen.availableJournalsTitle')}
                                </summary>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                                    {(Object.keys(JOURNAL_CONFIG) as JournalId[]).map(journalId => {
                                        const config = JOURNAL_CONFIG[journalId];
                                        const Icon = config.icon;
                                        return (
                                             <button key={journalId} onClick={() => onStartJournal(journalId)} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-full bg-white"><Icon className="w-5 h-5 text-teal-500" /></div>
                                                    <div>
                                                        <p className="font-semibold text-brand-dark">{t(config.nameKey)}</p>
                                                        <p className="text-xs text-gray-500">{t(config.descriptionKey)}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                             </details>
                        </div>
                    )}
                </section>
                
                {/* Active Challenge */}
                <section>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('planScreen.activeChallengeTitle')}</h3>
                    {challenge ? (
                        ALL_CHALLENGES.filter(c => c.id === challenge.id).map(c => (
                            <div key={c.id} className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className={`flex-shrink-0 p-3 rounded-full bg-gray-100 ${c.color}`}><c.icon className="w-6 h-6" /></div>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-brand-dark">{t(`challenge.${c.id}.name`)}</h3>
                                        <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold"><CheckCircleIcon className="w-4 h-4" /><span>{t('planScreen.active')}</span></div>
                                    </div>
                                    <button onClick={handleStopChallenge} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-rose-700 bg-rose-100 rounded-md hover:bg-rose-200">
                                        <XIcon className="w-4 h-4" />{t('planScreen.stopChallenge')}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                         <div className="text-center py-6 px-4 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500">{t('challenge.noActiveChallenge')}</p>
                        </div>
                    )}
                </section>
                
                {/* Available Challenges */}
                {!challenge && (
                    <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('planScreen.availableChallengesTitle')}</h3>
                        <div className="space-y-4">
                            {ALL_CHALLENGES.map(c => (
                                <div key={c.id} className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex-shrink-0 p-3 rounded-full bg-gray-100 ${c.color}`}><c.icon className="w-6 h-6" /></div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-brand-dark">{t(`challenge.${c.id}.name`)}</h3>
                                            <p className="text-sm text-gray-600">{t(`challenge.${c.id}.inactiveNotice`)}</p>
                                        </div>
                                        <button onClick={() => handleStartChallenge(c.id)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-brand-primary rounded-md hover:bg-indigo-700">
                                            <PlusIcon className="w-4 h-4" />{t('planScreen.startChallenge')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Active Goals */}
                <section>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('planScreen.activeGoalsTitle')}</h3>
                    {activeGoalsWithDetails.length > 0 ? (
                        <ul className="space-y-3">
                            {activeGoalsWithDetails.map(({ activity, goalKey, goalText, isChallengeGoal }) => {
                                const activityName = t(GOAL_CONFIG[goalKey].nameKey);
                                const logActivityId = goalKeyToActivityIdMap[goalKey];
                                return (
                                     <li key={`${activity.id}-${goalKey}`} className="bg-white p-4 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className={`flex-shrink-0 p-3 rounded-full bg-gray-100 ${activity.color}`}><activity.icon className="w-6 h-6" /></div>
                                            <div className="flex-grow">
                                                <h3 className="font-semibold text-brand-dark">{activityName}</h3>
                                                <p className="text-sm text-gray-600">{goalText}</p>
                                            </div>
                                        </div>
                                        {!isChallengeGoal && (
                                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end gap-2">
                                                {logActivityId && (
                                                    <button onClick={() => {
                                                        const activityToLog = ACTIVITIES.find(a => a.id === logActivityId);
                                                        if (activityToLog) {
                                                            onNavigate({ name: 'addMemory', activityInfo: activityToLog, goal: goals[goalKey] });
                                                        }
                                                    }} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-brand-secondary rounded-md hover:bg-emerald-600">
                                                        <ClipboardListIcon className="w-4 h-4" />{t('planScreen.logButton')}
                                                    </button>
                                                )}
                                                <button onClick={() => handleNavigateToGoal(goalKey)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200">
                                                    <PencilIcon className="w-4 h-4" />{t('planScreen.changeGoal')}
                                                </button>
                                                <button onClick={() => onRemoveGoal(goalKey)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-rose-700 bg-rose-100 rounded-md hover:bg-rose-200">
                                                    <XIcon className="w-4 h-4" />{t('planScreen.removeGoal')}
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                         <div className="text-center py-6 px-4 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500">{t('planScreen.noGoalSet')}</p>
                        </div>
                    )}
                </section>
                
                {/* Available Goals */}
                <section>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('planScreen.availableGoalsTitle')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {availableGoalKeys.map(goalKey => {
                            const config = GOAL_CONFIG[goalKey];
                            const activityId = goalKeyToActivityIdMap[goalKey];
                            let activity: Activity | null = activityId ? ACTIVITIES.find(a => a.id === activityId) : null;
                            if (!activity && goalKey === 'weight') {
                                activity = { id: 'weight', icon: ScaleIcon, color: 'text-teal-500'} as any;
                            }
                            if (!config || !activity) return null;

                            return (
                                 <button key={goalKey} onClick={() => handleNavigateToGoal(goalKey)} className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                                    <div className={`flex-shrink-0 p-2 rounded-full bg-gray-100 ${activity.color}`}><activity.icon className="w-5 h-5" /></div>
                                    <span className="font-semibold text-brand-dark text-sm">{t(config.nameKey)}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={t('planScreen.confirmStop')}
                cancelText={t('planScreen.cancel')}
            />
        </div>
    );
};

export default PlanScreen;