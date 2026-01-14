export const regularSleepConfig = {
    nameKey: 'setGoalScreen.regularSleep.title',
    habitTipKey: 'setGoalScreen.sleep.habitTipBody',
    relatedChallengeId: 'sleepChallenge',
    params: [
        { id: 'bedtime', labelKey: 'setGoalScreen.sleep.bedtimeLabel', type: 'time', defaultValue: '22:30', required: true },
        { id: 'wakeTime', labelKey: 'setGoalScreen.regularSleep.wakeTimeLabel', type: 'time', defaultValue: '06:30', required: true }
    ],
};
