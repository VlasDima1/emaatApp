export const movingBreaksConfig = {
    nameKey: 'setGoalScreen.movingBreaks.title',
    habitTipKey: 'setGoalScreen.movingBreaks.habitTipBody',
    params: [
        { id: 'hoursPerDay', labelKey: 'setGoalScreen.movingBreaks.hoursPerDayLabel', type: 'number', defaultValue: 8, unitKey: 'common.hoursSuffix', required: true, min: 1, max: 16, step: 1 },
        { id: 'breakLength', labelKey: 'setGoalScreen.movingBreaks.breakLengthLabel', type: 'number', defaultValue: 3, unitKey: 'addMemoryScreen.minutes', required: true, min: 1, max: 10, step: 1 }
    ],
};
