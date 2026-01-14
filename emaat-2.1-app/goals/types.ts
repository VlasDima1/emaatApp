// --- CONSOLIDATED GOAL TYPES ---
// All goal interfaces have been moved here to create a single source of truth 
// and prevent recurring syntax/import errors, making the system more robust.

export interface ReminderSettings {
    frequency: 'daily' | number[];
    durationWeeks: number;
}

export interface AlcoholGoal {
  freeDaysPerWeek: number;
  maxDrinks: number;
  reminder?: ReminderSettings;
}

export interface CalmTimeGoal {
  minutesPerBreak: number;
  breakType: string;
  reminder?: ReminderSettings;
}

export interface DailyWalkingGoal {
  minutes: number;
  daysPerWeek: number;
  reminder?: ReminderSettings;
}

export interface FruitVegGoal {
  portionsPerDay: number;
  mix: string;
  reminder?: ReminderSettings;
}

export interface HobbyGoal {
  hobby: string;
  frequency: number;
  reminder?: ReminderSettings;
}

export interface MovementChallengeGoal {
    steps: number;
}

export interface MovingBreaksGoal {
  hoursPerDay: number;
  breakLength: number;
  reminder?: ReminderSettings;
}

export interface ReadingGoal {
  book: string;
  frequency: number;
  reminder?: ReminderSettings;
}

export interface RealFoodGoal {
  mealsPerDay: number;
  maxJunkPerWeek: number;
  reminder?: ReminderSettings;
}

export interface RegularSleepGoal {
  bedtime: string;
  wakeTime: string;
  reminder?: ReminderSettings;
}

export interface ScreenOffGoal {
  minutesBeforeSleep: number;
  insteadOf: string;
  reminder?: ReminderSettings;
}

export interface SmokingGoal {
  maxCigarettesPerDay: number;
  quitDate?: string;
  reminder?: ReminderSettings;
}

export interface SocialChallengeGoal {
    active: boolean;
}

export interface SocialContactGoal {
  timesPerWeek: number;
  deepTalksPerWeek: number;
  reminder?: ReminderSettings;
}

export interface SocialGoal {
  people: string;
  activity: string;
  frequency: number;
  reminder?: ReminderSettings;
}

export interface SportGoal {
  sport: string;
  frequency: number;
  reminder?: ReminderSettings;
}

export interface StopRokenChallengeGoal {
    active: boolean;
}

export interface StrengthGoal {
  daysPerWeek: number;
  trainingType: string;
  reminder?: ReminderSettings;
}

export interface StressChallengeGoal {
    active: boolean;
}

export interface TimeOutsideGoal {
  minutesPerDay: number;
  timeOfDay: string;
  reminder?: ReminderSettings;
}

export interface VoedingChallengeGoal {
    active: boolean;
}

export interface WaterGoal {
  glassesPerDay: number;
  maxSugaryPerWeek: number;
  reminder?: ReminderSettings;
}

export interface WeightGoal {
  startWeight: number;
  targetWeight: number;
  startDate: string; // ISO String
  targetDate: string; // ISO string
  reminder?: ReminderSettings;
}

// --- MASTER GOALS INTERFACE ---

export interface Goals {
    dailyWalking?: DailyWalkingGoal;
    movingBreaks?: MovingBreaksGoal;
    strength?: StrengthGoal;
    regularSleep?: RegularSleepGoal;
    screenOff?: ScreenOffGoal;
    realFood?: RealFoodGoal;
    fruitVeg?: FruitVegGoal;
    water?: WaterGoal;
    alcohol?: AlcoholGoal;
    calmTime?: CalmTimeGoal;
    socialContact?: SocialContactGoal;
    timeOutside?: TimeOutsideGoal;
    smoking?: SmokingGoal;
    weight?: WeightGoal;
    hobby?: HobbyGoal;
    sport?: SportGoal;
    reading?: ReadingGoal;
    social?: SocialGoal;

    movementChallenge?: MovementChallengeGoal;
    voedingChallenge?: VoedingChallengeGoal;
    stopRokenChallenge?: StopRokenChallengeGoal;
    socialChallenge?: SocialChallengeGoal;
    stressChallenge?: StressChallengeGoal;
}