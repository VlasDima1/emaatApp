export const strengthConfig = {
    nameKey: 'setGoalScreen.strength.title',
    habitTipKey: 'setGoalScreen.strength.habitTipBody',
    relatedChallengeId: 'beweegChallenge',
    params: [
        { id: 'daysPerWeek', labelKey: 'setGoalScreen.common.daysPerWeek', type: 'number', defaultValue: 2, unitKey: 'setGoalScreen.common.daysSuffix', required: true, min: 1, max: 7, step: 1 },
        { id: 'trainingType', labelKey: 'setGoalScreen.strength.trainingTypeLabel', type: 'text', defaultValueKey: 'setGoalScreen.strength.defaultTrainingType', placeholderKey: 'setGoalScreen.strength.trainingTypePlaceholder', required: true }
    ],
};
