
import React from 'react';
import { QuestionnaireResult, QuestionnaireType } from '../types';
import { ArrowLeftIcon, ClipboardDocumentListIcon, ShieldCheckIcon } from './icons';

interface QuestionnaireDetailProps {
  questionnaire: QuestionnaireResult;
  participantName: string;
  onBack: () => void;
}

// Helper to determine GAD-7 severity color and label (Translated to Dutch)
const getGad7Severity = (score: number) => {
    if (score <= 4) return { label: 'Minimale angst', color: 'text-green-600', bg: 'bg-green-100', borderColor: 'border-green-200' };
    if (score <= 9) return { label: 'Lichte angst', color: 'text-blue-600', bg: 'bg-blue-100', borderColor: 'border-blue-200' };
    if (score <= 14) return { label: 'Matige angst', color: 'text-orange-600', bg: 'bg-orange-100', borderColor: 'border-orange-200' };
    return { label: 'Ernstige angst', color: 'text-red-600', bg: 'bg-red-100', borderColor: 'border-red-200' };
}

const GAD7ResultView: React.FC<{ questionnaire: QuestionnaireResult }> = ({ questionnaire }) => {
    const score = questionnaire.score || 0;
    const severity = getGad7Severity(score);
    const answers = questionnaire.answers || [];

    return (
        <div className="space-y-8">
            {/* Scoring Overview */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Score GAD-7 Angst Ernst</h3>
                    <div className={`px-4 py-2 rounded-full border ${severity.bg} ${severity.borderColor} ${severity.color} font-bold`}>
                        {severity.label}
                    </div>
                </div>
                
                <div className="flex items-end gap-2 mb-6">
                    <span className="text-5xl font-extrabold text-gray-900">{score}</span>
                    <span className="text-gray-500 mb-1.5 font-medium">/ 21 Totale Score</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                     <div className={`p-2 rounded-lg ${score <= 4 ? 'bg-green-100 border border-green-200 font-bold text-green-800' : 'bg-gray-50 text-gray-400'}`}>
                        0–4: Minimaal
                     </div>
                     <div className={`p-2 rounded-lg ${score >= 5 && score <= 9 ? 'bg-blue-100 border border-blue-200 font-bold text-blue-800' : 'bg-gray-50 text-gray-400'}`}>
                        5–9: Licht
                     </div>
                     <div className={`p-2 rounded-lg ${score >= 10 && score <= 14 ? 'bg-orange-100 border border-orange-200 font-bold text-orange-800' : 'bg-gray-50 text-gray-400'}`}>
                        10–14: Matig
                     </div>
                     <div className={`p-2 rounded-lg ${score >= 15 ? 'bg-red-100 border border-red-200 font-bold text-red-800' : 'bg-gray-50 text-gray-400'}`}>
                        15–21: Ernstig
                     </div>
                </div>
            </div>

            {/* Questions Grid */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Hoe vaak heeft u in de afgelopen twee weken last gehad van de volgende problemen?</h3>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="p-3 text-left w-1/3"></th>
                                <th className="p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-1/6 align-bottom">Helemaal niet</th>
                                <th className="p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-1/6 align-bottom">Meerdere dagen</th>
                                <th className="p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-1/6 align-bottom">Meer dan de helft vd dagen</th>
                                <th className="p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-1/6 align-bottom">Bijna elke dag</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {answers.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="p-3 text-sm font-medium text-gray-800">
                                        {item.question}
                                    </td>
                                    {[0, 1, 2, 3].map((val) => (
                                        <td key={val} className="p-3 text-center">
                                            <div className="flex justify-center">
                                                <div className={`
                                                    h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                                    ${item.score === val 
                                                        ? 'bg-blue-600 text-white shadow-md scale-110' 
                                                        : 'text-gray-300 bg-gray-50'}
                                                `}>
                                                    {val}
                                                </div>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t-2 border-gray-100">
                            <tr>
                                <td className="p-4 text-right font-bold text-gray-600">Kolom totalen</td>
                                <td className="p-4 text-center text-gray-400 font-medium">+</td>
                                <td className="p-4 text-center text-gray-400 font-medium">+</td>
                                <td className="p-4 text-center text-gray-400 font-medium">+</td>
                                <td className="p-4 text-center font-bold text-xl text-blue-600">= {score}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}

const QuestionnaireDetail: React.FC<QuestionnaireDetailProps> = ({ questionnaire, participantName, onBack }) => {
  const is4DKL = questionnaire.type === QuestionnaireType.FourDKL;
  const isGAD7 = questionnaire.type === QuestionnaireType.GAD7;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-4 mb-6">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 flex-shrink-0">
                <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <h2 className="text-3xl font-bold text-gray-900">{questionnaire.type}</h2>
        </div>

        {/* Header Section for non-GAD7 (GAD7 handles its own header in the custom view) */}
        {!isGAD7 && (
            <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {!is4DKL && (
                        <div className="bg-blue-50 p-6 rounded-xl flex flex-col items-center justify-center min-w-[200px] text-center">
                            <ClipboardDocumentListIcon className="h-16 w-16 text-blue-500 mb-4" />
                            {questionnaire.completed ? (
                                <>
                                    <span className="text-4xl font-bold text-blue-700">{questionnaire.score}</span>
                                    <span className="text-sm text-blue-500 font-medium mt-1">van {questionnaire.maxScore}</span>
                                </>
                            ) : (
                                <span className="text-gray-500 font-medium">Niet ingevuld</span>
                            )}
                        </div>
                    )}
                    
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Over deze vragenlijst</h3>
                        <p className="text-gray-600 mb-6">{questionnaire.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Status</h4>
                                <p className={`font-medium ${questionnaire.completed ? 'text-green-600' : 'text-orange-500'}`}>
                                    {questionnaire.completed ? 'Voltooid' : 'Nog niet ingevuld'}
                                </p>
                            </div>
                            {questionnaire.completed && (
                                <>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Datum</h4>
                                        <p className="font-medium text-gray-800">
                                            {new Date(questionnaire.date!).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    {!is4DKL && (
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Interpretatie</h4>
                                            <p className="font-medium text-gray-800">{questionnaire.resultLabel}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        {!questionnaire.completed && (
             <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <p className="text-gray-600 mb-4">Deze vragenlijst is nog niet ingevuld door {participantName}.</p>
                <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                    Vragenlijst versturen
                </button>
             </div>
        )}
        
        {/* Render GAD-7 View if applicable and completed */}
        {isGAD7 && questionnaire.completed && (
            <GAD7ResultView questionnaire={questionnaire} />
        )}

        {/* 4DKL Results */}
        {questionnaire.completed && is4DKL && questionnaire.subScores && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-6">4DKL Resultaten Overzicht</h3>
                <div className="space-y-8">
                    {questionnaire.subScores.map((item, index) => {
                        const isStronglyElevated = item.interpretation === 'Sterk verhoogd';
                        const isModeratelyElevated = item.interpretation === 'Matig verhoogd';
                        
                        let colorClass = 'bg-green-500';
                        let textColorClass = 'text-green-600';
                        
                        if (isStronglyElevated) {
                            colorClass = 'bg-red-500';
                            textColorClass = 'text-red-600';
                        } else if (isModeratelyElevated) {
                            colorClass = 'bg-orange-500';
                            textColorClass = 'text-orange-600';
                        }
                        
                        const percentage = (item.score / item.max) * 100;
                        
                        return (
                            <div key={index} className="relative">
                                <div className="flex justify-between items-end mb-1">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{item.label}</h4>
                                    </div>
                                    <div className="text-right">
                                         <span className="text-xl font-bold text-gray-800">{item.score}</span>
                                         <span className="text-sm text-gray-400 font-medium">/{item.max}</span>
                                    </div>
                                </div>
                                
                                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden relative">
                                    <div 
                                        className={`h-full rounded-full ${colorClass} transition-all duration-500`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                
                                <div className="flex justify-between items-start mt-1">
                                    <span className={`text-xs font-bold uppercase tracking-wide ${textColorClass}`}>
                                        {item.interpretation}
                                    </span>
                                </div>
                                {item.interpretationDetails && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-100">
                                        {item.interpretationDetails}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {/* Generic Answers Table (Shown if NOT GAD-7, but has answers) */}
        {questionnaire.completed && questionnaire.answers && !isGAD7 && (
            <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Gedetailleerde Antwoorden</h3>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Vraag</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Antwoord</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Score</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {questionnaire.answers.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.question}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.score > 0 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {item.answerLabel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 text-right">{item.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {questionnaire.completed && !questionnaire.answers && !is4DKL && !isGAD7 && (
            <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Antwoord Details</h3>
                <p className="text-gray-500 italic text-sm">Gedetailleerde antwoorden zijn beschikbaar in het dossier.</p>
            </div>
        )}
    </div>
  );
};

export default QuestionnaireDetail;
