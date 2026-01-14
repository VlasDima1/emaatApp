export const socialContactConfig = {
    nameKey: 'setGoalScreen.socialContact.title',
    habitTipKey: 'setGoalScreen.social.habitTipBody',
    relatedChallengeId: 'socialChallenge',
    params: [
        { id: 'timesPerWeek', labelKey: 'setGoalScreen.common.timesPerWeek', type: 'number', defaultValue: 3, unitKey: 'setGoalScreen.common.timesSuffix', required: true, min: 1, step: 1 },
        { id: 'deepTalksPerWeek', labelKey: 'setGoalScreen.socialContact.deepTalksPerWeekLabel', type: 'number', defaultValue: 1, unitKey: 'setGoalScreen.common.timesSuffix', required: true, min: 0, step: 1 }
    ],
};
