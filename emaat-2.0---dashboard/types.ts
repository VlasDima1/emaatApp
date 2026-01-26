
export enum Domain {
  Slaap = "Slaap",
  Beweeg = "Beweeg",
  Voeding = "Voeding",
  Roken = "Stoppen met roken",
  Sociaal = "Sociale vaardigheden",
  Stress = "Stress",
  Alcohol = "Alcohol",
  Ontspanning = "Ontspanning",
  Zingeving = "Zingeving",
  Financien = "Financiën",
  Hartfalen = "Hartfalen",
}

export enum QuestionnaireType {
  ZLM = "Ziektelast Meter (ZLM)",
  CCQ = "Clinical COPD Questionnaire (CCQ)",
  FourDKL = "Vierdimensionale Klachtenlijst (4DKL)",
  PHQ9 = "Gezondheidsvragenlijst (PHQ-9)",
  GAD7 = "Generalized Anxiety Disorder-7 (GAD-7)",
  HADS = "Hospital Anxiety and Depression Scale (HADS)",
  AUDIT = "Alcohol Use Disorders Identification Test (AUDIT)",
  Fagerstrom = "Fagerström Test voor Nicotineafhankelijkheid",
  CAT = "COPD Assessment Test (CAT)",
  mMRC = "mMRC Dyspneu Schaal",
  VAS = "Visueel Analoge Schaal (VAS) voor Pijn",
  GFI = "Groningen Frailty Indicator (GFI)",
  PAM13 = "Vragenlijst Zelfmanagement (PAM-13)"
}

export interface QuestionnaireItem {
    id: string;
    question: string;
    answerLabel: string;
    score: number;
}

export interface QuestionnaireResult {
    id: string;
    type: QuestionnaireType;
    description: string;
    completed: boolean;
    date?: string;
    score?: number;
    maxScore?: number;
    resultLabel?: string;
    subScores?: { 
        label: string; 
        score: number; 
        max: number; 
        threshold: number; 
        interpretation?: string;
        interpretationDetails?: string; 
    }[];
    answers?: QuestionnaireItem[];
}

export interface SleepDataDetails {
  wentToBedOnTime: boolean;
  noAlcoholOrCoffee: boolean;
  darkAndQuiet: boolean;
  goodTemperature: boolean;
  didMoveToday: boolean;
  noScreenTime: boolean;
  relaxingActivity: boolean;
  sleepQuality?: number; // 1-5 star rating from morning checkin
}

export interface MovementDataDetails {
    dailyGoal: number;
    morningExerciseCompleted: boolean;
    quizScore: number; // 0, 1, or 2
}

export interface NutritionDataDetails {
    weight?: number; // kg, only on specific days
    mealsLogged: {
        breakfast: boolean;
        lunch: boolean;
        dinner: boolean;
    };
    quizScore: number; // 0, 1, or 2
}

export interface CigaretteLog {
    id: string;
    timestamp: string; // "HH:MM"
}

export interface DailyDataPoint {
  date: string; // "YYYY-MM-DD"
  value: number;
  interactions: {
    morning: boolean;
    midday: boolean;
    evening: boolean;
  };
  notes?: string;
  details?: SleepDataDetails;
  movementDetails?: MovementDataDetails;
  nutritionDetails?: NutritionDataDetails;
  cigaretteLogs?: CigaretteLog[];
}

export interface Challenge {
  domain: Domain;
  startDate: string;
  endDate: string;
  progress: number; // 0-100
  status?: 'active' | 'completed' | 'stopped' | 'new'; // Challenge status from backend
  data: DailyDataPoint[];
}

export interface VitalityMeasurement {
  id: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  weight?: number; // kg
  bloodPressureSystolic?: number; // mmHg (bovendruk)
  bloodPressureDiastolic?: number; // mmHg (onderdruk)
  heartRate?: number; // bpm
  temperature?: number; // Celsius
  bloodSugar?: number; // mmol/L
  steps?: number; // daily step count
  sleepHours?: number; // sleep duration in hours
}

export interface Participant {
  id: string;
  name: string;
  avatarUrl: string;
  age: number;
  dateOfBirth: string; // "YYYY-MM-DD"
  height: number; // cm
  address: string;
  phone: string;
  email: string;
  currentChallenge: Domain;
  overallProgress: number; // 0-100
  challenges: Challenge[];
  vitalityMeasurements: VitalityMeasurement[];
  questionnaires: QuestionnaireResult[];
}
