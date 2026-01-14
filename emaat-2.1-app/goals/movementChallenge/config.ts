export const movementChallengeConfig = {
    nameKey: 'challenge.beweegChallenge.setGoal.title',
    habitTipKey: 'challenge.beweegChallenge.setGoal.habitTipBody',
    params: [
        { id: 'steps', labelKey: 'challenge.beweegChallenge.setGoal.stepsLabel', type: 'number', defaultValue: 6000, unitKey: 'addMemoryScreen.steps', required: true, min: 1000, step: 500 }
    ]
};
