export const screenOffConfig = {
    nameKey: 'setGoalScreen.screenOff.title',
    habitTipKey: 'setGoalScreen.screenOff.habitTipBody',
    relatedChallengeId: 'sleepChallenge',
    params: [
        { id: 'minutesBeforeSleep', labelKey: 'setGoalScreen.screenOff.minutesBeforeSleepLabel', type: 'number', defaultValue: 30, unitKey: 'addMemoryScreen.minutes', required: true, min: 10, step: 10 },
        { id: 'insteadOf', labelKey: 'setGoalScreen.screenOff.insteadOfLabel', type: 'text', defaultValueKey: 'setGoalScreen.screenOff.defaultInsteadOf', placeholderKey: 'setGoalScreen.screenOff.insteadOfPlaceholder', required: true }
    ],
};
