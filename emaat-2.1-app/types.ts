
import React from 'react';
// All goal-related types are now exported from a single, robust file.
// The specific import for goal types has been removed as all types are now re-exported directly below.
import { JournalEntry, JournalId } from './journals/types';
// FIX: Removed `WeightMeasurement` from import as it is defined locally in this file.
import { Goals, WeightGoal } from './goals/types';

export type Language = 'en' | 'nl' | 'tr' | 'fr' | 'es' | 'de' | 'ar' | 'ar-MA' | 'pap' | 'pl';

export type Gender = 'male' | 'female' | 'unspecified';

export interface UserInfo {
  name: string;
  age: number | null;
  gender: Gender;
  dateOfBirth?: string | null;
  email?: string | null;
  height?: number | null; // in cm
}

export type LifestylePillar = 'sleep' | 'nutrition' | 'social' | 'stress_reduction' | 'exercise';

export interface Pillar {
  id: LifestylePillar;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Activity {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  points: number;
  color: string;
  pillar: LifestylePillar;
  minLevel: number;
}

export interface WalkingDetails { unit: 'steps' | 'minutes'; value: number; }
export interface DurationDetails { hours: number; minutes: number; }
export interface MealDetails { type: 'breakfast' | 'lunch' | 'dinner' | 'snack'; description: string; }
export interface SocialDetails { description: string; }

export interface Memory {
  photoUrl?: string;
  content?: string;
  walking?: WalkingDetails;
  duration?: DurationDetails;
  meal?: MealDetails;
  social?: SocialDetails;
  isPrivate?: boolean;
}

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Badge {
  activityId: string;
  tier: BadgeTier;
  threshold: number;
}

export interface LifeStep {
  id: string;
  activity: Activity;
  timestamp: Date;
  nudge: string;
  pointsBefore: number;
  pointsAfter: number;
  avatarBefore: string;
  avatarAfter: string;
  pointsDoubled?: boolean;
  audioData?: string | null;
  memory?: Memory;
  earnedBadge?: Badge;
  challengeActivityId?: string;
  overrideTitle?: string;
  subtitle?: string;
  challengeId?: ChallengeId;
  challengeActivityType?: ChallengeActivityType;
  challengeActivityData?: ChallengeActivity['data'];
}

export interface QuizOption {
    text: string;
    emoji: string;
}

export interface Quiz {
    question: string;
    options: QuizOption[];
    correctOption: string;
}

export interface Reminder {
    id: string;
    activityId: string;
    predictedAt: Date;
    visibleAt: Date;
}

export type ChallengeId = 'sleepChallenge' | 'beweegChallenge' | 'voedingChallenge' | 'stopRokenChallenge' | 'socialChallenge' | 'stressChallenge' | 'hartfalenChallenge';
export type ChallengeActivityType = 'introduction' | 'morningCheckin' | 'braintainment' | 'eveningCheckin' | 'breakfastCheckin' | 'lunchCheckin' | 'dinnerCheckin' | 'weighIn' | 'dailyAssignment' | 'snackCheckin' | 'drinkCheckin';
export type ChallengeActivityStatus = 'pending' | 'completed';
export interface MorningCheckinData { sleepDuration: { hours: number; minutes: number }; sleepQuality: number; }
export type EveningCheckinData = Record<string, boolean>;
export interface BraintainmentData { quizScore: number; }
export interface MovementMorningCheckinData { didExercise: boolean; }
export interface MovementEveningCheckinData { steps: number; }
export interface DailyAssignmentData { reflection: string; }
export interface SocialMorningCheckinData { emotionalState: number; socialEnergy: number; plannedAction: string; otherActionText?: string; }
export interface SocialEveningCheckinData { interactionQuality: number; actionCompleted: 'yes' | 'partly' | 'no'; socialSelfEsteem: number; }
export interface StressMorningCheckinData { pulseBefore: number; pulseAfter: number; earnedPoints?: number; }
export interface StressEveningCheckinData { pulseBefore: number; pulseAfter: number; relaxationActivity: string; earnedPoints?: number; }



export interface ChallengeActivity {
    id: string;
    challengeId: ChallengeId;
    day: number;
    type: ChallengeActivityType;
    scheduledAt: Date;
    status: ChallengeActivityStatus;
    data?: MorningCheckinData | EveningCheckinData | BraintainmentData | MovementMorningCheckinData | MovementEveningCheckinData | DailyAssignmentData | SocialMorningCheckinData | SocialEveningCheckinData | StressMorningCheckinData | StressEveningCheckinData;
    completedAt?: Date;
    memory?: Memory;
}

export interface ChallengeState {
    id: ChallengeId;
    activities: ChallengeActivity[];
    dbId?: string; // Database ID for backend sync
}

// --- Community Goal ---
export type CommunityGoalType = 'active_steps' | 'sleep_hours' | 'meal_photos' | 'total_steps' | 'smoking_assignments' | 'stress_exercises' | 'generic';

export interface CommunityGoal {
    id: string;
    type: CommunityGoalType;
    titleKey: string;
    target: number;
    currentProgress: number;
    participants: number; // Fictive number of other users
    unitKey: string;
    rewardBadgeId: string; // ID of the badge to award (reusing existing badges for simplicity or generic)
    relatedChallengeId?: ChallengeId;
}


// --- Measurements ---
export type MeasurementType = 'heartRate' | 'bloodPressure' | 'bloodGlucose' | 'steps' | 'weight' | 'temperature' | 'oxygenSaturation' | 'sleepDuration' | 'smoke';

export type HeartRateCondition = 'resting' | 'active' | 'other';
export type BloodGlucoseTiming = 'N' | 'NO' | 'VM' | 'NM' | 'VA' | 'NA' | 'VS';

interface BaseMeasurement {
    id: string;
    timestamp: Date;
    memory?: Memory;
}

export interface HeartRateMeasurement extends BaseMeasurement {
    type: 'heartRate';
    value: number;
    condition: HeartRateCondition;
}

export interface BloodPressureMeasurement extends BaseMeasurement {
    type: 'bloodPressure';
    systolic: number;
    diastolic: number;
}

export interface BloodGlucoseMeasurement extends BaseMeasurement {
    type: 'bloodGlucose';
    value: number;
    timing: BloodGlucoseTiming;
}

export interface StepsMeasurement extends BaseMeasurement {
    type: 'steps';
    value: number;
}

export interface WeightMeasurement extends BaseMeasurement {
    type: 'weight';
    value: number;
}

export interface TemperatureMeasurement extends BaseMeasurement {
    type: 'temperature';
    value: number;
}

export interface OxygenSaturationMeasurement extends BaseMeasurement {
    type: 'oxygenSaturation';
    value: number;
}

export interface SleepDurationMeasurement extends BaseMeasurement {
    type: 'sleepDuration';
    hours: number;
    minutes: number;
}

export interface SmokeMeasurement extends BaseMeasurement {
    type: 'smoke';
    value: number;
}

export type Measurement = HeartRateMeasurement | BloodPressureMeasurement | BloodGlucoseMeasurement | StepsMeasurement | WeightMeasurement | TemperatureMeasurement | OxygenSaturationMeasurement | SleepDurationMeasurement | SmokeMeasurement;

// --- BMI ---
export type BMICategory = 'underweight' | 'healthy' | 'overweight' | 'obese';

export interface BMICardInfo {
  bmi: number;
  category: BMICategory;
  timestamp: Date;
}

// --- Surveys ---
export type SurveyId = 'fourDKL' | 'phq9' | 'gad7' | 'audit' | 'cat' | 'vasPain' | 'gfi' | 'hads' | 'fagerstrom' | 'mmrc' | 'pam13' | 'ccq' | 'zlm' | 'algemeenHartfalen';
export type FourDKLDimension = 'distress' | 'depression' | 'anxiety' | 'somatization';
export type SurveyScores = Record<string, number>;
export type SurveyInterpretationLevel = 'low' | 'moderate' | 'high';
export type SurveyInterpretation = Record<string, SurveyInterpretationLevel>;

export interface SurveyResult {
    id: string;
    surveyId: SurveyId;
    timestamp: Date;
    answers: Record<string, string>; // questionKey -> answer textKey
    scores: SurveyScores;
    interpretation: SurveyInterpretation;
}

export interface SurveyAnswerOption {
    textKey: string;
    value: number;
    emoji?: string;
}

export interface SurveyQuestion {
    id: string;
    textKey: string;
    answerOptionsKey: string;
}

export interface Survey {
    id: SurveyId;
    nameKey: string;
    descriptionKey: string;
    icon: React.ComponentType<{ className?: string }>;
    questions: SurveyQuestion[];
    answerOptions: Record<string, SurveyAnswerOption[]>;
    scoringMap: Record<string, string[]>; // dimension -> question ids
    interpretationThresholds: Record<string, { moderate: number; high: number }>; // dimension -> thresholds
    scoreConverter?: (rawScores: SurveyScores) => SurveyScores;
}


export type Screen = 'welcome' | 'main';

export type View = 
    | { name: 'languageSelect' }
    | { name: 'appIntro' }
    | { name: 'userInfoEntry' }
    | { name: 'timeline' } 
    | { name: 'plan' } 
    | { name: 'agenda' } 
    | { name: 'settings' } 
    | { name: 'stats' } 
    | { name: 'activityLogger' } 
    | { name: 'addMemory', activityInfo: Activity | ChallengeActivity, goal: Goals[keyof Goals] | undefined } 
// FIX: Add optional `playAudio` property to allow audio playback after step creation.
    | { name: 'stepDetails', step: LifeStep, playAudio?: boolean } 
    | { name: 'quiz', data: { quizData: Quiz; step: LifeStep; selectedActivity: Activity, memory?: Memory } } 
    | { name: 'avatarComparison', before: string, after: string } 
    | { name: 'morningCheckin', activity: ChallengeActivity } 
    | { name: 'eveningCheckin', activity: ChallengeActivity } 
    | { name: 'challengeBraintainment', activity: ChallengeActivity } 
    | { name: 'challengeIntroduction', activity: ChallengeActivity } 
    | { name: 'challengeIntroPreview', challengeId: ChallengeId }
    | { name: 'selectMeasurement' } 
    | { name: 'logMeasurement', measurementType: MeasurementType, measurements: Measurement[] } 
    | { name: 'selectSurvey' } 
    | { name: 'fillSurvey', survey: Survey } 
    | { name: 'surveyResult', result: SurveyResult } 
    | { name: 'morningCheckinMovement', activity: ChallengeActivity } 
    | { name: 'eveningCheckinMovement', activity: ChallengeActivity } 
    | { name: 'challengeCheckinVoeding', activity: ChallengeActivity } 
    | { name: 'challengeAssignment', activity: ChallengeActivity } 
    | { name: 'logCigarette' } 
    | { name: 'morningCheckinSocial', activity: ChallengeActivity } 
    | { name: 'eveningCheckinSocial', activity: ChallengeActivity } 
    | { name: 'morningCheckinStress', activity: ChallengeActivity }
    | { name: 'eveningCheckinStress', activity: ChallengeActivity }
    | { name: 'chatbot' }
    | { name: 'setGoal', goalKey: keyof Goals, activity?: Activity, measurements: Measurement[], source?: 'plan' | 'challengeIntro' }
    | { name: 'weightProgress', newMeasurement: WeightMeasurement, goal: WeightGoal }
    | { name: 'logJournal', journalId: JournalId };

export interface ChatMessage {
    id: number;
    role: 'user' | 'model';
    content: string;
    status?: 'sent' | 'read';
    prompt?: string;
    functionCall?: any;
    functionResponse?: any;
    action?: {
        type: 'confirmReplaceChallenge';
        challengeId: ChallengeId;
    };
}

export interface ProcessedStepPayload {
    lifeStory: LifeStep[];
    points: number;
    pillarPoints: Record<LifestylePillar, number>;
    activityPoints: Record<string, number>;
    currentAvatar: string;
    currentStreak: number;
    communityGoal: CommunityGoal | null; // Added
    lastEarnedCommunityBadge: Badge | undefined; // Added
    lastActivityDate: string;
    showConfetti: boolean;
    view: View;
    loadingMessageKey: null;
    reminders: Reminder[];
}

export interface ProcessedChallengeStepPayload {
    newLifeStep: LifeStep;
    updatedChallengeActivity: ChallengeActivity;
    newMeasurements: Measurement[];
    points: number;
    pillarPoints: Record<LifestylePillar, number>;
    activityPoints: Record<string, number>;
    currentAvatar: string;
    currentStreak: number;
    communityGoal: CommunityGoal | null; // Added
    lastEarnedCommunityBadge: Badge | undefined; // Added
    lastActivityDate: string;
    showConfetti: boolean;
    loadingMessageKey: null;
}

export interface AppState {
    view: View;
    userInfo: UserInfo;
    goals: Goals;
    currentAvatar: string | null;
    lifeStory: LifeStep[];
    measurements: Measurement[];
    surveys: SurveyResult[];
    points: number;
    pillarPoints: Record<LifestylePillar, number>;
    activityPoints: Record<string, number>;
    loadingMessageKey: string | null;
    showConfetti: boolean;
    allHabitsUnlocked: boolean;
    currentStreak: number; // Retained for individual tracking legacy, but UI uses Community Goal
    communityGoal: CommunityGoal | null; // New Community Goal
    lastEarnedCommunityBadge: Badge | undefined; // New Field for progressive badges
    lastActivityDate: string | null;
    reminders: Reminder[];
    challenge?: ChallengeState;
    challengeHistory: ChallengeActivity[];
    activeJournal?: JournalId;
    journalHistory: JournalEntry[];
    initialBMI?: BMICardInfo | null;
// FIX: Add missing state properties for avatar updates and speech synthesis features.
    isAvatarUpdatesEnabled: boolean;
    isSpeechEnabled: boolean;
}

export type PendingCelebration = 
    | { type: 'step'; payload: ProcessedStepPayload }
    | { type: 'challenge'; payload: ProcessedChallengeStepPayload };

export type Action =
    | { type: 'LOAD_STATE'; payload: Partial<AppState> }
    | { type: 'SET_CURRENT_AVATAR'; payload: string }
    | { type: 'SET_VIEW'; payload: View }
    | { type: 'SET_LOADING'; payload: string | null }
    | { type: 'COMPLETE_ONBOARDING'; payload: { userInfo: UserInfo; avatar: string; weight: number | null; height: number | null; } }
    | { type: 'COMMIT_PROCESSED_STEP'; payload: ProcessedStepPayload }
    | { type: 'COMMIT_CHALLENGE_LIFESTEP'; payload: ProcessedChallengeStepPayload }
    | { type: 'UPDATE_USER_INFO'; payload: UserInfo }
    | { type: 'UPDATE_GOAL'; payload: { goalKey: keyof Goals; goalData: any } }
    | { type: 'REMOVE_GOAL'; payload: keyof Goals }
    | { type: 'TOGGLE_ALL_HABITS'; payload: boolean }
    | { type: 'HIDE_CONFETTI' }
    | { type: 'SET_REMINDERS', payload: Reminder[] }
    | { type: 'UPDATE_CHALLENGE_ACTIVITY_TIME', payload: { id: string, newDate: Date } }
    | { type: 'UPDATE_REMINDER_TIME', payload: { id: string, newDate: Date } }
    | { type: 'SET_CHALLENGE', payload: ChallengeState | undefined }
    | { type: 'SET_CHALLENGE_ACTIVITIES', payload: ChallengeActivity[] }
    | { type: 'UPDATE_CHALLENGE_ACTIVITY', payload: ChallengeActivity }
    | { type: 'STOP_CHALLENGE' }
    | { type: 'ADD_MEASUREMENT', payload: Measurement }
    | { type: 'ADD_SURVEY_RESULT', payload: SurveyResult }
    | { type: 'INITIATE_CHALLENGE'; payload: { challengeId: ChallengeId; dbId?: string } }
    | { type: 'START_JOURNAL'; payload: JournalId }
    | { type: 'STOP_JOURNAL' }
    | { type: 'ADD_JOURNAL_ENTRY'; payload: JournalEntry };

// FIX: Re-export all types from './goals/types' to resolve multiple import errors across the app.
// The previous selective export was causing issues where specific goal types were not available.
export * from './goals/types';
export * from './journals/types';
