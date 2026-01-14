import { ChallengeActivity } from '../../types';

export const generateSocialChallenge = (startDate: Date): ChallengeActivity[] => {
    const activities: ChallengeActivity[] = [];

    for (let i = 1; i <= 15; i++) {
        const dayOffset = i - 1;

        const morningDate = new Date(startDate);
        morningDate.setDate(startDate.getDate() + dayOffset);
        morningDate.setHours(9, 0, 0, 0);
        if (morningDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `soc-d${i}-morning`,
                challengeId: 'socialChallenge',
                day: i,
                type: 'morningCheckin',
                scheduledAt: morningDate,
                status: 'pending'
            });
        }

        const braintainmentDate = new Date(startDate);
        braintainmentDate.setDate(startDate.getDate() + dayOffset);
        braintainmentDate.setHours(14, 0, 0, 0);
        if (braintainmentDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `soc-d${i}-braintainment`,
                challengeId: 'socialChallenge',
                day: i,
                type: 'braintainment',
                scheduledAt: braintainmentDate,
                status: 'pending'
            });
        }
        
        const eveningDate = new Date(startDate);
        eveningDate.setDate(startDate.getDate() + dayOffset);
        eveningDate.setHours(21, 0, 0, 0);
        if (eveningDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `soc-d${i}-evening`,
                challengeId: 'socialChallenge',
                day: i,
                type: 'eveningCheckin',
                scheduledAt: eveningDate,
                status: 'pending'
            });
        }
    }

    return activities;
};
