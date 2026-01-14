export const realFoodConfig = {
    nameKey: 'setGoalScreen.realFood.title',
    habitTipKey: 'setGoalScreen.realFood.habitTipBody',
    relatedChallengeId: 'voedingChallenge',
    params: [
        { id: 'mealsPerDay', labelKey: 'setGoalScreen.realFood.mealsPerDayLabel', type: 'number', defaultValue: 2, unitKey: 'setGoalScreen.common.mealsSuffix', required: true, min: 1, max: 5, step: 1 },
        { id: 'maxJunkPerWeek', labelKey: 'setGoalScreen.realFood.maxJunkPerWeekLabel', type: 'number', defaultValue: 2, unitKey: 'setGoalScreen.common.timesSuffix', required: true, min: 0, step: 1 }
    ],
};
