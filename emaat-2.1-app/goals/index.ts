import { Goals } from './types';

import { alcoholConfig } from './alcohol/config';
import { calmTimeConfig } from './calmTime/config';
import { dailyWalkingConfig } from './dailyWalking/config';
import { fruitVegConfig } from './fruitVeg/config';
import { movementChallengeConfig } from './movementChallenge/config';
import { movingBreaksConfig } from './movingBreaks/config';
import { realFoodConfig } from './realFood/config';
import { regularSleepConfig } from './regularSleep/config';
import { screenOffConfig } from './screenOff/config';
import { smokingConfig } from './smoking/config';
import { socialChallengeConfig } from './socialChallenge/config';
import { socialContactConfig } from './socialContact/config';
import { stopRokenChallengeConfig } from './stopRokenChallenge/config';
import { strengthConfig } from './strength/config';
import { timeOutsideConfig } from './timeOutside/config';
import { voedingChallengeConfig } from './voedingChallenge/config';
import { waterConfig } from './water/config';
import { weightConfig } from './weight/config';
import { hobbyConfig } from './hobby/config';
import { sportConfig } from './sport/config';
import { readingConfig } from './reading/config';
import { socialConfig } from './social/config';
import { stressChallengeConfig } from './stressChallenge/config';

export const GOAL_CONFIG: Record<keyof Goals, any> = {
    dailyWalking: dailyWalkingConfig,
    movingBreaks: movingBreaksConfig,
    strength: strengthConfig,
    regularSleep: regularSleepConfig,
    screenOff: screenOffConfig,
    realFood: realFoodConfig,
    fruitVeg: fruitVegConfig,
    water: waterConfig,
    alcohol: alcoholConfig,
    calmTime: calmTimeConfig,
    socialContact: socialContactConfig,
    timeOutside: timeOutsideConfig,
    smoking: smokingConfig,
    weight: weightConfig,
    movementChallenge: movementChallengeConfig,
    voedingChallenge: voedingChallengeConfig,
    stopRokenChallenge: stopRokenChallengeConfig,
    socialChallenge: socialChallengeConfig,
    stressChallenge: stressChallengeConfig,
    social: socialConfig,
    hobby: hobbyConfig,
    sport: sportConfig,
    reading: readingConfig,
};

export * from './types';