
import React, { FC, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Survey, SurveyResult, FourDKLDimension, SurveyInterpretationLevel, SurveyAnswerOption } from '../../types';
import { XIcon } from '../Icons';

interface FillSurveyScreenProps {
    survey: Survey;
    onComplete: (result: SurveyResult) => void;
    onClose: () => void;
}

const FillSurveyScreen: FC<FillSurveyScreenProps> = ({ survey, onComplete, onClose }) => {
    const { t } = useLanguage();
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const handleAnswer = (questionId: string, textKey: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: textKey }));
    };

    const isComplete = Object.keys(answers).length === survey.questions.length;

    const handleSubmit = () => {
        if (!isComplete) return;

        const allAnswerOptions = Object.values(survey.answerOptions).flat();
        // FIX: Explicitly type the `opt` parameter in the `map` function callback as `SurveyAnswerOption` to resolve a TypeScript error where its type was being inferred as `unknown`.
        const answerKeyToValueMap = Object.fromEntries(allAnswerOptions.map((opt: SurveyAnswerOption) => [opt.textKey, opt.value]));

        // Calculate raw scores
        const scores: Record<string, number> = {};

        (Object.keys(survey.scoringMap) as string[]).forEach(dim => {
            scores[dim] = 0;
            survey.scoringMap[dim].forEach(questionId => {
                const answerKey = answers[questionId];
                if (answerKey) {
                    scores[dim] += answerKeyToValueMap[answerKey] ?? 0;
                }
            });
        });
        
        // Apply custom score converter if it exists (for PAM-13 etc.)
        let finalScores = scores;
        if (survey.scoreConverter) {
            finalScores = survey.scoreConverter(scores);
        }

        const getInterpretationLevel = (dim: string, score: number): SurveyInterpretationLevel => {
            const thresholds = survey.interpretationThresholds[dim];
            if (thresholds) {
                if (score >= thresholds.high) return 'high';
                if (score >= thresholds.moderate) return 'moderate';
            }
            return 'low';
        };
        
        const interpretation = (Object.keys(finalScores) as string[]).reduce((acc, dim) => {
            // Only assign interpretation if thresholds exist for this dimension.
            // This filters out helper scores (like individual question scores in ZLM) from appearing in the interpretation list.
            if (survey.interpretationThresholds[dim]) {
                acc[dim] = getInterpretationLevel(dim, finalScores[dim]);
            }
            return acc;
        }, {} as Record<string, SurveyInterpretationLevel>);


        const result: SurveyResult = {
            id: `${survey.id}-${Date.now()}`,
            surveyId: survey.id,
            timestamp: new Date(),
            answers,
            scores: finalScores,
            interpretation,
        };

        onComplete(result);
    };

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 animate-fade-in">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <header className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-brand-dark">{t(survey.nameKey)}</h3>
                        <p className="text-sm text-gray-500">{t('surveys.instructions')}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                </header>
                
                <div className="space-y-6">
                    {survey.questions.map((q, index) => {
                        const answerOptions = survey.answerOptions[q.answerOptionsKey] || [];
                        return (
                            <div key={q.id} className="p-4 bg-gray-50 rounded-lg border">
                                <p className="font-semibold text-gray-800 mb-3">{index + 1}. {t(q.textKey)}</p>
                                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-2">
                                    {answerOptions.map(opt => (
                                        <button
                                            key={opt.textKey}
                                            onClick={() => handleAnswer(q.id, opt.textKey)}
                                            className={`px-3 py-1.5 text-sm rounded-md border-2 transition-colors ${answers[q.id] === opt.textKey ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                        >
                                            {t(opt.textKey)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8">
                    <button 
                        onClick={handleSubmit} 
                        disabled={!isComplete}
                        className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {t('surveys.viewResults')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FillSurveyScreen;
