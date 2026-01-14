import { ChallengeActivity } from '../../types';

export const generateStopRokenChallenge = (startDate: Date): ChallengeActivity[] => {
    const activities: ChallengeActivity[] = [];

    for (let i = 1; i <= 15; i++) {
        const dayOffset = i - 1;

        // Braintainment (mid-day)
        const braintainmentDate = new Date(startDate);
        braintainmentDate.setDate(startDate.getDate() + dayOffset);
        braintainmentDate.setHours(12, 0, 0, 0);
        if (braintainmentDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `src-d${i}-braintainment`,
                challengeId: 'stopRokenChallenge',
                day: i,
                type: 'braintainment',
                scheduledAt: braintainmentDate,
                status: 'pending'
            });
        }
        
        // Daily Assignment (evening)
        const assignmentDate = new Date(startDate);
        assignmentDate.setDate(startDate.getDate() + dayOffset);
        assignmentDate.setHours(20, 0, 0, 0);
        if (assignmentDate.getTime() >= startDate.getTime()) {
            activities.push({
                id: `src-d${i}-assignment`,
                challengeId: 'stopRokenChallenge',
                day: i,
                type: 'dailyAssignment',
                scheduledAt: assignmentDate,
                status: 'pending'
            });
        }
    }

    return activities;
};
