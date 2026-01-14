
import React, { FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SurveyResult, SurveyInterpretationLevel } from '../../types';
import { SURVEYS } from '../../surveys';
import { XIcon } from '../Icons';
import ZlmBalloonVisual from '../ZlmBalloonVisual';

interface SurveyResultScreenProps {
    result: SurveyResult;
    onClose: () => void;
}

const levelColors: Record<SurveyInterpretationLevel, { bg: string; border: string; text: string }> = {
    low: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800' },
    moderate: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' },
    high: { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-800' },
};

const SurveyResultScreen: FC<SurveyResultScreenProps> = ({ result, onClose }) => {
    const { t } = useLanguage();
    const survey = SURVEYS.find(s => s.id === result.surveyId);

    if (!survey) return null;

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 animate-fade-in">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <header className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-brand-dark">{t(survey.nameKey)} - Results</h3>
                        <p className="text-sm text-gray-500">{new Date(result.timestamp).toLocaleString()}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                </header>

                {/* Special Visual for ZLM */}
                {result.surveyId === 'zlm' && (
                    <div className="mb-6">
                        <ZlmBalloonVisual result={result} />
                        <p className="text-xs text-center text-gray-500 mt-2 italic">
                            Green = Good, Yellow = Caution, Red = Attention needed.
                        </p>
                    </div>
                )}

                <div className="space-y-4 mb-6">
                    {(Object.keys(result.scores)).map(dim => {
                        // Skip individual balloon metrics for the text summary list to keep it clean, if desired.
                        // For now, show all that have interpretations.
                        const score = result.scores[dim];
                        const level = result.interpretation[dim];
                        
                        // Only show dimensions that have a defined level/interpretation
                        if (!level) return null;

                        const colors = levelColors[level];
                        const dimensionName = t(`surveys.${survey.id}.dimensions.${dim}`);
                        const interpretationText = t(`surveys.${survey.id}.interpretations.${dim}.${level}`);
                        const adviceText = t(`surveys.${survey.id}.advice.${dim}.${level}`);

                        return (
                            <div key={dim} className={`p-4 rounded-lg border-l-4 ${colors.bg} ${colors.border}`}>
                                <div className="flex justify-between items-center">
                                    <h4 className={`font-bold text-lg ${colors.text}`}>{dimensionName}</h4>
                                    <span className={`font-bold text-xl ${colors.text}`}>{typeof score === 'number' ? score.toFixed(1) : score}</span>
                                </div>
                                <p className={`text-sm mt-1 ${colors.text}`}>{interpretationText}</p>
                                {adviceText && adviceText !== `surveys.${survey.id}.advice.${dim}.${level}` && (
                                     <p className={`text-sm mt-2 pt-2 border-t ${colors.border} ${colors.text}`}>{adviceText}</p>
                                )}
                            </div>
                        );
                    })}
                </div>

                <details>
                    <summary className="cursor-pointer text-sm font-semibold text-indigo-600 hover:underline">
                        {t('surveys.showAnswers')}
                    </summary>
                    <div className="mt-4 pt-4 border-t space-y-3">
                        {survey.questions.map((q, index) => (
                            <div key={q.id} className="text-sm">
                                <p className="font-medium text-gray-700">{index + 1}. {t(q.textKey)}</p>
                                <p className="text-brand-primary font-semibold pl-4">- {t(result.answers[q.id])}</p>
                            </div>
                        ))}
                    </div>
                </details>

                 <div className="mt-8">
                    <button onClick={onClose} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700">
                        {t('common.done')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SurveyResultScreen;
