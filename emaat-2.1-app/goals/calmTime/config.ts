export const calmTimeConfig = {
    nameKey: 'setGoalScreen.calmTime.title',
    habitTipKey: 'setGoalScreen.stress.habitTipBody',
    params: [
        { id: 'minutesPerBreak', labelKey: 'setGoalScreen.calmTime.minutesPerBreakLabel', type: 'number', defaultValue: 10, unitKey: 'addMemoryScreen.minutes', required: true, min: 1, step: 1 },
        { id: 'breakType', labelKey: 'setGoalScreen.calmTime.breakTypeLabel', type: 'text', defaultValueKey: 'setGoalScreen.calmTime.defaultBreakType', placeholderKey: 'setGoalScreen.calmTime.breakTypePlaceholder', required: true }
    ],
};
