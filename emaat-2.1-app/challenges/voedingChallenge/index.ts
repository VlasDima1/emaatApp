import { ChallengeActivity } from '../../types';

export const generateVoedingChallenge = (startDate: Date): ChallengeActivity[] => {
    const activities: ChallengeActivity[] = [];

    for (let i = 1; i <= 15; i++) {
        const dayOffset = i - 1;

        const breakfastDate = new Date(startDate);
        breakfastDate.setDate(startDate.getDate() + dayOffset);
        breakfastDate.setHours(8, 0, 0, 0);
        if (breakfastDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `vc-d${i}-breakfast`,
                challengeId: 'voedingChallenge',
                day: i,
                type: 'breakfastCheckin',
                scheduledAt: breakfastDate,
                status: 'pending'
            });
        }

        const braintainmentDate = new Date(startDate);
        braintainmentDate.setDate(startDate.getDate() + dayOffset);
        braintainmentDate.setHours(12, 0, 0, 0);
        if (braintainmentDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `vc-d${i}-braintainment`,
                challengeId: 'voedingChallenge',
                day: i,
                type: 'braintainment',
                scheduledAt: braintainmentDate,
                status: 'pending'
            });
        }
        
        const lunchDate = new Date(startDate);
        lunchDate.setDate(startDate.getDate() + dayOffset);
        lunchDate.setHours(13, 0, 0, 0);
        if (lunchDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `vc-d${i}-lunch`,
                challengeId: 'voedingChallenge',
                day: i,
                type: 'lunchCheckin',
                scheduledAt: lunchDate,
                status: 'pending'
            });
        }

        const dinnerDate = new Date(startDate);
        dinnerDate.setDate(startDate.getDate() + dayOffset);
        dinnerDate.setHours(19, 0, 0, 0);
        if (dinnerDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `vc-d${i}-dinner`,
                challengeId: 'voedingChallenge',
                day: i,
                type: 'dinnerCheckin',
                scheduledAt: dinnerDate,
                status: 'pending'
            });
        }

        if (i === 1 || i === 7 || i === 15) {
            const weighInDate = new Date(startDate);
            weighInDate.setDate(startDate.getDate() + dayOffset);
            weighInDate.setHours(20, 0, 0, 0); // End of day weigh-in
            if (weighInDate.getTime() >= startDate.getTime()) {
                 activities.push({
                    id: `vc-d${i}-weighin`,
                    challengeId: 'voedingChallenge',
                    day: i,
                    type: 'weighIn',
                    scheduledAt: weighInDate,
                    status: 'pending'
                });
            }
        }
    }

    return activities;
};