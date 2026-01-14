export const sportConfig = {
    nameKey: 'setGoalScreen.sport.title',
    habitTipKey: 'setGoalScreen.strength.habitTipBody',
    relatedChallengeId: 'beweegChallenge',
    params: [
        { id: 'sport', labelKey: 'setGoalScreen.sport.sportLabel', type: 'text', defaultValue: 'Tennis', required: true },
        { id: 'frequency', labelKey: 'setGoalScreen.common.timesPerWeek', type: 'number', defaultValue: 2, unitKey: 'setGoalScreen.common.timesSuffix', required: true, min: 1, max: 7, step: 1 }
    ],
};
