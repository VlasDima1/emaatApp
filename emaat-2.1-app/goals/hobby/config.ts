export const hobbyConfig = {
    nameKey: 'setGoalScreen.hobby.title',
    habitTipKey: 'setGoalScreen.hobby.habitTipBody',
    params: [
        { id: 'hobby', labelKey: 'setGoalScreen.hobby.hobbyLabel', type: 'text', defaultValueKey: 'setGoalScreen.hobby.defaultHobby', required: true },
        { id: 'frequency', labelKey: 'setGoalScreen.common.timesPerWeek', type: 'number', defaultValue: 2, unitKey: 'setGoalScreen.common.timesSuffix', required: true, min: 1, max: 7, step: 1 }
    ],
};
