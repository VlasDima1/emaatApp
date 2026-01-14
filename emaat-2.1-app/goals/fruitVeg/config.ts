export const fruitVegConfig = {
    nameKey: 'setGoalScreen.fruitVeg.title',
    habitTipKey: 'setGoalScreen.fruitVeg.habitTipBody',
    relatedChallengeId: 'voedingChallenge',
    params: [
        { id: 'portionsPerDay', labelKey: 'setGoalScreen.fruitVeg.portionsPerDayLabel', type: 'number', defaultValue: 4, unitKey: 'setGoalScreen.common.portionsSuffix', required: true, min: 1, step: 1 },
        { id: 'mix', labelKey: 'setGoalScreen.fruitVeg.mixLabel', type: 'text', defaultValueKey: 'setGoalScreen.fruitVeg.defaultMix', placeholder: 'e.g. 2 fruit + 3 veg', required: true }
    ],
};
