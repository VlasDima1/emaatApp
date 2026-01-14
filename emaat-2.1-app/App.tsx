
import React, { useReducer, useEffect, useState, useRef } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Confetti from './components/Confetti';
import { AppState, Action, View, UserInfo, ChallengeId, JournalId, Activity, Reminder, ChallengeActivity, Goals, LifeStep, Measurement } from './types';
import { POINTS_PER_LEVEL, ACTIVITIES } from './constants';
import { processNewStep, processCompletedChallengeActivity, handleQuizAnswer } from './appActions';
import { generateSleepChallenge } from './challenges/sleepChallenge';
import { generateBeweegChallenge } from './challenges/beweegChallenge';
import { generateVoedingChallenge } from './challenges/voedingChallenge';
import { generateStopRokenChallenge } from './challenges/stopRokenChallenge';
import { generateSocialChallenge } from './challenges/socialChallenge';
import { generateStressChallenge } from './challenges/stressChallenge';
import { useLanguage } from './contexts/LanguageContext';
import { getTodayDateString, generateRemindersForGoal, generateCommunityGoal } from './utils';
import { generateAvatar } from './services/geminiService';
import { syncService } from './services/syncService';
import { apiService } from './services/apiService';
import ConfirmationModal from './components/ConfirmationModal';
import { setAsset } from './db';
import { StarIcon, BedIcon, DumbbellIcon, UtensilsIcon, SmokingIcon, UsersIcon, LeafIcon } from './components/Icons';

// Screens
import LanguageSelectScreen from './components/screens/LanguageSelectScreen';
import AppIntroScreen from './components/screens/AppIntroScreen';
import OnboardingUserInfoScreen from './components/screens/OnboardingUserInfoScreen';
import LoginScreen from './components/screens/LoginScreen';
import RegisterScreen from './components/screens/RegisterScreen';
import MainScreen from './components/screens/MainScreen';
import PlanScreen from './components/screens/PlanScreen';
import AgendaScreen from './components/screens/AgendaScreen';
import StatsScreen from './components/screens/StatsScreen';
import ActivityLogger from './components/screens/ActivityLogger';
import AddMemoryScreen from './components/screens/AddMemoryScreen';
import LifeStepDetailScreen from './components/screens/LifeStepDetailScreen';
import QuizScreen from './components/screens/QuizScreen';
import AvatarDetailScreen from './components/screens/AvatarDetailScreen';
import AvatarComparisonView from './components/screens/AvatarComparisonView';
import MorningCheckinScreen from './components/screens/MorningCheckinScreen';
import EveningCheckinScreen from './components/screens/EveningCheckinScreen';
import ChallengeBraintainmentScreen from './components/screens/ChallengeBraintainmentScreen';
import ChallengeIntroductionScreen from './components/screens/ChallengeIntroductionScreen';
import SelectMeasurementScreen from './components/screens/SelectMeasurementScreen';
import LogMeasurementScreen from './components/screens/LogMeasurementScreen';
import SelectSurveyScreen from './components/screens/SelectSurveyScreen';
import FillSurveyScreen from './components/screens/FillSurveyScreen';
import SurveyResultScreen from './components/screens/SurveyResultScreen';
import MorningCheckinScreenMovement from './components/screens/MorningCheckinScreenMovement';
import EveningCheckinScreenMovement from './components/screens/EveningCheckinScreenMovement';
import ChallengeIntroductionScreenMovement from './components/screens/ChallengeIntroductionScreenMovement';
import SetGoalScreen from './components/screens/SetGoalScreen';
import SetMovementGoalScreen from './components/screens/SetMovementGoalScreen';
import ChallengeCheckinScreenVoeding from './components/screens/ChallengeCheckinScreenVoeding';
import ChallengeIntroductionScreenVoeding from './components/screens/ChallengeIntroductionScreenVoeding';
import ChallengeIntroductionScreenStopRoken from './components/screens/ChallengeIntroductionScreenStopRoken';
import ChallengeAssignmentScreen from './components/screens/ChallengeAssignmentScreen';
import LogCigaretteScreen from './components/screens/LogCigaretteScreen';
import ChallengeIntroductionScreenSocial from './components/screens/ChallengeIntroductionScreenSocial';
import MorningCheckinScreenSocial from './components/screens/MorningCheckinScreenSocial';
import EveningCheckinScreenSocial from './components/screens/EveningCheckinScreenSocial';
import ChallengeIntroductionScreenStress from './components/screens/ChallengeIntroductionScreenStress';
import MorningCheckinScreenStress from './components/screens/MorningCheckinScreenStress';
import EveningCheckinScreenStress from './components/screens/EveningCheckinScreenStress';
import ChatbotScreen from './components/screens/ChatbotScreen';
import WeightProgressScreen from './components/screens/WeightProgressScreen';
import LogJournalScreen from './components/screens/LogJournalScreen';
import BottomNavBar from './components/BottomNavBar';


const initialState: AppState = {
    view: { name: 'languageSelect' },
    userInfo: { name: '', age: null, gender: 'unspecified' },
    goals: {},
    currentAvatar: null,
    lifeStory: [],
    measurements: [],
    surveys: [],
    points: 0,
    pillarPoints: { sleep: 0, nutrition: 0, social: 0, stress_reduction: 0, exercise: 0 },
    activityPoints: {},
    loadingMessageKey: null,
    showConfetti: false,
    allHabitsUnlocked: true, 
    currentStreak: 0,
    communityGoal: generateCommunityGoal(),
    lastEarnedCommunityBadge: undefined,
    lastActivityDate: null,
    reminders: [],
    challengeHistory: [],
    journalHistory: [],
    isAvatarUpdatesEnabled: true,
    isSpeechEnabled: true,
};

function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'LOAD_STATE':
            return { ...state, ...action.payload };
        case 'SET_VIEW':
            return { ...state, view: action.payload };
        case 'SET_CURRENT_AVATAR':
            return { ...state, currentAvatar: action.payload };
        case 'SET_LOADING':
            return { ...state, loadingMessageKey: action.payload };
        case 'COMPLETE_ONBOARDING':
            return {
                ...state,
                userInfo: { ...state.userInfo, ...action.payload.userInfo },
                currentAvatar: action.payload.avatar,
                initialBMI: (action.payload.weight && action.payload.height) ? {
                    bmi: action.payload.weight / ((action.payload.height / 100) * (action.payload.height / 100)),
                    category: (() => {
                        const bmi = action.payload.weight / ((action.payload.height / 100) * (action.payload.height / 100));
                        if (bmi < 18.5) return 'underweight';
                        if (bmi < 25) return 'healthy';
                        if (bmi < 30) return 'overweight';
                        return 'obese';
                    })(),
                    timestamp: new Date(),
                } : null,
                view: { name: 'timeline' }
            };
        case 'COMMIT_PROCESSED_STEP':
            return {
                ...state,
                ...action.payload,
            };
        case 'COMMIT_CHALLENGE_LIFESTEP':
            const { newLifeStep, updatedChallengeActivity, newMeasurements, ...otherPayload } = action.payload;
            const updatedActivities = state.challenge ? state.challenge.activities.map(a => a.id === updatedChallengeActivity.id ? updatedChallengeActivity : a) : [];
            return {
                ...state,
                ...otherPayload,
                lifeStory: [newLifeStep, ...state.lifeStory],
                measurements: [...newMeasurements, ...state.measurements],
                challenge: state.challenge ? { ...state.challenge, activities: updatedActivities } : undefined,
                view: { name: 'timeline' },
            };
        case 'UPDATE_USER_INFO':
            return { ...state, userInfo: action.payload };
        case 'UPDATE_GOAL':
             const newGoals = { ...state.goals, [action.payload.goalKey]: action.payload.goalData };
             const newReminders = generateRemindersForGoal(action.payload.goalKey, action.payload.goalData);
             return { 
                 ...state, 
                 goals: newGoals,
                 reminders: [...state.reminders, ...newReminders]
             };
        case 'REMOVE_GOAL':
            const { [action.payload]: _, ...remainingGoals } = state.goals;
            return { ...state, goals: remainingGoals };
        case 'TOGGLE_ALL_HABITS':
            return { ...state, allHabitsUnlocked: action.payload };
        case 'HIDE_CONFETTI':
            return { ...state, showConfetti: false };
        case 'SET_REMINDERS':
            return { ...state, reminders: action.payload };
        case 'UPDATE_REMINDER_TIME':
            return {
                ...state,
                reminders: state.reminders.map(r => r.id === action.payload.id ? { ...r, predictedAt: action.payload.newDate } : r)
            };
        case 'UPDATE_CHALLENGE_ACTIVITY_TIME':
            return {
                ...state,
                challenge: state.challenge ? {
                    ...state.challenge,
                    activities: state.challenge.activities.map(a => a.id === action.payload.id ? { ...a, scheduledAt: action.payload.newDate } : a)
                } : undefined
            };
        case 'SET_CHALLENGE':
            return { ...state, challenge: action.payload };
        case 'UPDATE_CHALLENGE_ACTIVITY':
             return {
                ...state,
                challenge: state.challenge ? {
                    ...state.challenge,
                    activities: state.challenge.activities.map(a => a.id === action.payload.id ? action.payload : a)
                } : undefined
            };
        case 'STOP_CHALLENGE':
             const archivedActivities = state.challenge ? state.challenge.activities.filter(a => a.status === 'completed') : [];
             return { 
                 ...state, 
                 challenge: undefined,
                 challengeHistory: [...state.challengeHistory, ...archivedActivities],
                 communityGoal: generateCommunityGoal() 
             };
        case 'INITIATE_CHALLENGE':
            let challengeActivities: ChallengeActivity[] = [];
            const startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            
            switch(action.payload) {
                case 'sleepChallenge': challengeActivities = generateSleepChallenge(state.goals.regularSleep || { bedtime: '22:30', wakeTime: '06:30' } as any, startDate); break;
                case 'beweegChallenge': challengeActivities = generateBeweegChallenge(startDate); break;
                case 'voedingChallenge': challengeActivities = generateVoedingChallenge(startDate); break;
                case 'stopRokenChallenge': challengeActivities = generateStopRokenChallenge(startDate); break;
                case 'socialChallenge': challengeActivities = generateSocialChallenge(startDate); break;
                case 'stressChallenge': challengeActivities = generateStressChallenge(startDate); break;
            }
            return {
                ...state,
                challenge: { id: action.payload, activities: challengeActivities },
                communityGoal: generateCommunityGoal(action.payload),
                view: { name: 'timeline' }
            };
        case 'ADD_MEASUREMENT':
             return { ...state, measurements: [action.payload, ...state.measurements], view: { name: 'timeline' } };
        case 'ADD_SURVEY_RESULT':
             return { ...state, surveys: [action.payload, ...state.surveys], view: { name: 'surveyResult', result: action.payload } };
        case 'START_JOURNAL':
            return { ...state, activeJournal: action.payload, view: { name: 'logJournal', journalId: action.payload } };
        case 'STOP_JOURNAL':
             return { ...state, activeJournal: undefined };
        case 'ADD_JOURNAL_ENTRY':
             return { ...state, journalHistory: [action.payload, ...state.journalHistory], points: state.points + 5, view: { name: 'timeline' } };
        default:
            return state;
    }
}

const AppContent = () => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const { t, setLanguage, language } = useLanguage();
    const { isAuthenticated, login, register, isLoading: authLoading, user } = useAuth();
    
    const [pendingChallengeId, setPendingChallengeId] = useState<ChallengeId | null>(null);
    const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
    const [authScreen, setAuthScreen] = useState<'login' | 'register' | null>(null);
    const [skippedAuth, setSkippedAuth] = useState(() => {
        return localStorage.getItem('eMaatSkippedAuth') === 'true';
    });
    const [languageSelected, setLanguageSelected] = useState(() => {
        return localStorage.getItem('eMaatLanguageSelected') === 'true';
    });

    // Show auth screens if language selected and not authenticated and not skipped
    const showAuth = languageSelected && !isAuthenticated && !skippedAuth && !authLoading;

    const handleLanguageSelected = () => {
        localStorage.setItem('eMaatLanguageSelected', 'true');
        setLanguageSelected(true);
    };

    const handleSkipAuth = () => {
        localStorage.setItem('eMaatSkippedAuth', 'true');
        setSkippedAuth(true);
        // Go to onboarding flow for non-authenticated users
        dispatch({ type: 'SET_VIEW', payload: { name: 'appIntro' } });
    };

    // When user logs in, populate their data and skip to timeline
    useEffect(() => {
        if (isAuthenticated && user && languageSelected) {
            // Update userInfo from backend user data
            const userInfo = {
                name: user.name || '',
                email: user.email,
                dateOfBirth: user.dateOfBirth || null,
                gender: user.gender || 'unspecified',
                age: user.dateOfBirth ? calculateAge(user.dateOfBirth) : null,
                height: user.height || null,
            };
            dispatch({ type: 'UPDATE_USER_INFO', payload: userInfo });
            
            // Set the avatar from backend if available
            if (user.avatarUrl) {
                dispatch({ type: 'SET_CURRENT_AVATAR', payload: user.avatarUrl });
            }
            
            // Update points and streak from backend
            if (user.points !== undefined) {
                // Points are stored in state, we might need to sync them
                // For now, we trust the backend's points value
            }
            
            // Go directly to timeline (skip onboarding)
            if (state.view.name === 'languageSelect' || state.view.name === 'appIntro' || state.view.name === 'userInfoEntry') {
                dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } });
            }
        }
    }, [isAuthenticated, user, languageSelected]);

    // Track if backend data has been loaded to prevent repeated fetches
    const backendDataLoaded = useRef(false);

    // Fetch data from backend when authenticated
    useEffect(() => {
        if (!isAuthenticated || backendDataLoaded.current) return;
        
        const fetchBackendData = async () => {
            try {
                console.log('Fetching data from backend...');
                
                // Fetch all data in parallel
                const [measurementsRes, lifeStepsRes, surveysRes, goalsRes, challengesRes, journalsRes] = await Promise.all([
                    apiService.getMeasurements().catch(err => { console.error('Error fetching measurements:', err); return null; }),
                    apiService.getLifeSteps().catch(err => { console.error('Error fetching life steps:', err); return null; }),
                    apiService.getSurveys().catch(err => { console.error('Error fetching surveys:', err); return null; }),
                    apiService.getGoals().catch(err => { console.error('Error fetching goals:', err); return null; }),
                    apiService.getActiveChallenges().catch(err => { console.error('Error fetching challenges:', err); return null; }),
                    apiService.getJournals().catch(err => { console.error('Error fetching journals:', err); return null; }),
                ]);
                
                const partialState: Partial<AppState> = {};
                
                // Transform and merge measurements from backend
                if (measurementsRes?.data && Array.isArray(measurementsRes.data)) {
                    const backendMeasurements: Measurement[] = measurementsRes.data.map((m: any) => {
                        const base = {
                            id: m.id,
                            timestamp: new Date(m.timestamp),
                            memory: m.memoryContent ? {
                                content: m.memoryContent,
                                photoKey: m.memoryPhotoKey,
                                isPrivate: m.isPrivate
                            } : undefined
                        };
                        
                        switch (m.type) {
                            case 'bloodPressure':
                                return { ...base, type: m.type, systolic: m.systolic, diastolic: m.diastolic };
                            case 'sleepDuration':
                                return { ...base, type: m.type, hours: m.hours, minutes: m.minutes };
                            case 'heartRate':
                                return { ...base, type: m.type, value: m.value, condition: m.condition || 'resting' };
                            case 'bloodGlucose':
                                return { ...base, type: m.type, value: m.value, timing: m.timing || 'N' };
                            default:
                                return { ...base, type: m.type, value: m.value };
                        }
                    }) as Measurement[];
                    
                    // Merge with existing measurements (backend takes priority for duplicates by ID)
                    const existingIds = new Set(state.measurements.map(m => m.id));
                    const newFromBackend = backendMeasurements.filter(m => !existingIds.has(m.id));
                    partialState.measurements = [...newFromBackend, ...state.measurements];
                    console.log(`Loaded ${backendMeasurements.length} measurements from backend`);
                }
                
                // Transform and merge life steps from backend
                if (lifeStepsRes?.data && Array.isArray(lifeStepsRes.data)) {
                    const backendLifeSteps: LifeStep[] = lifeStepsRes.data.map((s: any) => {
                        // Find the standard activity to restore the icon
                        const standardActivity = ACTIVITIES.find(a => a.id === s.activityId);
                        const activity: Activity = standardActivity || {
                            id: s.activityId,
                            icon: StarIcon,
                            color: 'text-gray-500',
                            points: 0,
                            pillar: 'sleep',
                            minLevel: 1
                        };
                        
                        return {
                            id: s.id,
                            activity,
                            timestamp: new Date(s.timestamp),
                            nudge: s.nudge || '',
                            pointsBefore: s.pointsBefore || 0,
                            pointsAfter: s.pointsAfter || 0,
                            avatarBefore: s.avatarBeforeKey || '',
                            avatarAfter: s.avatarAfterKey || '',
                            pointsDoubled: s.pointsDoubled || false,
                            audioData: s.audioDataKey || null,
                            memory: s.memoryContent ? {
                                content: s.memoryContent,
                                photoKey: s.memoryPhotoKey,
                                isPrivate: s.isPrivate
                            } : undefined,
                            earnedBadge: s.earnedBadge,
                            challengeActivityId: s.challengeActivityId
                        };
                    }) as LifeStep[];
                    
                    // Merge with existing life steps (backend takes priority for duplicates by ID)
                    const existingIds = new Set(state.lifeStory.map(s => s.id));
                    const newFromBackend = backendLifeSteps.filter(s => !existingIds.has(s.id));
                    partialState.lifeStory = [...newFromBackend, ...state.lifeStory];
                    console.log(`Loaded ${backendLifeSteps.length} life steps from backend`);
                }
                
                // Transform and merge surveys from backend
                if (surveysRes?.data && Array.isArray(surveysRes.data)) {
                    const backendSurveys = surveysRes.data.map((s: any) => ({
                        id: s.id,
                        surveyId: s.surveyId,
                        score: s.score || s.totalScore,
                        level: s.level || s.resultLabel,
                        timestamp: new Date(s.timestamp),
                        answers: Array.isArray(s.answers) ? s.answers : []
                    }));
                    
                    const existingIds = new Set(state.surveys.map(s => s.id));
                    const newFromBackend = backendSurveys.filter((s: any) => !existingIds.has(s.id));
                    partialState.surveys = [...newFromBackend, ...state.surveys];
                    console.log(`Loaded ${backendSurveys.length} surveys from backend`);
                }
                
                // Transform and merge goals from backend
                if (goalsRes?.data && Array.isArray(goalsRes.data)) {
                    const backendGoals: Goals = {};
                    goalsRes.data.forEach((g: any) => {
                        if (g.goalKey) {
                            // The backend returns goalData already parsed and spread into the object
                            // Extract everything except id, goalKey, isActive, createdAt, updatedAt
                            const { id, goalKey, isActive, createdAt, updatedAt, ...goalData } = g;
                            backendGoals[goalKey as keyof Goals] = goalData;
                        }
                    });
                    
                    // Merge goals (backend takes priority)
                    partialState.goals = { ...state.goals, ...backendGoals };
                    console.log(`Loaded ${goalsRes.data.length} goals from backend`);
                }
                
                // Transform and load active challenge from backend
                if (challengesRes?.data && Array.isArray(challengesRes.data) && challengesRes.data.length > 0) {
                    // Get the first active challenge (there should only be one)
                    const activeChallenge = challengesRes.data[0];
                    if (activeChallenge) {
                        const challengeId = activeChallenge.challengeId || activeChallenge.type;
                        console.log('Found active challenge from backend:', challengeId);
                        
                        // Generate challenge activities for the frontend
                        const startDate = new Date(activeChallenge.startDate);
                        startDate.setHours(0, 0, 0, 0);
                        
                        let challengeActivities: ChallengeActivity[] = [];
                        switch(challengeId) {
                            case 'sleepChallenge': 
                                challengeActivities = generateSleepChallenge(state.goals.regularSleep || { bedtime: '22:30', wakeTime: '06:30' } as any, startDate); 
                                break;
                            case 'beweegChallenge': 
                                challengeActivities = generateBeweegChallenge(startDate); 
                                break;
                            case 'voedingChallenge': 
                                challengeActivities = generateVoedingChallenge(startDate); 
                                break;
                            case 'stopRokenChallenge': 
                                challengeActivities = generateStopRokenChallenge(startDate); 
                                break;
                            case 'socialChallenge': 
                                challengeActivities = generateSocialChallenge(startDate); 
                                break;
                            case 'stressChallenge': 
                                challengeActivities = generateStressChallenge(startDate); 
                                break;
                        }
                        
                        if (challengeActivities.length > 0) {
                            partialState.challenge = { 
                                id: challengeId as ChallengeId, 
                                activities: challengeActivities,
                                dbId: activeChallenge.id // Store the database ID for updates
                            };
                            console.log(`Loaded active challenge: ${challengeId} with ${challengeActivities.length} activities`);
                        }
                    }
                }
                
                // Transform and merge journals from backend
                if (journalsRes?.data && Array.isArray(journalsRes.data)) {
                    const backendJournals = journalsRes.data.map((j: any) => ({
                        id: j.id,
                        journalId: j.type,
                        timestamp: new Date(j.timestamp),
                        data: j.content,
                        memory: j.memoryContent ? {
                            content: j.memoryContent,
                            photoUrl: j.memoryPhotoKey,
                            isPrivate: j.memoryIsPrivate
                        } : undefined
                    }));
                    
                    const existingIds = new Set(state.journalHistory.map(j => j.id));
                    const newFromBackend = backendJournals.filter((j: any) => !existingIds.has(j.id));
                    partialState.journalHistory = [...newFromBackend, ...state.journalHistory];
                    console.log(`Loaded ${backendJournals.length} journal entries from backend`);
                }
                
                // Update state with backend data
                if (Object.keys(partialState).length > 0) {
                    dispatch({ type: 'LOAD_STATE', payload: partialState });
                    console.log('Backend data merged into state');
                }
                
                backendDataLoaded.current = true;
            } catch (error) {
                console.error('Failed to fetch backend data:', error);
            }
        };
        
        fetchBackendData();
    }, [isAuthenticated]);

    // Helper function to calculate age
    const calculateAge = (dateOfBirth: string): number | null => {
        if (!dateOfBirth) return null;
        const today = new Date();
        const birth = new Date(dateOfBirth);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    useEffect(() => {
        const loadState = async () => {
            const saved = localStorage.getItem('eMaatState_v2');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    
                    // Re-hydrate LifeStory Activities with Icons
                    if (parsed.lifeStory) {
                        parsed.lifeStory.forEach((s: any) => {
                            s.timestamp = new Date(s.timestamp);
                            // Find the standard activity to restore the icon
                            const standardActivity = ACTIVITIES.find(a => a.id === s.activity.id);
                            if (standardActivity) {
                                s.activity = standardActivity;
                            } else {
                                // Fallback for challenge activities or unknown IDs
                                // Try to map based on challenge ID if available, or default
                                let icon = StarIcon;
                                let color = 'text-gray-500';
                                if (s.challengeId) {
                                    if (s.challengeId === 'sleepChallenge') { icon = BedIcon; color = 'text-indigo-500'; }
                                    else if (s.challengeId === 'beweegChallenge') { icon = DumbbellIcon; color = 'text-sky-500'; }
                                    else if (s.challengeId === 'voedingChallenge') { icon = UtensilsIcon; color = 'text-emerald-500'; }
                                    else if (s.challengeId === 'stopRokenChallenge') { icon = SmokingIcon; color = 'text-slate-500'; }
                                    else if (s.challengeId === 'socialChallenge') { icon = UsersIcon; color = 'text-amber-500'; }
                                    else if (s.challengeId === 'stressChallenge') { icon = LeafIcon; color = 'text-teal-500'; }
                                }
                                s.activity.icon = icon;
                                s.activity.color = s.activity.color || color;
                            }
                        });
                    }

                    if (parsed.reminders) parsed.reminders.forEach((r: any) => { r.predictedAt = new Date(r.predictedAt); r.visibleAt = new Date(r.visibleAt); });
                    if (parsed.measurements) parsed.measurements.forEach((m: any) => m.timestamp = new Date(m.timestamp));
                    if (parsed.surveys) parsed.surveys.forEach((s: any) => s.timestamp = new Date(s.timestamp));
                    if (parsed.challenge?.activities) parsed.challenge.activities.forEach((a: any) => { a.scheduledAt = new Date(a.scheduledAt); if(a.completedAt) a.completedAt = new Date(a.completedAt); });
                    if (parsed.challengeHistory) parsed.challengeHistory.forEach((a: any) => { a.scheduledAt = new Date(a.scheduledAt); if(a.completedAt) a.completedAt = new Date(a.completedAt); });
                    if (parsed.journalHistory) parsed.journalHistory.forEach((j: any) => j.timestamp = new Date(j.timestamp));
                    if (parsed.initialBMI) parsed.initialBMI.timestamp = new Date(parsed.initialBMI.timestamp);

                    if (parsed.view && parsed.view.name !== 'languageSelect' && parsed.view.name !== 'appIntro' && parsed.view.name !== 'userInfoEntry') {
                         parsed.view = { name: 'timeline' };
                    }
                    
                    dispatch({ type: 'LOAD_STATE', payload: parsed });
                } catch (e) {
                    console.error("Failed to load state", e);
                }
            }
        };
        loadState();
    }, []);

    useEffect(() => {
        if (state.userInfo.name) {
            // We must avoid saving circular structures or heavy objects if possible, 
            // but here we rely on default serialization which strips functions (like icons).
            // The re-hydration logic above handles restoring them.
            localStorage.setItem('eMaatState_v2', JSON.stringify(state));
        }
    }, [state]);

    useEffect(() => {
        if (state.showConfetti) {
            const timer = setTimeout(() => dispatch({ type: 'HIDE_CONFETTI' }), 5000);
            return () => clearTimeout(timer);
        }
    }, [state.showConfetti]);

    // Track previous measurements count to detect new additions
    const prevMeasurementsCount = useRef(state.measurements.length);
    
    // Sync new measurements to backend
    useEffect(() => {
        if (state.measurements.length > prevMeasurementsCount.current && isAuthenticated) {
            // New measurement was added, sync it
            const newMeasurement = state.measurements[0]; // Most recent is first
            syncService.syncMeasurement(newMeasurement).then(success => {
                if (success) {
                    console.log('Measurement synced to backend');
                }
            });
        }
        prevMeasurementsCount.current = state.measurements.length;
    }, [state.measurements.length, isAuthenticated]);

    // Track previous lifeStory count to detect new steps
    const prevLifeStoryCount = useRef(state.lifeStory.length);
    
    // Sync new life steps to backend
    useEffect(() => {
        if (state.lifeStory.length > prevLifeStoryCount.current && isAuthenticated) {
            const newStep = state.lifeStory[0];
            syncService.syncLifeStep(newStep).then(success => {
                if (success) {
                    console.log('Life step synced to backend');
                }
            });
        }
        prevLifeStoryCount.current = state.lifeStory.length;
    }, [state.lifeStory.length, isAuthenticated]);

    // Sync goals when they change
    useEffect(() => {
        if (isAuthenticated && Object.keys(state.goals).length > 0) {
            syncService.syncGoals(state.goals);
        }
    }, [state.goals, isAuthenticated]);

    // Track previous surveys count to detect new additions
    const prevSurveysCount = useRef(state.surveys.length);
    
    // Sync new surveys to backend
    useEffect(() => {
        if (state.surveys.length > prevSurveysCount.current && isAuthenticated) {
            const newSurvey = state.surveys[0]; // Most recent is first
            syncService.syncSurveyResult(newSurvey).then(success => {
                if (success) {
                    console.log('Survey synced to backend');
                }
            });
        }
        prevSurveysCount.current = state.surveys.length;
    }, [state.surveys.length, isAuthenticated]);

    // Track previous journals count to detect new additions
    const prevJournalsCount = useRef(state.journalHistory.length);
    
    // Sync new journal entries to backend
    useEffect(() => {
        if (state.journalHistory.length > prevJournalsCount.current && isAuthenticated) {
            const newJournal = state.journalHistory[0]; // Most recent is first
            syncService.syncJournalEntry(newJournal).then(success => {
                if (success) {
                    console.log('Journal entry synced to backend');
                }
            });
        }
        prevJournalsCount.current = state.journalHistory.length;
    }, [state.journalHistory.length, isAuthenticated]);

    const handleLogActivity = (activity: Activity) => {
        dispatch({ type: 'SET_VIEW', payload: { name: 'addMemory', activityInfo: activity, goal: undefined } });
    };

    const handleCompleteMemory = async (memory?: any) => {
        if (state.view.name !== 'addMemory') return;
        const activityInfo = state.view.activityInfo;
        
        if ('challengeId' in activityInfo) {
             dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } });
             return;
        }
        
        const activity = activityInfo as Activity;
        const payload = await processNewStep(dispatch, state, memory, t, language, activity);
        if (payload) {
            dispatch({ type: 'COMMIT_PROCESSED_STEP', payload });
        }
    };

    const handleCompleteQuiz = async (answer: string) => {
        const payload = await handleQuizAnswer(dispatch, state, answer, t, language);
        if (payload) {
            dispatch({ type: 'COMMIT_PROCESSED_STEP', payload });
        }
    };

    const handleChallengeActivityComplete = async (activity: ChallengeActivity, summary?: string) => {
        const payload = await processCompletedChallengeActivity(dispatch, state, activity, t, language, summary);
        if (payload) {
            dispatch({ type: 'COMMIT_CHALLENGE_LIFESTEP', payload });
            
            // Sync challenge activity completion to backend
            if (isAuthenticated && state.challenge?.dbId) {
                syncService.syncChallengeActivityComplete(
                    state.challenge.dbId,
                    activity.day,
                    {
                        type: activity.type,
                        summary,
                        completedAt: new Date().toISOString()
                    }
                ).then(success => {
                    if (success) {
                        console.log('Challenge activity synced to backend');
                    }
                });
            }
        }
    };

    const handleLogFromReminder = (reminder: Reminder) => {
    };
    
    const onSelectChallengeActivity = (activity: ChallengeActivity) => {
        if (activity.status === 'completed' && activity.type !== 'braintainment') return; 

        switch (activity.type) {
            case 'morningCheckin':
                if (activity.challengeId === 'beweegChallenge') dispatch({ type: 'SET_VIEW', payload: { name: 'morningCheckinMovement', activity } });
                else if (activity.challengeId === 'socialChallenge') dispatch({ type: 'SET_VIEW', payload: { name: 'morningCheckinSocial', activity } });
                else if (activity.challengeId === 'stressChallenge') dispatch({ type: 'SET_VIEW', payload: { name: 'morningCheckinStress', activity } });
                else dispatch({ type: 'SET_VIEW', payload: { name: 'morningCheckin', activity } });
                break;
            case 'eveningCheckin':
                if (activity.challengeId === 'beweegChallenge') dispatch({ type: 'SET_VIEW', payload: { name: 'eveningCheckinMovement', activity } });
                else if (activity.challengeId === 'socialChallenge') dispatch({ type: 'SET_VIEW', payload: { name: 'eveningCheckinSocial', activity } });
                else if (activity.challengeId === 'stressChallenge') dispatch({ type: 'SET_VIEW', payload: { name: 'eveningCheckinStress', activity } });
                else dispatch({ type: 'SET_VIEW', payload: { name: 'eveningCheckin', activity } });
                break;
            case 'braintainment':
                dispatch({ type: 'SET_VIEW', payload: { name: 'challengeBraintainment', activity } });
                break;
            case 'introduction':
                 if (activity.challengeId === 'beweegChallenge') dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroduction', activity } }); 
                 else if (activity.challengeId === 'voedingChallenge') dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroduction', activity } }); 
                 else if (activity.challengeId === 'stopRokenChallenge') dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroduction', activity } });
                 else if (activity.challengeId === 'socialChallenge') dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroduction', activity } });
                 else if (activity.challengeId === 'stressChallenge') dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroduction', activity } });
                 else dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroduction', activity } });
                 break;
            case 'breakfastCheckin':
            case 'lunchCheckin':
            case 'dinnerCheckin':
            case 'snackCheckin':
            case 'drinkCheckin':
                 dispatch({ type: 'SET_VIEW', payload: { name: 'challengeCheckinVoeding', activity } });
                 break;
            case 'dailyAssignment':
                 dispatch({ type: 'SET_VIEW', payload: { name: 'challengeAssignment', activity } });
                 break;
            case 'weighIn':
                 dispatch({ type: 'SET_VIEW', payload: { name: 'logMeasurement', measurementType: 'weight', measurements: state.measurements } });
                 break;
            default:
                console.warn("Unknown challenge activity type:", activity.type);
        }
    };
    
    const checkAndStartChallenge = async (challengeId: ChallengeId) => {
        if (state.challenge) {
            setPendingChallengeId(challengeId);
            setIsReplaceModalOpen(true);
        } else {
            await startChallengeWithApi(challengeId);
        }
    };
    
    const startChallengeWithApi = async (challengeId: ChallengeId) => {
        // If authenticated, save to backend
        if (isAuthenticated) {
            try {
                const result = await apiService.startChallenge(challengeId);
                if (result.success) {
                    console.log('Challenge started in backend:', result.data);
                }
            } catch (error) {
                console.error('Failed to save challenge to backend:', error);
            }
        }
        // Always dispatch to local state
        dispatch({ type: 'INITIATE_CHALLENGE', payload: challengeId });
    };

    const handleConfirmReplace = async () => {
        if (pendingChallengeId) {
            dispatch({ type: 'STOP_CHALLENGE' });
            await startChallengeWithApi(pendingChallengeId);
            setIsReplaceModalOpen(false);
            setPendingChallengeId(null);
        }
    };

    const handleStartFromPreview = (challengeId: ChallengeId) => {
        if (challengeId === 'sleepChallenge') {
            dispatch({ type: 'SET_VIEW', payload: { name: 'setGoal', goalKey: 'regularSleep', measurements: state.measurements, source: 'challengeIntro' } });
        } else if (challengeId === 'beweegChallenge') {
            dispatch({ type: 'SET_VIEW', payload: { name: 'setGoal', goalKey: 'movementChallenge', measurements: state.measurements, source: 'challengeIntro' } });
        } else {
            checkAndStartChallenge(challengeId);
        }
    };
    
    const handleSelectStep = (step: LifeStep) => {
        if (step.challengeActivityType === 'braintainment' && step.challengeActivityId) {
            const originalActivity = 
                state.challenge?.activities.find(a => a.id === step.challengeActivityId) || 
                state.challengeHistory.find(a => a.id === step.challengeActivityId);
            
            if (originalActivity) {
                dispatch({ type: 'SET_VIEW', payload: { name: 'challengeBraintainment', activity: originalActivity } });
                return;
            }
        }
        dispatch({ type: 'SET_VIEW', payload: { name: 'stepDetails', step } });
    };

    const renderView = () => {
        // Step 1: Show language selection first (before anything else)
        if (!languageSelected) {
            return <LanguageSelectScreen onContinue={handleLanguageSelected} />;
        }

        // Step 2: Show auth screens if language selected but not authenticated
        if (showAuth) {
            if (authScreen === 'register') {
                return (
                    <RegisterScreen
                        onSwitchToLogin={() => setAuthScreen('login')}
                        onRegister={register}
                        onSkip={handleSkipAuth}
                    />
                );
            }
            // Default to login screen
            return (
                <LoginScreen
                    onSwitchToRegister={() => setAuthScreen('register')}
                    onLogin={login}
                    onSkip={handleSkipAuth}
                />
            );
        }

        const currentLevel = Math.floor(state.points / POINTS_PER_LEVEL) + 1;
        const view = state.view;
        
        // Step 3: Main app views (authenticated or skipped auth)
        switch (view.name) {
            case 'languageSelect': 
                // Language already selected at this point, go to timeline or auth
                return null;
            case 'appIntro': return <AppIntroScreen onContinue={() => dispatch({ type: 'SET_VIEW', payload: { name: 'userInfoEntry' } })} />;
            case 'userInfoEntry': return <OnboardingUserInfoScreen onOnboardingComplete={async (userInfo, photo, weight, height) => {
                dispatch({ type: 'SET_LOADING', payload: 'loading.creatingAvatar' });
                const avatar = await generateAvatar(photo, userInfo); 
                dispatch({ type: 'COMPLETE_ONBOARDING', payload: { userInfo, avatar, weight, height } });
                dispatch({ type: 'SET_LOADING', payload: null });
            }} isGenerating={!!state.loadingMessageKey} />;
            case 'timeline': return <MainScreen {...state} avatar={state.currentAvatar} level={currentLevel} onLogActivity={() => dispatch({ type: 'SET_VIEW', payload: { name: 'activityLogger' } })} onLogMeasurement={() => dispatch({ type: 'SET_VIEW', payload: { name: 'selectMeasurement' } })} onFillSurvey={() => dispatch({ type: 'SET_VIEW', payload: { name: 'selectSurvey' } })} onLogSmoke={() => dispatch({ type: 'SET_VIEW', payload: { name: 'logCigarette' } })} onShowAvatarDetails={() => dispatch({ type: 'SET_VIEW', payload: { name: 'settings' } })} onOpenChatbot={() => dispatch({ type: 'SET_VIEW', payload: { name: 'chatbot' } })} onLogJournal={() => state.activeJournal ? dispatch({ type: 'SET_VIEW', payload: { name: 'logJournal', journalId: state.activeJournal } }) : null} onSelectStep={handleSelectStep} onSelectChallengeActivity={onSelectChallengeActivity} onSelectSurvey={(result) => dispatch({ type: 'SET_VIEW', payload: { name: 'surveyResult', result } })} onLogFromReminder={(r) => handleLogFromReminder(r)} onStartSleepChallenge={() => dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroPreview', challengeId: 'sleepChallenge' } })} onLogSnack={() => {}} onLogDrink={() => {}} />;
            case 'plan': return <PlanScreen goals={state.goals} challenge={state.challenge} activeJournal={state.activeJournal} measurements={state.measurements} onNavigate={(view) => dispatch({ type: 'SET_VIEW', payload: view })} onRemoveGoal={(key) => dispatch({ type: 'REMOVE_GOAL', payload: key })} onStartSleepChallenge={() => dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroPreview', challengeId: 'sleepChallenge' } })} onStartMovementChallenge={() => dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroPreview', challengeId: 'beweegChallenge' } })} onStartVoedingChallenge={() => dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroPreview', challengeId: 'voedingChallenge' } })} onStartStopRokenChallenge={() => dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroPreview', challengeId: 'stopRokenChallenge' } })} onStartSocialChallenge={() => dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroPreview', challengeId: 'socialChallenge' } })} onStartStressChallenge={() => dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroPreview', challengeId: 'stressChallenge' } })} onStopChallenge={() => dispatch({ type: 'STOP_CHALLENGE' })} onStartJournal={(id) => dispatch({ type: 'START_JOURNAL', payload: id })} onStopJournal={() => dispatch({ type: 'STOP_JOURNAL' })} />;
            case 'agenda': return <AgendaScreen dispatch={dispatch} goals={state.goals} reminders={state.reminders} challenge={state.challenge} lifeStory={state.lifeStory} challengeHistory={state.challengeHistory} onSelectChallengeActivity={onSelectChallengeActivity} onLogFromReminder={(r) => handleLogFromReminder(r)} />;
            case 'stats': return <StatsScreen goals={state.goals} challenge={state.challenge} challengeHistory={state.challengeHistory} measurements={state.measurements} surveys={state.surveys} />;
            case 'settings': return <AvatarDetailScreen avatar={state.currentAvatar} userInfo={state.userInfo} level={currentLevel} points={state.points} activityPoints={state.activityPoints} allHabitsUnlocked={state.allHabitsUnlocked} onUpdateUserInfo={(u) => dispatch({ type: 'UPDATE_USER_INFO', payload: u })} onToggleAllHabits={(v) => dispatch({ type: 'TOGGLE_ALL_HABITS', payload: v })} onResetApp={() => { localStorage.clear(); window.location.reload(); }} />;
            case 'activityLogger': return <ActivityLogger level={currentLevel} allHabitsUnlocked={state.allHabitsUnlocked} onSelectActivity={handleLogActivity} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'addMemory': return <AddMemoryScreen avatar={state.currentAvatar} activityInfo={view.activityInfo} goal={view.goal} onComplete={handleCompleteMemory} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'stepDetails': return <LifeStepDetailScreen step={view.step} goals={state.goals} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'quiz': return <QuizScreen quiz={view.data} onAnswer={handleCompleteQuiz} avatar={state.currentAvatar} />;
            case 'morningCheckin': return <MorningCheckinScreen activity={view.activity} onComplete={(a) => handleChallengeActivityComplete(a)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'eveningCheckin': return <EveningCheckinScreen activity={view.activity} onComplete={(a) => handleChallengeActivityComplete(a)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'challengeBraintainment': return <ChallengeBraintainmentScreen activity={view.activity} onComplete={(a, s) => handleChallengeActivityComplete(a, s)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'challengeIntroduction': 
                if (view.activity.challengeId === 'beweegChallenge') return <ChallengeIntroductionScreenMovement activity={view.activity} onStart={() => handleChallengeActivityComplete(view.activity as any)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
                if (view.activity.challengeId === 'voedingChallenge') return <ChallengeIntroductionScreenVoeding activity={view.activity} onStart={() => handleChallengeActivityComplete(view.activity as any)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
                if (view.activity.challengeId === 'stopRokenChallenge') return <ChallengeIntroductionScreenStopRoken activity={view.activity} onStart={() => handleChallengeActivityComplete(view.activity as any)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
                if (view.activity.challengeId === 'socialChallenge') return <ChallengeIntroductionScreenSocial activity={view.activity} onStart={() => handleChallengeActivityComplete(view.activity as any)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
                if (view.activity.challengeId === 'stressChallenge') return <ChallengeIntroductionScreenStress activity={view.activity} onStart={() => handleChallengeActivityComplete(view.activity as any)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
                return <ChallengeIntroductionScreen activity={view.activity} onStart={() => handleChallengeActivityComplete(view.activity as any)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'challengeIntroPreview':
                 const mockActivity: ChallengeActivity = {
                     id: 'preview',
                     challengeId: view.challengeId,
                     day: 0,
                     type: 'introduction',
                     scheduledAt: new Date(),
                     status: 'pending'
                 };
                 if (view.challengeId === 'beweegChallenge') return <ChallengeIntroductionScreenMovement activity={mockActivity} onStart={() => handleStartFromPreview(view.challengeId)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'plan' } })} />;
                 if (view.challengeId === 'voedingChallenge') return <ChallengeIntroductionScreenVoeding activity={mockActivity} onStart={() => handleStartFromPreview(view.challengeId)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'plan' } })} />;
                 if (view.challengeId === 'stopRokenChallenge') return <ChallengeIntroductionScreenStopRoken activity={mockActivity} onStart={() => handleStartFromPreview(view.challengeId)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'plan' } })} />;
                 if (view.challengeId === 'socialChallenge') return <ChallengeIntroductionScreenSocial activity={mockActivity} onStart={() => handleStartFromPreview(view.challengeId)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'plan' } })} />;
                 if (view.challengeId === 'stressChallenge') return <ChallengeIntroductionScreenStress activity={mockActivity} onStart={() => handleStartFromPreview(view.challengeId)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'plan' } })} />;
                 return <ChallengeIntroductionScreen activity={mockActivity} onStart={() => handleStartFromPreview(view.challengeId)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'plan' } })} />;
            case 'selectMeasurement': return <SelectMeasurementScreen onSelect={(type) => dispatch({ type: 'SET_VIEW', payload: { name: 'logMeasurement', measurementType: type, measurements: state.measurements } })} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'logMeasurement': return <LogMeasurementScreen measurementType={view.measurementType} measurements={view.measurements} onSave={async (m, t, mem) => { 
                    let finalMemory = mem;
                    if (mem?.photoUrl && mem.photoUrl.startsWith('data:')) {
                        const photoKey = `measure-${m.type}-${Date.now()}`;
                        try {
                            await setAsset(photoKey, mem.photoUrl);
                            finalMemory = { ...mem, photoUrl: photoKey };
                        } catch (e) {
                            console.error("Failed to save photo to DB, using raw data URL fallback", e);
                            finalMemory = mem; 
                        }
                    }
                    dispatch({ type: 'ADD_MEASUREMENT', payload: { id: `m-${Date.now()}`, timestamp: t, memory: finalMemory, ...m } as any }); 
                }} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'selectSurvey': return <SelectSurveyScreen onSelect={(s) => dispatch({ type: 'SET_VIEW', payload: { name: 'fillSurvey', survey: s } })} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'fillSurvey': return <FillSurveyScreen survey={view.survey} onComplete={(r) => dispatch({ type: 'ADD_SURVEY_RESULT', payload: r })} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'surveyResult': return <SurveyResultScreen result={view.result} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'morningCheckinMovement': return <MorningCheckinScreenMovement activity={view.activity} onComplete={(a) => handleChallengeActivityComplete(a)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'eveningCheckinMovement': return <EveningCheckinScreenMovement activity={view.activity} goal={state.goals.movementChallenge} onComplete={(a) => handleChallengeActivityComplete(a)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'setGoal': 
                const onSaveGoal = (key: keyof Goals, data: any) => {
                     dispatch({ type: 'UPDATE_GOAL', payload: { goalKey: key, goalData: data } });
                     if (view.source === 'challengeIntro') {
                         const relatedChallengeId = key === 'regularSleep' ? 'sleepChallenge' : (key === 'movementChallenge' ? 'beweegChallenge' : null);
                         if (relatedChallengeId) {
                             checkAndStartChallenge(relatedChallengeId);
                         }
                     }
                };
                return view.goalKey === 'movementChallenge' ? 
                <SetMovementGoalScreen 
                    goal={state.goals.movementChallenge} 
                    onGoalSet={(g) => onSaveGoal('movementChallenge', g)} 
                    onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'plan' } })} 
                /> : 
                <SetGoalScreen 
                    goalKey={view.goalKey} 
                    goals={state.goals} 
                    measurements={state.measurements} 
                    onSave={onSaveGoal} 
                    onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'plan' } })} 
                    onStartChallenge={(id) => checkAndStartChallenge(id)} 
                />;
            case 'challengeCheckinVoeding': return <ChallengeCheckinScreenVoeding activity={view.activity} onComplete={(url) => { const act = { ...view.activity, status: 'completed', completedAt: new Date(), memory: url ? { photoUrl: url, isPrivate: false } : undefined }; handleChallengeActivityComplete(act as any); }} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'challengeAssignment': return <ChallengeAssignmentScreen activity={view.activity} onComplete={(a) => handleChallengeActivityComplete(a)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'logCigarette': return <LogCigaretteScreen onComplete={async (url) => { 
                const photoKey = `cig-${Date.now()}`;
                let finalUrl = url;
                try {
                    await setAsset(photoKey, url);
                    finalUrl = photoKey;
                } catch (e) {
                    console.error("Failed to save cigarette photo to DB", e);
                    finalUrl = url;
                }
                dispatch({ type: 'ADD_MEASUREMENT', payload: { id: `cig-${Date.now()}`, type: 'smoke', value: 1, timestamp: new Date(), memory: { photoUrl: finalUrl, isPrivate: false } } as any }); 
                dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } }); 
            }} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'morningCheckinSocial': return <MorningCheckinScreenSocial activity={view.activity} onComplete={(a) => handleChallengeActivityComplete(a)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'eveningCheckinSocial': return <EveningCheckinScreenSocial activity={view.activity} onComplete={(a) => handleChallengeActivityComplete(a)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'morningCheckinStress': return <MorningCheckinScreenStress activity={view.activity} onComplete={(a) => handleChallengeActivityComplete(a)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'eveningCheckinStress': return <EveningCheckinScreenStress activity={view.activity} onComplete={(a) => handleChallengeActivityComplete(a)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'chatbot': return <ChatbotScreen appState={state} dispatch={dispatch} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'weightProgress': return <WeightProgressScreen newMeasurement={view.newMeasurement} goal={view.goal} userInfo={state.userInfo} onStartChallenge={(id) => checkAndStartChallenge(id)} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            case 'logJournal': return <LogJournalScreen journalId={view.journalId} onSave={(entry) => dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: entry })} onClose={() => dispatch({ type: 'SET_VIEW', payload: { name: 'timeline' } })} />;
            default: return <MainScreen {...state} avatar={state.currentAvatar} level={currentLevel} onLogActivity={() => dispatch({ type: 'SET_VIEW', payload: { name: 'activityLogger' } })} onLogMeasurement={() => dispatch({ type: 'SET_VIEW', payload: { name: 'selectMeasurement' } })} onFillSurvey={() => dispatch({ type: 'SET_VIEW', payload: { name: 'selectSurvey' } })} onLogSmoke={() => dispatch({ type: 'SET_VIEW', payload: { name: 'logCigarette' } })} onShowAvatarDetails={() => dispatch({ type: 'SET_VIEW', payload: { name: 'settings' } })} onOpenChatbot={() => dispatch({ type: 'SET_VIEW', payload: { name: 'chatbot' } })} onLogJournal={() => state.activeJournal ? dispatch({ type: 'SET_VIEW', payload: { name: 'logJournal', journalId: state.activeJournal } }) : null} onSelectStep={handleSelectStep} onSelectChallengeActivity={onSelectChallengeActivity} onSelectSurvey={(result) => dispatch({ type: 'SET_VIEW', payload: { name: 'surveyResult', result } })} onLogFromReminder={(r) => handleLogFromReminder(r)} onStartSleepChallenge={() => dispatch({ type: 'SET_VIEW', payload: { name: 'challengeIntroPreview', challengeId: 'sleepChallenge' } })} onLogSnack={() => {}} onLogDrink={() => {}} />;
        }
    };

    const showBottomNav = ['timeline', 'plan', 'agenda', 'stats', 'settings'].includes(state.view.name);

    return (
        <div className={`app-container ${showBottomNav ? 'pb-20' : ''}`}>
            {state.showConfetti && <Confetti />}
            {state.loadingMessageKey && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex flex-col items-center justify-center text-white">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
                    <p className="text-lg font-semibold animate-pulse">{t(state.loadingMessageKey)}</p>
                </div>
            )}
            {renderView()}

            {isReplaceModalOpen && pendingChallengeId && state.challenge && (
                 <ConfirmationModal
                    isOpen={isReplaceModalOpen}
                    onClose={() => { setIsReplaceModalOpen(false); setPendingChallengeId(null); }}
                    onConfirm={handleConfirmReplace}
                    title={t('planScreen.switchChallengeConfirmationTitle')}
                    message={t('planScreen.switchChallengeConfirmationMessage', { 
                        newChallengeName: t(`challenge.${pendingChallengeId}.name`), 
                        currentChallengeName: t(`challenge.${state.challenge.id}.name`) 
                    })}
                    confirmText={t('planScreen.confirm')}
                    cancelText={t('planScreen.cancel')}
                />
            )}

             {showBottomNav && (
                <BottomNavBar 
                    activeView={state.view.name as any} 
                    onNavigate={(viewName) => dispatch({ type: 'SET_VIEW', payload: { name: viewName } })} 
                />
            )}
        </div>
    );
}

const App = () => {
    return (
        <ErrorBoundary>
            <LanguageProvider>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </LanguageProvider>
        </ErrorBoundary>
    );
}

export default App;
