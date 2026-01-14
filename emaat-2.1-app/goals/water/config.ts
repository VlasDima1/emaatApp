export const waterConfig = {
    nameKey: 'setGoalScreen.water.title',
    habitTipKey: 'setGoalScreen.water.habitTipBody',
    relatedChallengeId: 'voedingChallenge',
    params: [
        { id: 'glassesPerDay', labelKey: 'setGoalScreen.water.glassesPerDayLabel', type: 'number', defaultValue: 8, unitKey: 'setGoalScreen.common.glassesSuffix', required: true, min: 1, step: 1 },
        { id: 'maxSugaryPerWeek', labelKey: 'setGoalScreen.water.maxSugaryPerWeekLabel', type: 'number', defaultValue: 1, unitKey: 'setGoalScreen.common.timesSuffix', required: true, min: 0, step: 1 }
    ],
};
