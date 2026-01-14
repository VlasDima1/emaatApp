export const readingConfig = {
    nameKey: 'setGoalScreen.reading.title',
    habitTipKey: 'setGoalScreen.stress.habitTipBody',
    params: [
        { id: 'book', labelKey: 'setGoalScreen.reading.bookLabel', type: 'text', defaultValueKey: 'setGoalScreen.reading.defaultBook', required: true },
        { id: 'frequency', labelKey: 'setGoalScreen.common.timesPerWeek', type: 'number', defaultValue: 3, unitKey: 'setGoalScreen.common.timesSuffix', required: true, min: 1, max: 7, step: 1 }
    ],
};
