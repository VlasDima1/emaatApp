export const smokingConfig = {
    nameKey: 'setGoalScreen.smoking.title',
    habitTipKey: 'setGoalScreen.smoking.habitTipBody',
    relatedChallengeId: 'stopRokenChallenge',
    params: [
        { id: 'maxCigarettesPerDay', labelKey: 'setGoalScreen.smoking.maxCigarettesPerDayLabel', type: 'number', defaultValue: 10, unitKey: 'setGoalScreen.common.cigarettesSuffix', required: true, min: 0, step: 1 },
        { id: 'quitDate', labelKey: 'setGoalScreen.smoking.quitDateLabel', type: 'date', defaultValue: '', required: false }
    ],
};
