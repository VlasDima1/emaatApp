export const alcoholConfig = {
    nameKey: 'setGoalScreen.alcohol.title',
    habitTipKey: 'setGoalScreen.alcohol.habitTipBody',
    params: [
        { id: 'freeDaysPerWeek', labelKey: 'setGoalScreen.alcohol.freeDaysPerWeekLabel', type: 'number', defaultValue: 5, unitKey: 'setGoalScreen.common.daysSuffix', required: true, min: 0, max: 7, step: 1 },
        { id: 'maxDrinks', labelKey: 'setGoalScreen.alcohol.maxDrinksLabel', type: 'number', defaultValue: 2, unitKey: 'setGoalScreen.common.drinksSuffix', required: true, min: 0, step: 1 }
    ],
};
