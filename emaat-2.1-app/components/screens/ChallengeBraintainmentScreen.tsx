
import React, { FC, useMemo, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChallengeActivity } from '../../types';
import { sleepChallengeContent } from '../../challenges/sleepChallenge/content';
import { beweegChallengeContent } from '../../challenges/beweegChallenge/content';
import { voedingChallengeContent } from '../../challenges/voedingChallenge/content';
import { stopRokenChallengeContent } from '../../challenges/stopRokenChallenge/content';
import { socialChallengeContent } from '../../challenges/socialChallenge/content';
import { stressChallengeContent } from '../../challenges/stressChallenge/content';
import { 
    XIcon, BrainCircuitIcon, StarIcon
} from '../Icons';
import { sleepChallengeIconMap } from '../../challenges/sleepChallenge/icons';
import { beweegChallengeIconMap } from '../../challenges/beweegChallenge/icons';
import { voedingChallengeIconMap } from '../../challenges/voedingChallenge/icons';
import { stopRokenChallengeIconMap } from '../../challenges/stopRokenChallenge/icons';
import { socialChallengeIconMap } from '../../challenges/socialChallenge/icons';
import { stressChallengeIconMap } from '../../challenges/stressChallenge/icons';

interface ChallengeBraintainmentScreenProps {
    activity: ChallengeActivity;
    onComplete: (activity: ChallengeActivity, summary?: string) => void;
    onClose: () => void;
}

const getIconPersonality = (iconName: string) => {
    // Energy & Fire
    if (['EnergyIcon', 'FireIcon', 'SunIcon', 'InternalExternalMotivationIcon'].includes(iconName)) {
        return { bg: 'bg-orange-100', text: 'text-orange-500', anim: 'animate-pulse' };
    }
    // Heart & Health
    if (['HeartIcon', 'HealthIcon', 'MoodIcon', 'BloodPressureIcon', 'HeartDiseaseIcon', 'HeartVesselsIcon', 'SexualityFertilityIcon'].includes(iconName)) {
        return { bg: 'bg-rose-100', text: 'text-rose-500', anim: 'animate-heartbeat' };
    }
    // Brain & Focus
    if (['FocusIcon', 'DecisionIcon', 'MemoryIcon', 'BrainIcon', 'BrainActivityIcon', 'ClearMindIcon', 'LearningIcon', 'AttentionIcon', 'MentalHealthIcon'].includes(iconName)) {
        return { bg: 'bg-violet-100', text: 'text-violet-600', anim: 'animate-float' };
    }
    // Nature & Stress
    if (['StressIcon', 'LeafIcon', 'RelaxIcon', 'FlexibilityIcon', 'SmellIcon', 'OutdoorActivitiesIcon', 'NatureIcon'].includes(iconName)) {
        return { bg: 'bg-teal-100', text: 'text-teal-600', anim: 'animate-sway' };
    }
    // Sleep & Bed
    if (['BedIcon', 'SleepIcon', 'SleepMaskIcon', 'RestIcon', 'InsomniaIcon', 'NarcolepsyIcon', 'SleepwalkingIcon'].includes(iconName)) {
        return { bg: 'bg-indigo-100', text: 'text-indigo-500', anim: 'animate-pulse' }; // Pulse is subtle
    }
    // Time & Routine
    if (['RoutineIcon', 'ClockIcon', 'TimeIcon', 'AgingIcon', 'ScheduleIcon', 'PauseIcon'].includes(iconName)) {
        return { bg: 'bg-blue-100', text: 'text-blue-600', anim: 'animate-spin-slow' };
    }
    // Exercise & Action
    if (['ExerciseIcon', 'DumbbellIcon', 'WalkIcon', 'RunIcon', 'CardioIcon', 'StrengthIcon', 'ConditionIcon', 'MovementIcon', 'StepsIcon'].includes(iconName)) {
        return { bg: 'bg-sky-100', text: 'text-sky-600', anim: 'animate-bounce' };
    }
    // Food & Nutrition
    if (['UtensilsIcon', 'NutritionIcon', 'FoodIcon', 'DigestionIcon', 'HealthyEatingIcon', 'StomachIntestinesIcon'].includes(iconName)) {
        return { bg: 'bg-lime-100', text: 'text-lime-600', anim: 'animate-wiggle' };
    }
    // Social
    if (['GroupIcon', 'FamilyWalkIcon', 'SocialIcon', 'RelationshipsIcon', 'HelloIcon', 'ConnectIcon'].includes(iconName)) {
        return { bg: 'bg-pink-100', text: 'text-pink-500', anim: 'animate-pulse' };
    }
    // Bad stuff / Warnings
    if (['NoPhoneIcon', 'NoCoffeeIcon', 'XCircleIcon', 'DisruptiveIcon', 'VirusIcon', 'CancerIcon', 'SkullIcon', 'CakesIcon', 'AlcoholIcon', 'TobaccoIndustryIcon', 'RelapseIcon'].includes(iconName)) {
        return { bg: 'bg-gray-200', text: 'text-gray-600', anim: '' };
    }
    
    // Default fallback
    return { bg: 'bg-indigo-50', text: 'text-indigo-400', anim: '' };
};

const ChallengeBraintainmentScreen: FC<ChallengeBraintainmentScreenProps> = ({ activity, onComplete, onClose }) => {
    const { t, language } = useLanguage();

    const [view, setView] = useState<'content' | 'quiz' | 'result'>('content');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    
    const isCompleted = activity.status === 'completed';

    const { content, iconMap } = useMemo(() => {
        switch (activity.challengeId) {
            case 'beweegChallenge': {
                const dayContent = beweegChallengeContent[activity.day as keyof typeof beweegChallengeContent];
                return { content: dayContent ? dayContent[language] : null, iconMap: beweegChallengeIconMap };
            }
            case 'voedingChallenge': {
                const dayContent = voedingChallengeContent[activity.day as keyof typeof voedingChallengeContent];
                return { content: dayContent ? dayContent[language] : null, iconMap: voedingChallengeIconMap };
            }
            case 'stopRokenChallenge': {
                const dayContent = stopRokenChallengeContent[activity.day as keyof typeof stopRokenChallengeContent];
                return { content: dayContent ? dayContent[language] : null, iconMap: stopRokenChallengeIconMap };
            }
            case 'socialChallenge': {
                const dayContent = socialChallengeContent[activity.day as keyof typeof socialChallengeContent];
                return { content: dayContent ? dayContent[language] : null, iconMap: socialChallengeIconMap };
            }
            case 'stressChallenge': {
                const dayContent = stressChallengeContent[activity.day as keyof typeof stressChallengeContent];
                return { content: dayContent ? dayContent[language] : null, iconMap: stressChallengeIconMap };
            }
            case 'sleepChallenge':
            default: {
                const dayContent = sleepChallengeContent[activity.day as keyof typeof sleepChallengeContent];
                return { content: dayContent ? dayContent[language] : null, iconMap: sleepChallengeIconMap };
            }
        }
    }, [activity.challengeId, activity.day, language]);


    if (!content) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
                <p>{t('challenge.braintainment.contentNotFound')}</p>
                <button onClick={onClose}>{t('common.closeButton')}</button>
            </div>
        );
    }

    const quizQuestions = content.quiz;
    const currentQuestion = quizQuestions?.[currentQuestionIndex];

    const handleAnswer = (answer: string) => {
        if (showFeedback || !currentQuestion) return;
        setSelectedAnswer(answer);
        setShowFeedback(true);
        if (answer === currentQuestion.correct) {
            setScore(s => s + 1);
        }

        setTimeout(() => {
            setShowFeedback(false);
            setSelectedAnswer(null);
            if (quizQuestions && currentQuestionIndex < quizQuestions.length - 1) {
                setCurrentQuestionIndex(i => i + 1);
            } else {
                setView('result');
            }
        }, 1500);
    };

    const handleSubmit = () => {
        const updatedActivity: ChallengeActivity = {
            ...activity,
            status: 'completed',
            completedAt: new Date(),
            data: { quizScore: score },
        };
        onComplete(updatedActivity, content.summary);
    };
    
    const getButtonClass = (optionText: string) => {
        if (showFeedback && currentQuestion) {
            if (optionText === currentQuestion.correct) return 'bg-emerald-500 text-white border-emerald-500 scale-105';
            if (optionText === selectedAnswer) return 'bg-rose-500 text-white border-rose-500';
            return 'bg-gray-200 text-gray-500 border-gray-200 opacity-70';
        }
        return 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300';
    };

    const renderContent = () => (
        <>
             <div className="italic text-center text-gray-600 bg-gray-50 p-3 rounded-lg mb-6">
                "{content.saying}"
            </div>
            <p className="text-gray-700 mb-6">{content.summary}</p>
            <div className="space-y-4 mb-6">
                {content.sections.map((section, index) => {
                    // Defensive coding: Ensure we always have a valid icon component.
                    // Try to find the icon in the map. If not found or map is missing, fallback.
                    let IconComponent = iconMap && iconMap[section.icon];
                    if (!IconComponent) {
                        IconComponent = StarIcon;
                    }
                    const SafeIcon = IconComponent;

                    const personality = getIconPersonality(section.icon);
                    return (
                        <div 
                            key={index} 
                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-500"
                            style={{ 
                                opacity: 0, 
                                animation: `fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards ${index * 0.15}s` 
                            }}
                        >
                            <div className={`flex-shrink-0 mt-1 p-2 rounded-full shadow-sm ${personality.bg} ${personality.text}`}>
                                <SafeIcon 
                                    className={`w-6 h-6 ${personality.anim}`} 
                                />
                            </div>
                            <div>
                                <h4 className="font-semibold text-brand-dark">{section.title}</h4>
                                <p className="text-gray-600 text-sm">{section.content}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            {content.readMore && (
                <div className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg animate-fade-in" style={{ animationDelay: '1s' }}>
                    <p className="text-sm text-indigo-800">{content.readMore}</p>
                </div>
            )}
             <div className="mt-8">
                {isCompleted ? (
                    <button onClick={onClose} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                        {t('common.closeButton')}
                    </button>
                ) : (
                    quizQuestions && quizQuestions.length > 0 ? (
                        <button onClick={() => setView('quiz')} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                            {t('challenge.braintainment.startQuiz')}
                        </button>
                    ) : (
                        <button onClick={handleSubmit} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                            {t('common.done')}
                        </button>
                    )
                )}
            </div>
        </>
    );

    const renderQuiz = () => (
        currentQuestion ? (
         <div className="animate-fade-in">
            <h4 className="font-semibold text-lg text-brand-dark mb-4 text-center">{currentQuestion.question}</h4>
            <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                    <button key={index} disabled={showFeedback} onClick={() => handleAnswer(option.text)} className={`w-full flex items-center justify-between p-4 rounded-lg font-semibold transition-all duration-300 disabled:cursor-not-allowed ${getButtonClass(option.text)}`}>
                        <span className="text-left pr-4">{option.text}</span>
                        <span className="text-2xl">{option.emoji}</span>
                    </button>
                ))}
            </div>
        </div>
        ) : null
    );

    const renderResult = () => (
        quizQuestions && quizQuestions.length > 0 ? (
            <div className="text-center animate-fade-in">
                <h3 className="text-2xl font-bold text-brand-dark">{t('challenge.braintainment.quizCompleteTitle')}</h3>
                <p className="text-gray-600 mt-2">{t('challenge.braintainment.quizCompleteSubtitle')}</p>
                <p className="text-5xl font-bold text-brand-primary my-4">{score} / {quizQuestions.length}</p>
                <p className="text-gray-600">{t('challenge.braintainment.quizCompleteCorrectly')}</p>
                <p className="font-bold text-lg text-brand-secondary mt-2">+ {score * 5} {t('common.pointsAbbreviation')}</p>
                <div className="mt-8">
                    <button onClick={handleSubmit} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                        {t('common.done')}
                    </button>
                </div>
            </div>
        ) : null
    );

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex justify-center items-center animate-fade-in">
            <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl p-6">
                <header className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm font-bold text-brand-primary">{t('challenge.braintainment.day', { day: activity.day })}</p>
                        <h2 className="text-2xl font-bold text-brand-dark">{content.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                </header>

                {view === 'content' && renderContent()}
                {view === 'quiz' && renderQuiz()}
                {view === 'result' && renderResult()}
            </div>
        </div>
    );
};

export default ChallengeBraintainmentScreen;
