import { ChallengeActivity } from '../../types';

export const generateHartfalenChallenge = (startDate: Date): ChallengeActivity[] => {
    const activities: ChallengeActivity[] = [];

    for (let i = 1; i <= 14; i++) {
        const dayOffset = i - 1;

        // Morning Check-in (weight + how you feel)
        const morningDate = new Date(startDate);
        morningDate.setDate(startDate.getDate() + dayOffset);
        morningDate.setHours(8, 0, 0, 0);
        if (morningDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `hfc-d${i}-morning`,
                challengeId: 'hartfalenChallenge',
                day: i,
                type: 'morningCheckin',
                scheduledAt: morningDate,
                status: 'pending'
            });
        }

        // Daily weigh-in
        const weighInDate = new Date(startDate);
        weighInDate.setDate(startDate.getDate() + dayOffset);
        weighInDate.setHours(7, 30, 0, 0);
        if (weighInDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `hfc-d${i}-weighin`,
                challengeId: 'hartfalenChallenge',
                day: i,
                type: 'weighIn',
                scheduledAt: weighInDate,
                status: 'pending'
            });
        }

        // Braintainment (educational content at midday)
        const braintainmentDate = new Date(startDate);
        braintainmentDate.setDate(startDate.getDate() + dayOffset);
        braintainmentDate.setHours(12, 0, 0, 0);
        if (braintainmentDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `hfc-d${i}-braintainment`,
                challengeId: 'hartfalenChallenge',
                day: i,
                type: 'braintainment',
                scheduledAt: braintainmentDate,
                status: 'pending'
            });
        }

        // Fluid intake check-in (afternoon)
        const drinkDate = new Date(startDate);
        drinkDate.setDate(startDate.getDate() + dayOffset);
        drinkDate.setHours(16, 0, 0, 0);
        if (drinkDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `hfc-d${i}-drink`,
                challengeId: 'hartfalenChallenge',
                day: i,
                type: 'drinkCheckin',
                scheduledAt: drinkDate,
                status: 'pending'
            });
        }

        // Daily Assignment (specific task for the day)
        const assignmentDate = new Date(startDate);
        assignmentDate.setDate(startDate.getDate() + dayOffset);
        assignmentDate.setHours(14, 0, 0, 0);
        if (assignmentDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `hfc-d${i}-assignment`,
                challengeId: 'hartfalenChallenge',
                day: i,
                type: 'dailyAssignment',
                scheduledAt: assignmentDate,
                status: 'pending'
            });
        }

        // Evening Check-in (reflection)
        const eveningDate = new Date(startDate);
        eveningDate.setDate(startDate.getDate() + dayOffset);
        eveningDate.setHours(20, 0, 0, 0);
        if (eveningDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `hfc-d${i}-evening`,
                challengeId: 'hartfalenChallenge',
                day: i,
                type: 'eveningCheckin',
                scheduledAt: eveningDate,
                status: 'pending'
            });
        }
    }

    return activities;
};
