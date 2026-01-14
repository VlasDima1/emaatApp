import React, { FC, useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Quiz, LifeStep, Activity, Memory, QuizOption } from '../../types';

interface QuizScreenProps {
    quiz: { quizData: Quiz; step: LifeStep; selectedActivity: Activity, memory?: Memory };
    onAnswer: (selectedOption: string) => void;
    avatar: string | null;
}

const QuizScreen: FC<QuizScreenProps> = ({ quiz, onAnswer, avatar }) => {
    const { t } = useLanguage();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [shuffledOptions, setShuffledOptions] = useState<QuizOption[]>([]);

    useEffect(() => {
        // This ensures options are shuffled every time the quizData prop changes
        setShuffledOptions([...quiz.quizData.options].sort(() => Math.random() - 0.5));
    }, [quiz.quizData]);

    const handleAnswer = (option: QuizOption) => {
        if (selectedOption) return;
        setSelectedOption(option.text);
        setTimeout(() => {
            onAnswer(option.text);
        }, 1500);
    };

    const getButtonClass = (option: QuizOption) => {
        if (selectedOption) {
            if (option.text === quiz.quizData.correctOption) return 'bg-emerald-500 text-white border-emerald-500 scale-105';
            if (option.text === selectedOption) return 'bg-rose-500 text-white border-rose-500';
            return 'bg-gray-200 text-gray-500 border-gray-200 opacity-70';
        }
        return 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300';
    };

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex flex-col justify-center items-center animate-fade-in">
            <div className="w-full max-w-md">
                <div className="text-center text-brand-dark mb-6">
                    {avatar && (<img src={avatar} alt="eMaat" className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg mx-auto mb-3" />)}
                    <h3 className="text-3xl font-bold">{t('quizScreen.title')}</h3>
                    <p className="opacity-90 mt-1">{t('quizScreen.intro')}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                    <div className="bg-gray-50 p-3 rounded-lg text-center mb-6"><p className="font-semibold text-brand-dark italic">"{quiz.step.nudge}"</p></div>
                    <h4 className="font-semibold text-lg text-brand-dark mb-4 text-center">{quiz.quizData.question}</h4>
                    <div className="space-y-3">
                        {shuffledOptions.map((option, index) => (
                            <button key={index} disabled={!!selectedOption} onClick={() => handleAnswer(option)} className={`w-full flex items-center justify-between p-4 rounded-lg font-semibold transition-all duration-300 disabled:cursor-not-allowed ${getButtonClass(option)}`}>
                                <span className="text-left pr-4">{option.text}</span><span className="text-2xl">{option.emoji}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizScreen;