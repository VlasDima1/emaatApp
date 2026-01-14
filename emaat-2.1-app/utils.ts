
import { Activity, Goals, Memory, AppState, MovementChallengeGoal, Reminder, ReminderSettings, DailyWalkingGoal, MovingBreaksGoal, StrengthGoal, RegularSleepGoal, ScreenOffGoal, RealFoodGoal, FruitVegGoal, WaterGoal, AlcoholGoal, CalmTimeGoal, SocialContactGoal, TimeOutsideGoal, SmokingGoal, WeightGoal, JournalId, ChallengeActivity, ChallengeId, CommunityGoal } from './types';
import { ACTIVITIES, BADGES } from './constants';
import { JOURNAL_CONFIG } from './journals';

export const goalKeyToActivityIdMap: Record<string, string> = {
    dailyWalking: 'nature',
    strength: 'exercise',
    realFood: 'meal',
    calmTime: 'relax',
    socialContact: 'social',
    smoking: 'smoke',
    movingBreaks: 'relax',
    screenOff: 'relax',
    fruitVeg: 'meal',
    water: 'meal',
    timeOutside: 'nature',
    hobby: 'hobby',
    sport: 'exercise',
    reading: 'read',
    social: 'social'
};

export const generateCommunityGoal = (challengeId?: ChallengeId): CommunityGoal => {
    const participants = 23;
    
    // Start with some progress (simulate that others have already started today)
    const progressFactor = 0.1 + Math.random() * 0.2; 

    if (challengeId === 'beweegChallenge') {
        // Target: > 6.000 steps per day per participant
        const targetPerPerson = 6000;
        const target = targetPerPerson * participants; 
        return {
            id: `comm-steps-${Date.now()}`,
            type: 'total_steps',
            titleKey: 'communityGoal.titles.steps',
            target,
            currentProgress: Math.floor(target * progressFactor),
            participants,
            unitKey: 'communityGoal.units.steps',
            rewardBadgeId: 'exercise',
            relatedChallengeId: challengeId
        };
    } else if (challengeId === 'sleepChallenge') {
         // Target: between 7.5-8.5 hours per night per participant -> use 8h avg
         const targetPerPerson = 8;
         const target = targetPerPerson * participants; 
         return {
            id: `comm-sleep-${Date.now()}`,
            type: 'sleep_hours',
            titleKey: 'communityGoal.titles.sleep',
            target,
            currentProgress: Math.floor(target * progressFactor),
            participants,
            unitKey: 'communityGoal.units.sleep',
            rewardBadgeId: 'sleep',
            relatedChallengeId: challengeId
        };
    } else if (challengeId === 'voedingChallenge') {
         // Target: > 3 meal photo's logged per day per participant
         const targetPerPerson = 3;
         const target = targetPerPerson * participants;
         return {
            id: `comm-meals-${Date.now()}`,
            type: 'meal_photos',
            titleKey: 'communityGoal.titles.meals',
            target,
            currentProgress: Math.floor(target * progressFactor),
            participants,
            unitKey: 'communityGoal.units.photos',
            rewardBadgeId: 'meal',
            relatedChallengeId: challengeId
        };
    } else if (challengeId === 'stopRokenChallenge') {
        // Target: 1 assigned per 2 days per participant (0.5 per day)
        const targetPerPerson = 0.5;
        const target = Math.ceil(targetPerPerson * participants); // ~12
        return {
            id: `comm-smoke-${Date.now()}`,
            type: 'smoking_assignments',
            titleKey: 'communityGoal.titles.smoking',
            target,
            currentProgress: Math.floor(target * progressFactor),
            participants,
            unitKey: 'communityGoal.units.assignments',
            rewardBadgeId: 'smoke', // or stress_reduction
            relatedChallengeId: challengeId
        };
    } else if (challengeId === 'stressChallenge') {
        // Target: 1 stress reducation exercise per day per participant
        const targetPerPerson = 1;
        const target = targetPerPerson * participants;
        return {
            id: `comm-stress-${Date.now()}`,
            type: 'stress_exercises',
            titleKey: 'communityGoal.titles.stress',
            target,
            currentProgress: Math.floor(target * progressFactor),
            participants,
            unitKey: 'communityGoal.units.exercises',
            rewardBadgeId: 'relax',
            relatedChallengeId: challengeId
        };
    }

    // No active challenge: > 3 active steps per day per participant
    const targetPerPerson = 3;
    const target = targetPerPerson * participants;
    return {
        id: `comm-active-${Date.now()}`,
        type: 'active_steps',
        titleKey: 'communityGoal.titles.active',
        target,
        currentProgress: Math.floor(target * progressFactor),
        participants,
        unitKey: 'communityGoal.units.actions',
        rewardBadgeId: 'social', // Default badge
        relatedChallengeId: undefined
    };
};

export const activityIdToGoalKeyMap: Record<string, (keyof Goals)[]> = {};

for (const goalKey in goalKeyToActivityIdMap) {
    const activityId = goalKeyToActivityIdMap[goalKey as keyof typeof goalKeyToActivityIdMap];
    if (activityId) {
        if (!activityIdToGoalKeyMap[activityId]) {
            activityIdToGoalKeyMap[activityId] = [];
        }
        activityIdToGoalKeyMap[activityId].push(goalKey as keyof Goals);
    }
}

export const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const formatGoalText = (activity: Activity, goal: Goals[keyof Goals], t: (key: string, replacements?: Record<string, string | number>) => string): string | null => {
    if (!goal) return null;

    if ('minutes' in goal && 'daysPerWeek' in goal && !('breakLength' in goal)) {
        const dwg = goal as DailyWalkingGoal;
        return t('goalCheckScreen.goalTemplates.dailyWalking', { minutes: dwg.minutes, days: dwg.daysPerWeek });
    }
    if ('hoursPerDay' in goal) {
        const mbg = goal as MovingBreaksGoal;
        return t('goalCheckScreen.goalTemplates.movingBreaks', { hours: mbg.hoursPerDay, length: mbg.breakLength });
    }
    if ('trainingType' in goal) {
        const sg = goal as StrengthGoal;
        return t('goalCheckScreen.goalTemplates.strength', { days: sg.daysPerWeek, type: sg.trainingType });
    }
    if ('bedtime' in goal) {
        const rsg = goal as RegularSleepGoal;
        return t('goalCheckScreen.goalTemplates.regularSleep', { bedtime: rsg.bedtime, wakeTime: rsg.wakeTime });
    }
    if ('minutesBeforeSleep' in goal) {
        const sog = goal as ScreenOffGoal;
        return t('goalCheckScreen.goalTemplates.screenOff', { minutes: sog.minutesBeforeSleep, insteadOf: sog.insteadOf });
    }
    if ('mealsPerDay' in goal) {
        const rfg = goal as RealFoodGoal;
        return t('goalCheckScreen.goalTemplates.realFood', { meals: rfg.mealsPerDay, junk: rfg.maxJunkPerWeek });
    }
    if ('portionsPerDay' in goal) {
        const fvg = goal as FruitVegGoal;
        return t('goalCheckScreen.goalTemplates.fruitVeg', { portions: fvg.portionsPerDay, mix: fvg.mix });
    }
    if ('glassesPerDay' in goal) {
        const wg = goal as WaterGoal;
        return t('goalCheckScreen.goalTemplates.water', { glasses: wg.glassesPerDay, sugary: wg.maxSugaryPerWeek });
    }
    if ('freeDaysPerWeek' in goal) {
        const ag = goal as AlcoholGoal;
        return t('goalCheckScreen.goalTemplates.alcohol', { freeDays: ag.freeDaysPerWeek, maxDrinks: ag.maxDrinks });
    }
    if ('minutesPerBreak' in goal) {
        const ctg = goal as CalmTimeGoal;
        return t('goalCheckScreen.goalTemplates.calmTime', { minutes: ctg.minutesPerBreak, type: ctg.breakType });
    }
    if ('timesPerWeek' in goal) {
        const scg = goal as SocialContactGoal;
        return t('goalCheckScreen.goalTemplates.socialContact', { times: scg.timesPerWeek, deepTalks: scg.deepTalksPerWeek });
    }
    if ('minutesPerDay' in goal && 'timeOfDay' in goal) {
        const tog = goal as TimeOutsideGoal;
        return t('goalCheckScreen.goalTemplates.timeOutside', { minutes: tog.minutesPerDay, time: tog.timeOfDay });
    }
    if ('maxCigarettesPerDay' in goal) {
        const smg = goal as SmokingGoal;
        return t('goalCheckScreen.goalTemplates.smoking', { max: smg.maxCigarettesPerDay });
    }
    if ('startWeight' in goal && 'targetWeight' in goal) {
        const wgt = goal as WeightGoal;
        const targetDate = new Date(wgt.targetDate).toLocaleDateString();
        return `Reach a target weight of ${wgt.targetWeight} kg by ${targetDate}.`;
    }
    if ('steps' in goal) {
        const mcg = goal as MovementChallengeGoal;
        return t('goalCheckScreen.goalTemplates.movementChallenge', { steps: mcg.steps });
    }


    return null;
};

export const formatMemoryDetailsText = (memory: Memory, t: (key: string, replacements?: Record<string, string | number>) => string): string | null => {
    if (!memory) return null;
    const details: string[] = [];

    if (memory.walking) {
        details.push(`The user's logged activity was: walked for ${memory.walking.value} ${memory.walking.unit}.`);
    }
    if (memory.duration) {
        details.push(`The user's logged activity was: duration of ${memory.duration.hours} hours and ${memory.duration.minutes} minutes.`);
    }
    if (memory.meal) {
        details.push(`The user's logged activity was: ate a ${memory.meal.type} described as '${memory.meal.description}'.`);
    }
    if (memory.social) {
        details.push(`The user's logged activity was: socialized by '${memory.social.description}'.`);
    }

    if (details.length === 0) return null;
    return details.join(' ');
};

export const formatStateForChatbot = (state: AppState, t: (key: string, replacements?: Record<string, string | number>) => string): string => {
    let context = "Here is a summary of the user's current state in the eMaat app:\n\n";
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(now.getDate() - 14);
    const inOneWeek = new Date();
    inOneWeek.setDate(now.getDate() + 7);

    // User Info
    context += `User: ${state.userInfo.name || 'User'}, Age: ${state.userInfo.age || 'not specified'}, Gender: ${state.userInfo.gender}.\n`;
    
    // Core stats
    context += `Current points: ${state.points}. Current streak: ${state.currentStreak} days.\n`;
    
    // Earned Badges
    const earnedBadges = [];
    for (const badge of BADGES) {
        if ((state.activityPoints[badge.activityId] || 0) >= badge.threshold) {
            earnedBadges.push(`${t(`badges.activities.${badge.activityId}.${badge.tier}`)}`);
        }
    }
    if (earnedBadges.length > 0) {
        context += `Earned Badges: ${earnedBadges.join(', ')}.\n`;
    }
    if (state.lastEarnedCommunityBadge) {
        context += `Community Badge Earned: ${t(`badges.activities.${state.lastEarnedCommunityBadge.activityId}.${state.lastEarnedCommunityBadge.tier}`)}.\n`;
    }

    // Community Goal
    if (state.communityGoal) {
        context += `Community Goal: ${t(state.communityGoal.titleKey)} - ${state.communityGoal.currentProgress} / ${state.communityGoal.target} ${t(state.communityGoal.unitKey)}.\n`;
    }

    context += "\n";

    // Active Goals
    if (Object.keys(state.goals).length > 0) {
        context += "Active Goals:\n";
        for (const key of Object.keys(state.goals) as Array<keyof Goals>) {
            const goalData = state.goals[key];
            const activityId = goalKeyToActivityIdMap[key];
            let activity = activityId ? ACTIVITIES.find(a => a.id === activityId) : undefined;
            
            if (!activity) {
                if (key === 'movementChallenge') activity = ACTIVITIES.find(a => a.id === 'exercise');
            }

            if (activity && goalData) {
                const goalText = formatGoalText(activity, goalData, t);
                context += `- ${t(`activities.${activity.id}.name`)}: ${goalText}\n`;
            } else if (key === 'movementChallenge' && (goalData as MovementChallengeGoal)?.steps) {
                 context += `- Movement Challenge: Walk ${(goalData as MovementChallengeGoal).steps} steps per day.\n`;
            }
        }
        context += "\n";
    } else {
        context += "No active goals set.\n\n";
    }
    
    // Active Challenge
    if (state.challenge) {
        const completed = state.challenge.activities.filter(a => a.status === 'completed').length;
        const total = state.challenge.activities.length;
        context += `Active Challenge: ${t(`challenge.${state.challenge.id}.name`)}\n`;
        context += `Progress: ${completed}/${total} activities completed.\n\n`;
    }

    // Active Journal
    if (state.activeJournal) {
        const journalConfig = JOURNAL_CONFIG[state.activeJournal as JournalId];
        if (journalConfig) {
            context += `Active Journal: ${t(journalConfig.nameKey)}.\n\n`;
        }
    }

    // Completed activities of the last 7 days & Recent Memory Content
    const recentLifeStory = state.lifeStory.filter(step => step.timestamp >= oneWeekAgo);
    if (recentLifeStory.length > 0) {
        context += "Completed Activities (last 7 days):\n";
        recentLifeStory.forEach(step => {
            const activityName = t(`activities.${step.activity.id}.name`);
            const date = step.timestamp.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            let extra = `Earned ${step.pointsAfter - step.pointsBefore} points.`;
            if (step.memory && step.memory.content) {
                extra += ` Diary Note: "${step.memory.content}"`;
            }
            context += `- On ${date}, logged '${activityName}'. ${extra}\n`;
        });
        context += "\n";
    }

    // Upcoming activities for the next 7 days
    const upcomingReminders = state.reminders.filter(r => r.predictedAt > now && r.predictedAt <= inOneWeek);
    const upcomingChallengeActivities = state.challenge?.activities.filter(a => a.status === 'pending' && a.scheduledAt > now && a.scheduledAt <= inOneWeek) || [];
    
    if (upcomingReminders.length > 0 || upcomingChallengeActivities.length > 0) {
        context += "Upcoming Activities (next 7 days):\n";
        [...upcomingReminders.map(r => ({ item: r, date: r.predictedAt, type: 'reminder' as const })), ...upcomingChallengeActivities.map(a => ({ item: a, date: a.scheduledAt, type: 'challenge' as const }))]
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .forEach(upcoming => {
            let activityName = '';
            if (upcoming.type === 'reminder') {
                 activityName = t(`activities.${(upcoming.item as Reminder).activityId}.name`);
            } else {
                 const act = upcoming.item as ChallengeActivity;
                 activityName = t(`challenge.${act.challengeId}.${act.type}.title`);
                 if (act.type === 'introduction') {
                     activityName = t(`challenge.${act.challengeId}.name`);
                 }
            }
            const dateStr = upcoming.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            context += `- ${upcoming.type === 'reminder' ? 'Reminder' : 'Challenge'}: '${activityName}' on ${dateStr}.\n`;
        });
        context += "\n";
    }

    // Measurements of the last 2 weeks
    const recentMeasurements = state.measurements.filter(m => m.timestamp >= twoWeeksAgo);
    if (recentMeasurements.length > 0) {
        context += "Measurements (last 14 days):\n";
        recentMeasurements.forEach(m => {
            const mName = t(`measurements.types.${m.type}.name`);
            const date = m.timestamp.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            let valueStr = '';
             switch (m.type) {
                case 'heartRate': valueStr = `${m.value} bpm`; break;
                case 'bloodPressure': valueStr = `${m.systolic}/${m.diastolic} mmHg`; break;
                case 'bloodGlucose': valueStr = `${m.value} mmol/L`; break;
                case 'steps': valueStr = `${m.value} steps`; break;
                case 'weight': valueStr = `${m.value} kg`; break;
                case 'temperature': valueStr = `${m.value} °C`; break;
                case 'oxygenSaturation': valueStr = `${m.value} %`; break;
                case 'sleepDuration': valueStr = `${m.hours}h ${m.minutes}m`; break;
            }
            context += `- On ${date}, logged ${mName}: ${valueStr}.\n`;
        });
        context += "\n";
    }

    // Recent survey results
    if (state.surveys.length > 0) {
        context += "Latest Survey Result:\n";
        const latestSurvey = state.surveys[0];
        const surveyName = t(`surveys.${latestSurvey.surveyId}.name`);
        const date = latestSurvey.timestamp.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        context += `- Filled out ${surveyName} on ${date}.\n`;
        for (const [dim, score] of Object.entries(latestSurvey.scores)) {
            const level = latestSurvey.interpretation[dim];
            const dimName = t(`surveys.${latestSurvey.surveyId}.dimensions.${dim}`) || dim;
            context += `  - ${dimName}: Score ${Math.round(score)}, interpreted as ${level}.\n`;
        }
        context += "\n";
    }

    return context;
};

export const generateRemindersForGoal = (goalKey: keyof Goals, goal: any): Reminder[] => {
    if (!goal.reminder) return [];

    const reminders: Reminder[] = [];
    const activityId = goalKeyToActivityIdMap[goalKey as keyof typeof goalKeyToActivityIdMap];
    if (!activityId) return [];

    const now = new Date();
    const { frequency, durationWeeks } = goal.reminder as ReminderSettings;
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + durationWeeks * 7);

    let currentDate = new Date();
    currentDate.setHours(9, 0, 0, 0); // Default reminder time: 9 AM

    while (currentDate <= endDate) {
        const dayOfWeek = (currentDate.getDay() + 6) % 7; // Monday is 0

        let shouldAddReminder = false;
        if (frequency === 'daily') {
            shouldAddReminder = true;
        } else if (Array.isArray(frequency) && frequency.includes(dayOfWeek)) {
            shouldAddReminder = true;
        }

        if (shouldAddReminder && currentDate.getTime() >= now.getTime()) {
            const predictedAt = new Date(currentDate);
            const visibleAt = new Date(predictedAt.getTime() - 60 * 60 * 1000); // 1 hour before
            reminders.push({
                id: `${activityId}-${predictedAt.getTime()}`,
                activityId,
                predictedAt,
                visibleAt,
            });
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return reminders;
};


// --- Audio Utilities ---

export function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
    return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) { channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; }
    }
    return buffer;
}

export const calculateAge = (dobString: string | null | undefined): number | null => {
    if (!dobString) return null;
    try {
        const dob = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age > 0 ? age : null;
    } catch {
        return null;
    }
};
