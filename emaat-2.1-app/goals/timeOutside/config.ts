export const timeOutsideConfig = {
    nameKey: 'setGoalScreen.timeOutside.title',
    habitTipKey: 'setGoalScreen.timeOutside.habitTipBody',
    params: [
        { id: 'minutesPerDay', labelKey: 'setGoalScreen.timeOutside.minutesPerDayLabel', type: 'number', defaultValue: 20, unitKey: 'addMemoryScreen.minutes', required: true, min: 5, step: 5 },
        { id: 'timeOfDay', labelKey: 'setGoalScreen.timeOutside.timeOfDayLabel', type: 'text', defaultValueKey: 'setGoalScreen.timeOutside.defaultTimeOfDay', placeholderKey: 'setGoalScreen.timeOutside.timeOfDayPlaceholder', required: true }
    ],
};
