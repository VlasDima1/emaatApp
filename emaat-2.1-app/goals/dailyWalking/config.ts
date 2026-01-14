export const dailyWalkingConfig = {
    nameKey: 'setGoalScreen.dailyWalking.title',
    habitTipKey: 'setGoalScreen.dailyWalking.habitTipBody',
    params: [
        { id: 'minutes', labelKey: 'setGoalScreen.dailyWalking.minutesLabel', type: 'number', defaultValue: 20, unitKey: 'addMemoryScreen.minutes', required: true, min: 5, step: 5 },
        { id: 'daysPerWeek', labelKey: 'setGoalScreen.common.daysPerWeek', type: 'number', defaultValue: 5, unitKey: 'setGoalScreen.common.daysSuffix', required: true, min: 1, max: 7, step: 1 }
    ],
};
