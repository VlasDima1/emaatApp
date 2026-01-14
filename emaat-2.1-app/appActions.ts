
import { Dispatch } from 'react';
import { AppState, Action, Memory, Language, LifeStep, Badge, ProcessedStepPayload, Goals, Activity, Reminder, Quiz, ChallengeActivity, BraintainmentData, MovementMorningCheckinData, MovementEveningCheckinData, SocialMorningCheckinData, SocialEveningCheckinData, StressMorningCheckinData, StressEveningCheckinData, Measurement, HeartRateMeasurement, ProcessedChallengeStepPayload, ChallengeId, LifestylePillar, View, CommunityGoal, BadgeTier } from './types';
import { POINTS_PER_LEVEL, BADGES, ACTIVITIES } from './constants';
import { setAsset, getAsset } from './db';
import { formatGoalText, formatMemoryDetailsText, activityIdToGoalKeyMap, getTodayDateString, generateCommunityGoal } from './utils';
import { BedIcon, DumbbellIcon, UtensilsIcon, SmokingIcon, UsersIcon, LeafIcon } from './components/Icons';

const getEarnedBadges = (activityPoints: Record<string, number>): Badge[] => {
    const earned: Badge[] = [];
    for (const badge of BADGES) {
        if ((activityPoints[badge.activityId] || 0) >= badge.threshold) {
            earned.push(badge);
        }
    }
    return earned;
};

const calculateNextReminder = (activityId: string, lifeStory: LifeStep[]): Reminder | null => {
    const relevantSteps = lifeStory.filter(s => s.activity.id === activityId).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    if (relevantSteps.length === 0) return null;

    const lastStep = relevantSteps[0];
    let predictedAt: Date | null = null;

    switch (activityId) {
        case 'sleep':
        case 'read':
            predictedAt = new Date(lastStep.timestamp);
            predictedAt.setDate(predictedAt.getDate() + 1);
            break;
        case 'exercise':
        case 'hobby':
        case 'social':
        case 'nature':
        case 'relax':
        case 'meal':
            if (relevantSteps.length >= 2) {
                const secondLastStep = relevantSteps[1];
                const interval = lastStep.timestamp.getTime() - secondLastStep.timestamp.getTime();
                // To prevent spammy reminders, only set one if the interval is > 2 hours
                if (interval > 2 * 60 * 60 * 1000) {
                   predictedAt = new Date(lastStep.timestamp.getTime() + interval);
                }
            }
            break;
    }

    if (predictedAt) {
        // Don't schedule reminders in the past
        if (predictedAt.getTime() < Date.now()) {
            return null;
        }

        const visibleAt = new Date(predictedAt.getTime() - 60 * 60 * 1000); // 1 hour before
        return {
            id: `${activityId}-${predictedAt.getTime()}`,
            activityId,
            predictedAt,
            visibleAt,
        };
    }
    return null;
};


const performStepCalculations = async (
    state: AppState,
    activity: Activity,
    pointsDoubled: boolean,
    memory: Memory | undefined,
    nudge: string,
    avatarAfter: string,
    audioData: string | null
): Promise<ProcessedStepPayload> => {

    if (!state.currentAvatar) throw new Error("Current avatar is null during calculation");

    const awardedPoints = pointsDoubled ? activity.points * 2 : activity.points;

    const todayStr = getTodayDateString();
    let newStreak = state.currentStreak;
    if (state.lastActivityDate !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        newStreak = (state.lastActivityDate === yesterdayStr) ? state.currentStreak + 1 : 1;
    }
    
    // --- Community Goal Logic ---
    let communityGoal = state.communityGoal;
    let goalReached = false;
    let lastEarnedCommunityBadge = state.lastEarnedCommunityBadge;
    
    // Generate a goal if none exists
    if (!communityGoal) {
        communityGoal = generateCommunityGoal(state.challenge?.id);
    }

    // Daily Reset Logic: If the date has changed, reset the community goal progress to 0 for the new day
    if (state.lastActivityDate !== todayStr && communityGoal) {
         communityGoal = { ...communityGoal, currentProgress: 0 };
    }

    // Determine user contribution based on goal type
    let userContribution = 0;
    
    // Default contribution logic for "Active Steps" (No challenge active)
    if (communityGoal.type === 'active_steps') {
         userContribution = 1; // Any logged activity counts as 1 step
    } 
    // Specific logic for other goal types if a measurement was passed (e.g. steps from measurement screen)
    // But here in performStepCalculations we mainly handle generic activities.
    // If logged 'nature' (walking), we can estimate steps if not provided, but usually steps come via 'addMeasurement'.
    else if (communityGoal.type === 'total_steps' && activity.id === 'nature') {
        userContribution = 2000; // Rough estimate if not measured
    }
    else if (communityGoal.type === 'sleep_hours' && activity.id === 'sleep') {
         // If memory has duration, use it
         if (memory && memory.duration) {
             userContribution = memory.duration.hours + (memory.duration.minutes / 60);
         } else {
             userContribution = 7; // Default estimate
         }
    }
    else if (communityGoal.type === 'meal_photos' && activity.id === 'meal' && memory?.photoUrl) {
        userContribution = 1;
    }
    else if (communityGoal.type === 'generic') {
        userContribution = 1;
    }

    // Simulate community contribution (randomly for the other 22 participants)
    // We simulate that on any given action, a few other members also contribute something.
    // Scale simulation based on target to ensure progress feels alive but not instant.
    let communityContribution = 0;
    const participants = 23;
    const simulationFactor = Math.random(); // 0 to 1 random factor
    
    if (communityGoal.type === 'total_steps') {
         // Simulate 1-5 people walking ~2000 steps
         communityContribution = Math.floor(simulationFactor * 5 * 2000);
    } else if (communityGoal.type === 'sleep_hours') {
         // Sleep is usually logged once, so small chance others log it now
         communityContribution = simulationFactor > 0.8 ? 8 : 0;
    } else if (communityGoal.type === 'active_steps' || communityGoal.type === 'meal_photos' || communityGoal.type === 'smoking_assignments' || communityGoal.type === 'stress_exercises') {
         // Simulate 0-3 others doing an action
         communityContribution = Math.floor(simulationFactor * 3);
    }

    
    let newProgress = communityGoal.currentProgress + userContribution + communityContribution;

    // Cap progress at target if reached (or handle overflow if desired)
    if (newProgress >= communityGoal.target) {
        goalReached = true;
        // For daily goals, once reached, we stay at max or show celebration. 
        // We don't necessarily reset immediately, wait for next day.
        // But to keep it interesting, we can allow over-achievement or just cap it.
        // Let's cap it for display simplicity, or let it go over. Let's cap to target for now to trigger "Completed".
        newProgress = Math.max(newProgress, communityGoal.target); 
    }
    
    communityGoal = { ...communityGoal, currentProgress: newProgress };

    // ----------------------------

    const pointsAfter = state.points + awardedPoints;
    const levelBefore = Math.floor(state.points / POINTS_PER_LEVEL) + 1;
    const levelAfter = Math.floor(pointsAfter / POINTS_PER_LEVEL) + 1;

    const newPillarPoints = { ...state.pillarPoints, [activity.pillar]: (state.pillarPoints[activity.pillar] || 0) + awardedPoints };
    const newActivityPoints = { ...state.activityPoints, [activity.id]: (state.activityPoints[activity.id] || 0) + awardedPoints };
    
    let newBadge: Badge | undefined = undefined;
    
    // Check normal badges
    const previousBadges = getEarnedBadges(state.activityPoints);
    const currentBadges = getEarnedBadges(newActivityPoints);
    if (currentBadges.length > previousBadges.length) {
      newBadge = currentBadges.find(b => 
        !previousBadges.some(pb => pb.activityId === b.activityId && pb.tier === b.tier) && b.activityId === activity.id
      );
    }
    
    // Award community badge if goal reached
    if (goalReached && communityGoal) {
         // Determine next badge tier based on previous community badge
         let nextTier: BadgeTier = 'bronze';
         if (lastEarnedCommunityBadge) {
             if (lastEarnedCommunityBadge.tier === 'bronze') nextTier = 'silver';
             else if (lastEarnedCommunityBadge.tier === 'silver') nextTier = 'gold';
             else nextTier = 'platinum';
         }
         
         newBadge = { activityId: communityGoal.rewardBadgeId, tier: nextTier, threshold: communityGoal.target };
         lastEarnedCommunityBadge = newBadge;
    }

    const newStepId = `${Date.now()}-${activity.id}`;
    const avatarBeforeKey = newStepId + '-avatarBefore';
    const avatarAfterKey = newStepId + '-avatarAfter';
    const audioDataKey = audioData ? newStepId + '-audio' : null;
    let memoryWithKey: Memory | undefined = memory;

    const assetPromises: Promise<void>[] = [
        setAsset(avatarBeforeKey, state.currentAvatar),
        setAsset(avatarAfterKey, avatarAfter),
    ];
    if (audioData && audioDataKey) {
        assetPromises.push(setAsset(audioDataKey, audioData));
    }
    if (memory?.photoUrl) {
        const memoryKey = newStepId + '-memoryPhoto';
        assetPromises.push(setAsset(memoryKey, memory.photoUrl));
        memoryWithKey = { ...memory, photoUrl: memoryKey };
    }
    await Promise.all(assetPromises);

    const newStep: LifeStep = {
        id: newStepId,
        activity,
        timestamp: new Date(),
        nudge,
        pointsBefore: state.points,
        pointsAfter,
        avatarBefore: avatarBeforeKey,
        avatarAfter: avatarAfterKey,
        pointsDoubled,
        audioData: audioDataKey,
        memory: memoryWithKey,
        earnedBadge: newBadge
    };
    
    // Calculate next reminder
    const newLifeStory = [newStep, ...state.lifeStory];
    const nextReminder = calculateNextReminder(activity.id, newLifeStory);
    const updatedReminders = state.reminders.filter(r => r.activityId !== activity.id);
    if (nextReminder) {
        updatedReminders.push(nextReminder);
    }
    
    return {
        lifeStory: newLifeStory,
        points: pointsAfter,
        pillarPoints: newPillarPoints,
        activityPoints: newActivityPoints,
        currentAvatar: avatarAfter, // Pass the data URL for immediate display
        currentStreak: newStreak,
        communityGoal: communityGoal, // Updated goal
        lastEarnedCommunityBadge, // Updated badge state
        lastActivityDate: todayStr,
        showConfetti: !!newBadge, // Only show confetti if a badge was earned
        view: { name: 'timeline' },
        loadingMessageKey: null,
        reminders: updatedReminders,
    };
};

export const processNewStep = async (
    dispatch: Dispatch<Action>,
    state: AppState,
    memory: Memory | undefined,
    t: (key: string, replacements?: Record<string, string | number>) => string,
    language: Language,
    activityOverride?: Activity
): Promise<ProcessedStepPayload | undefined> => {
    
    const activity = activityOverride || (state.view.name === 'addMemory' ? state.view.activityInfo : null);

    if (!activity || 'challengeId' in activity) {
        console.error("processNewStep called without a valid activity or with a challenge activity");
        return undefined;
    }

    try {
        dispatch({ type: 'SET_LOADING', payload: 'loading.processingStep' });
        
        const nudge = t('common.genericNudge');

        if (!state.currentAvatar) throw new Error("Avatar not available");
        
        const avatarAfter = state.currentAvatar;
        const audioData = null;
        
        const payload = await performStepCalculations(state, activity, false, memory, nudge, avatarAfter, audioData);
        // Returning payload instead of dispatching directly to allow for Doctor animation intervention
        dispatch({ type: 'SET_LOADING', payload: null });
        return payload;
        
    } catch (error) {
        console.error("CRITICAL ERROR during step processing:", error);
        dispatch({ type: 'SET_LOADING', payload: null });
        dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } });
        return undefined;
    }
};

export const handleQuizAnswer = async (
    dispatch: Dispatch<Action>,
    state: AppState,
    selectedOption: string,
    t: (key: string, replacements?: Record<string, string | number>) => string,
    language: Language
): Promise<ProcessedStepPayload | undefined> => {
    if (state.view.name !== 'quiz') {
        console.error("handleQuizAnswer called from an invalid view state:", state.view.name);
        return undefined;
    }
    
    try {
        dispatch({ type: 'SET_LOADING', payload: 'loading.processingStep' });
        const { data } = state.view;
        const isCorrect = selectedOption === data.quizData.correctOption;
        const nudge = t('common.genericNudge');

        if (!state.currentAvatar) throw new Error("Avatar not available");
        
        const avatarAfter = state.currentAvatar;
        const audioData = null;
        
        const payload = await performStepCalculations(state, data.selectedActivity, isCorrect, data.memory, nudge, avatarAfter, audioData);
        dispatch({ type: 'SET_LOADING', payload: null });
        return payload;

    } catch (error) {
        console.error("CRITICAL ERROR after quiz answer:", error);
        dispatch({ type: 'SET_LOADING', payload: null });
        dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } });
        return undefined;
    }
};

const challengeIdToActivityMap: Record<ChallengeId, Partial<Activity>> = {
    sleepChallenge: { id: 'sleep', icon: BedIcon, color: 'text-indigo-500', pillar: 'sleep' },
    beweegChallenge: { id: 'exercise', icon: DumbbellIcon, color: 'text-sky-500', pillar: 'exercise' },
    voedingChallenge: { id: 'meal', icon: UtensilsIcon, color: 'text-emerald-500', pillar: 'nutrition' },
    stopRokenChallenge: { id: 'smoke', icon: SmokingIcon, color: 'text-slate-500', pillar: 'stress_reduction' },
    socialChallenge: { id: 'social', icon: UsersIcon, color: 'text-amber-500', pillar: 'social' },
    stressChallenge: { id: 'relax', icon: LeafIcon, color: 'text-teal-500', pillar: 'stress_reduction' },
};

const mapChallengeActivityToActivity = (challengeActivity: ChallengeActivity): Activity | null => {
    const baseActivity = challengeIdToActivityMap[challengeActivity.challengeId];
    if (!baseActivity) return null;

    const realActivity = ACTIVITIES.find(a => a.id === baseActivity.id);
    if (realActivity) {
        return realActivity;
    }

    if (baseActivity.id && baseActivity.icon && baseActivity.color && baseActivity.pillar) {
        return {
            id: baseActivity.id,
            icon: baseActivity.icon,
            color: baseActivity.color,
            pillar: baseActivity.pillar as LifestylePillar,
            points: 0, // Points are calculated separately
            minLevel: 1,
        };
    }
    
    return null;
};

const calculateChallengePointsAndMeasurements = (challengeActivity: ChallengeActivity, goals: Goals): { pointsToAdd: number, newMeasurements: Measurement[] } => {
    let pointsToAdd = 5;
    const newMeasurements: Measurement[] = [];
    
    if (challengeActivity.type === 'braintainment' && challengeActivity.data && 'quizScore' in challengeActivity.data) {
        pointsToAdd += (challengeActivity.data.quizScore as number) * 5;
    }
    if (challengeActivity.challengeId === 'beweegChallenge' && challengeActivity.type === 'morningCheckin' && challengeActivity.data && (challengeActivity.data as MovementMorningCheckinData).didExercise) {
        pointsToAdd += 5;
    }
    if (challengeActivity.challengeId === 'beweegChallenge' && challengeActivity.type === 'eveningCheckin' && goals.movementChallenge && challengeActivity.data) {
        const eveningData = challengeActivity.data as MovementEveningCheckinData;
        const goalSteps = goals.movementChallenge.steps;
        if (goalSteps > 0) {
            const pointsForSteps = Math.min(15, Math.round((eveningData.steps / goalSteps) * 10));
            pointsToAdd += pointsForSteps;
        }
    }
    if (challengeActivity.challengeId === 'socialChallenge') {
        if (challengeActivity.type === 'morningCheckin' && challengeActivity.data) {
            const morningData = challengeActivity.data as SocialMorningCheckinData;
            pointsToAdd += Math.round(morningData.socialEnergy / 2); // Max 5 points
        }
        if (challengeActivity.type === 'eveningCheckin' && challengeActivity.data) {
            const eveningData = challengeActivity.data as SocialEveningCheckinData;
            pointsToAdd += Math.round(eveningData.interactionQuality / 2); // Max 5 points
            if(eveningData.actionCompleted === 'yes') pointsToAdd += 5;
            if(eveningData.actionCompleted === 'partly') pointsToAdd += 2;
        }
    }
    if (challengeActivity.challengeId === 'stressChallenge') {
        if ((challengeActivity.type === 'morningCheckin' || challengeActivity.type === 'eveningCheckin') && challengeActivity.data) {
            const data = challengeActivity.data as StressMorningCheckinData | StressEveningCheckinData;
            const completedAt = challengeActivity.completedAt || new Date();
            if (data.pulseBefore > 0 && data.pulseAfter > 0) {
                newMeasurements.push({ id: `m-hr-${completedAt.getTime()}-before`, type: 'heartRate', value: data.pulseBefore, condition: 'resting', timestamp: completedAt, } as HeartRateMeasurement);
                const afterTimestamp = new Date(completedAt.getTime() + 1000);
                newMeasurements.push({ id: `m-hr-${afterTimestamp.getTime()}-after`, type: 'heartRate', value: data.pulseAfter, condition: 'resting', timestamp: afterTimestamp, } as HeartRateMeasurement);
                if (data.pulseAfter < data.pulseBefore) {
                    const earnedPoints = Math.min(10, data.pulseBefore - data.pulseAfter);
                    pointsToAdd += earnedPoints;
                    data.earnedPoints = earnedPoints;
                } else {
                    data.earnedPoints = 0;
                }
            } else {
                data.earnedPoints = 0;
            }
        }
    }

    return { pointsToAdd, newMeasurements };
};

const performChallengeStepCalculations = async (
    state: AppState,
    activity: Activity,
    challengeActivity: ChallengeActivity,
    pointsToAdd: number,
    newMeasurements: Measurement[],
    nudge: string,
    avatarAfter: string,
    audioData: string | null,
    overrideTitle: string,
    subtitle?: string
): Promise<ProcessedChallengeStepPayload> => {

    if (!state.currentAvatar) throw new Error("Current avatar is null during calculation");

    const todayStr = getTodayDateString();
    let newStreak = state.currentStreak;
    if (state.lastActivityDate !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        newStreak = (state.lastActivityDate === yesterdayStr) ? state.currentStreak + 1 : 1;
    }

    // --- Community Goal Logic (Challenge Variation) ---
    let communityGoal = state.communityGoal;
    let goalReached = false;
    let lastEarnedCommunityBadge = state.lastEarnedCommunityBadge;
    
    if (!communityGoal) {
         communityGoal = generateCommunityGoal(challengeActivity.challengeId);
    }

    // Daily Reset Logic
    if (state.lastActivityDate !== todayStr && communityGoal) {
        // If switching days, reset progress for the new day target
        communityGoal = { ...communityGoal, currentProgress: 0 };
   }

    // Determine user contribution based on goal type and challenge activity
    let userContribution = 0;
    if (communityGoal.type === 'total_steps' && challengeActivity.data && 'steps' in challengeActivity.data) {
         userContribution = (challengeActivity.data as MovementEveningCheckinData).steps || 0;
    } else if (communityGoal.type === 'sleep_hours' && challengeActivity.data && 'sleepDuration' in challengeActivity.data) {
         const dur = (challengeActivity.data as any).sleepDuration;
         userContribution = dur ? dur.hours + (dur.minutes / 60) : 0;
    } else if (communityGoal.type === 'meal_photos' && (challengeActivity.type === 'breakfastCheckin' || challengeActivity.type === 'lunchCheckin' || challengeActivity.type === 'dinnerCheckin') && challengeActivity.memory?.photoUrl) {
        userContribution = 1;
    } else if (communityGoal.type === 'smoking_assignments' && challengeActivity.challengeId === 'stopRokenChallenge') {
        // Assignments or check-ins count
        userContribution = 1;
    } else if (communityGoal.type === 'stress_exercises' && challengeActivity.challengeId === 'stressChallenge') {
         // Morning breathing or evening relaxation counts
         userContribution = 1;
    }

     // Simulate community contribution
    const simulationFactor = Math.random();
    let communityContribution = 0;

    if (communityGoal.type === 'total_steps') {
        communityContribution = Math.floor(simulationFactor * 5 * 2000);
    } else if (communityGoal.type === 'sleep_hours') {
        // Assuming logic runs in morning, others might have logged sleep
        communityContribution = simulationFactor > 0.7 ? 8 * 3 : 0; 
    } else {
        communityContribution = Math.floor(simulationFactor * 3);
    }
    
    let newProgress = communityGoal.currentProgress + userContribution + communityContribution;
    if (newProgress >= communityGoal.target) {
        goalReached = true;
        newProgress = Math.max(newProgress, communityGoal.target); 
    }
    communityGoal = { ...communityGoal, currentProgress: newProgress };
    
    // --------------------------------------------

    const pointsAfter = state.points + pointsToAdd;
    const levelBefore = Math.floor(state.points / POINTS_PER_LEVEL) + 1;
    const levelAfter = Math.floor(pointsAfter / POINTS_PER_LEVEL) + 1;

    const newPillarPoints = { ...state.pillarPoints, [activity.pillar]: (state.pillarPoints[activity.pillar] || 0) + pointsToAdd };
    const newActivityPoints = { ...state.activityPoints, [activity.id]: (state.activityPoints[activity.id] || 0) + pointsToAdd };
    
    let newBadge: Badge | undefined = undefined;
    const previousBadges = getEarnedBadges(state.activityPoints);
    const currentBadges = getEarnedBadges(newActivityPoints);
    if (currentBadges.length > previousBadges.length) {
      newBadge = currentBadges.find(b => 
        !previousBadges.some(pb => pb.activityId === b.activityId && pb.tier === b.tier) && b.activityId === activity.id
      );
    }
    
    // Community Badge Logic
    if (goalReached && communityGoal) {
         let nextTier: BadgeTier = 'bronze';
         if (lastEarnedCommunityBadge) {
             if (lastEarnedCommunityBadge.tier === 'bronze') nextTier = 'silver';
             else if (lastEarnedCommunityBadge.tier === 'silver') nextTier = 'gold';
             else nextTier = 'platinum';
         }
         
         newBadge = { activityId: communityGoal.rewardBadgeId, tier: nextTier, threshold: communityGoal.target };
         lastEarnedCommunityBadge = newBadge;
    }

    const newStepId = `${Date.now()}-challenge-${activity.id}`;
    const avatarBeforeKey = newStepId + '-avatarBefore';
    const avatarAfterKey = newStepId + '-avatarAfter';
    const audioDataKey = audioData ? newStepId + '-audio' : null;
    let memoryWithKey: Memory | undefined = challengeActivity.memory;

    const assetPromises: Promise<void>[] = [
        setAsset(avatarBeforeKey, state.currentAvatar),
        setAsset(avatarAfterKey, avatarAfter),
    ];
    if (audioData && audioDataKey) assetPromises.push(setAsset(audioDataKey, audioData));
    if (memoryWithKey?.photoUrl && memoryWithKey.photoUrl.startsWith('data:')) {
        const memoryKey = newStepId + '-memoryPhoto';
        assetPromises.push(setAsset(memoryKey, memoryWithKey.photoUrl));
        memoryWithKey = { ...memoryWithKey, photoUrl: memoryKey };
    }
    await Promise.all(assetPromises);

    const newStep: LifeStep = {
        id: newStepId,
        activity,
        timestamp: challengeActivity.completedAt || new Date(),
        nudge,
        pointsBefore: state.points,
        pointsAfter,
        avatarBefore: avatarBeforeKey,
        avatarAfter: avatarAfterKey,
        audioData: audioDataKey,
        memory: memoryWithKey,
        earnedBadge: newBadge,
        challengeActivityId: challengeActivity.id,
        overrideTitle,
        subtitle,
        challengeId: challengeActivity.challengeId,
        challengeActivityType: challengeActivity.type,
        challengeActivityData: challengeActivity.data,
    };
    
    return {
        newLifeStep: newStep,
        updatedChallengeActivity: { ...challengeActivity, memory: memoryWithKey },
        newMeasurements,
        points: pointsAfter,
        pillarPoints: newPillarPoints,
        activityPoints: newActivityPoints,
        currentAvatar: avatarAfter,
        currentStreak: newStreak,
        communityGoal, // Updated Goal
        lastEarnedCommunityBadge, // Updated badge state
        lastActivityDate: todayStr,
        showConfetti: !!newBadge,
        loadingMessageKey: null,
    };
};

export const processCompletedChallengeActivity = async (
    dispatch: Dispatch<Action>,
    state: AppState,
    challengeActivity: ChallengeActivity,
    t: (key: string, replacements?: Record<string, string | number>) => string,
    language: Language,
    subtitle?: string
): Promise<ProcessedChallengeStepPayload | undefined> => {
    try {
        const activity = mapChallengeActivityToActivity(challengeActivity);
        if (!activity) {
            console.warn("Could not map challenge activity, only updating state.", challengeActivity);
            dispatch({ type: 'UPDATE_CHALLENGE_ACTIVITY', payload: challengeActivity });
            return undefined;
        }

        const { pointsToAdd, newMeasurements } = calculateChallengePointsAndMeasurements(challengeActivity, state.goals);
        
        let overrideTitle = t(`challenge.${challengeActivity.challengeId}.${challengeActivity.type}.title`);
        if (challengeActivity.type === 'introduction') {
            overrideTitle = t(`challenge.${challengeActivity.challengeId}.name`);
        }

        const nudge = t('challenge.genericNudge');

        if (!state.currentAvatar) throw new Error("Avatar not available");
        
        const avatarAfter = state.currentAvatar; // NO AVATAR UPDATE
        const audioData = null; // NO AUDIO

        const payload = await performChallengeStepCalculations(state, activity, challengeActivity, pointsToAdd, newMeasurements, nudge, avatarAfter, audioData, overrideTitle, subtitle);
        
        return payload;

    } catch (error) {
        console.error("CRITICAL ERROR during challenge step processing:", error);
        // Dispatch only the status update on error, so the task is marked as done.
        dispatch({ type: 'UPDATE_CHALLENGE_ACTIVITY', payload: challengeActivity });
        // rethrow to be caught by caller in App.tsx
        throw error;
    }
};