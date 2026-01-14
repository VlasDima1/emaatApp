export const weightConfig = {
    nameKey: 'setGoalScreen.weight.title',
    habitTipKey: 'setGoalScreen.weight.habitTipBody',
    params: [
        { id: 'targetWeight', labelKey: 'setGoalScreen.weight.targetWeightLabel', type: 'number', defaultValue: 65, unitKey: 'welcomeScreen.weightUnit', required: true, min: 30, step: 0.5 },
        { id: 'targetDate', labelKey: 'setGoalScreen.weight.targetDateLabel', type: 'date', defaultValue: '', required: true }
    ],
};
