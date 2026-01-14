export const socialConfig = {
    nameKey: 'setGoalScreen.social.title',
    habitTipKey: 'setGoalScreen.social.habitTipBody',
    relatedChallengeId: 'socialChallenge',
    params: [
        { id: 'people', labelKey: 'setGoalScreen.social.peopleLabel', type: 'text', defaultValueKey: 'setGoalScreen.social.defaultPeople', required: true },
        { id: 'activity', labelKey: 'setGoalScreen.social.activityLabel', type: 'text', defaultValueKey: 'setGoalScreen.social.defaultActivity', required: true },
        { id: 'frequency', labelKey: 'setGoalScreen.common.timesPerWeek', type: 'number', defaultValue: 1, unitKey: 'setGoalScreen.common.timesSuffix', required: true, min: 1, step: 1 }
    ],
};
