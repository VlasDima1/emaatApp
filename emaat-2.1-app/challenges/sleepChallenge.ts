import { ChallengeActivity } from '../types';
import { RegularSleepGoal } from '../goals/types';

export const generateSleepChallenge = (sleepGoal: RegularSleepGoal, startDate: Date): ChallengeActivity[] => {
    const activities: ChallengeActivity[] = [];
    const [bedtimeHours, bedtimeMinutes] = sleepGoal.bedtime.split(':').map(Number);
    const [wakeUpHours, wakeUpMinutes] = sleepGoal.wakeTime.split(':').map(Number);
    
    for (let i = 1; i <= 15; i++) {
        const dayOffset = i - 1;

        // Morning Check-in (at wake-up time)
        const morningDate = new Date(startDate);
        morningDate.setDate(startDate.getDate() + dayOffset + 1); // For the *next* morning
        morningDate.setHours(wakeUpHours, wakeUpMinutes, 0, 0);
        activities.push({
            id: `sc-d${i}-morning`,
            challengeId: 'sleepChallenge',
            day: i,
            type: 'morningCheckin',
            scheduledAt: morningDate,
            status: 'pending'
        });

        if (i > 14) continue; // No more braintainment/evening after day 14

        // Braintainment (mid-day)
        const braintainmentDate = new Date(startDate);
        braintainmentDate.setDate(startDate.getDate() + dayOffset);
        braintainmentDate.setHours(12, 0, 0, 0);
         if (braintainmentDate.getTime() < startDate.getTime()) {
            continue; // Don't schedule for past
        }
        activities.push({
            id: `sc-d${i}-braintainment`,
            challengeId: 'sleepChallenge',
            day: i,
            type: 'braintainment',
            scheduledAt: braintainmentDate,
            status: 'pending'
        });

        // Evening Check-in (at bedtime)
        const eveningDate = new Date(startDate);
        eveningDate.setDate(startDate.getDate() + dayOffset);
        eveningDate.setHours(bedtimeHours, bedtimeMinutes, 0, 0);
        if (eveningDate.getTime() < startDate.getTime()) {
            continue; // Don't schedule for past
        }
        activities.push({
            id: `sc-d${i}-evening`,
            challengeId: 'sleepChallenge',
            day: i,
            type: 'eveningCheckin',
            scheduledAt: eveningDate,
            status: 'pending'
        });
    }

    return activities;
};