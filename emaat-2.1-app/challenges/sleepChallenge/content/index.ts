import { day1 } from './day1';
import { day2 } from './day2';
import { day3 } from './day3';
import { day4 } from './day4';
import { day5 } from './day5';
import { day6 } from './day6';
import { day7 } from './day7';
import { day8 } from './day8';
import { day9 } from './day9';
import { day10 } from './day10';
import { day11 } from './day11';
import { day12 } from './day12';
import { day13 } from './day13';
import { day14 } from './day14';
import { day15 } from './day15';
import { ChallengeActivity } from '../../../types';
import { RegularSleepGoal } from '../../../goals/types';

export const EVENING_CHECKIN_QUESTIONS = [
    'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'
];

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


export const sleepChallengeContent = {
    1: day1,
    2: day2,
    3: day3,
    4: day4,
    5: day5,
    6: day6,
    7: day7,
    8: day8,
    9: day9,
    10: day10,
    11: day11,
    12: day12,
    13: day13,
    14: day14,
    15: day15,
};
