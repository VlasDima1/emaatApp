import { ChallengeActivity } from '../../types';

export const generateBeweegChallenge = (startDate: Date): ChallengeActivity[] => {
    const activities: ChallengeActivity[] = [];

    for (let i = 1; i <= 15; i++) {
        const dayOffset = i - 1;

        // Morning Check-in
        const morningDate = new Date(startDate);
        morningDate.setDate(startDate.getDate() + dayOffset);
        morningDate.setHours(8, 0, 0, 0);
        if (morningDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `mc-d${i}-morning`,
                challengeId: 'beweegChallenge',
                day: i,
                type: 'morningCheckin',
                scheduledAt: morningDate,
                status: 'pending'
            });
        }

        // Braintainment (mid-day)
        const braintainmentDate = new Date(startDate);
        braintainmentDate.setDate(startDate.getDate() + dayOffset);
        braintainmentDate.setHours(12, 0, 0, 0);
        if (braintainmentDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `mc-d${i}-braintainment`,
                challengeId: 'beweegChallenge',
                day: i,
                type: 'braintainment',
                scheduledAt: braintainmentDate,
                status: 'pending'
            });
        }
        
        // Evening Check-in
        const eveningDate = new Date(startDate);
        eveningDate.setDate(startDate.getDate() + dayOffset);
        eveningDate.setHours(21, 0, 0, 0);
        if (eveningDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `mc-d${i}-evening`,
                challengeId: 'beweegChallenge',
                day: i,
                type: 'eveningCheckin',
                scheduledAt: eveningDate,
                status: 'pending'
            });
        }
    }

    return activities;
};