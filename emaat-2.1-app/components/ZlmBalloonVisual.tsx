
import React, { FC } from 'react';
import { SurveyResult } from '../types';

interface ZlmBalloonVisualProps {
    result: SurveyResult;
    bmi?: number; 
}

const colorMap = {
    green: '#4ade80', // green-400
    yellow: '#facc15', // yellow-400
    orange: '#fb923c', // orange-400
    red: '#f87171', // red-400
};

const Balloon: FC<{ label: string; color: string; heightPercent: number; xPercent: number; isStaggered: boolean }> = ({ label, color, heightPercent, xPercent, isStaggered }) => {
    // Stagger labels to prevent overlap: Even indices lower, Odd indices higher on the grass
    const labelBottom = isStaggered ? 14 : 4; 
    // Balloon bottom position (relative to container height)
    const balloonBottom = heightPercent;
    
    // Calculate string height: difference between balloon bottom and label top
    // Approximating label height impact.
    const stringHeight = Math.max(0, balloonBottom - labelBottom - 5); 

    return (
        <>
            {/* Connecting String */}
            <div 
                className="absolute w-0.5 bg-white/70 transform -translate-x-1/2 z-0"
                style={{ 
                    left: `${xPercent}%`, 
                    bottom: `${labelBottom + 4}%`, 
                    height: `${stringHeight}%`,
                }}
            ></div>

            {/* Balloon Body */}
            <div 
                className="absolute w-10 h-12 md:w-12 md:h-14 rounded-[50%] shadow-lg flex items-center justify-center transform -translate-x-1/2 transition-all duration-1000 ease-out z-10"
                style={{ 
                    left: `${xPercent}%`, 
                    bottom: `${balloonBottom}%`,
                    backgroundColor: colorMap[color as keyof typeof colorMap],
                    boxShadow: 'inset -4px -4px 10px rgba(0,0,0,0.1)'
                }}
            >
                {/* Highlight */}
                <div className="absolute top-2 right-3 w-2 h-1.5 bg-white/40 rounded-[50%] transform rotate-45"></div>
            </div>

            {/* Label on Grass */}
            <div 
                className="absolute transform -translate-x-1/2 px-1.5 py-1 bg-white/90 rounded shadow-sm z-20 border border-gray-200 flex flex-col items-center"
                style={{
                    left: `${xPercent}%`,
                    bottom: `${labelBottom}%`,
                    maxWidth: '60px'
                }}
            >
                <span className="text-[8px] md:text-[9px] font-bold text-gray-800 leading-none text-center overflow-hidden text-ellipsis">
                    {label}
                </span>
            </div>
        </>
    );
};

const ZlmBalloonVisual: FC<ZlmBalloonVisualProps> = ({ result, bmi }) => {
    const getScore = (dim: string) => result.scores[dim] || 0;

    // Helper to extract raw answer values for specific single-item dimensions
    const getAnsVal = (qid: string) => {
        const aKey = result.answers[qid];
        if(!aKey) return 0;
        // Answers are keys like 'freq2', 'smokeYes'. We need to map them to values if not already in scores.
        // However, for ZLM, we mapped single items to dimensions in index.ts (e.g. 'smoking' -> ['q15']).
        // So getScore('smoking') should return the value defined in answerOptions.
        return 0; 
    };

    // Helper for average scores of CCQ sub-domains if they aren't pre-calculated or if we want raw item averages
    const getAvgFromQuestions = (qids: string[]) => {
        // We can try to rely on the scores calculated by the survey engine if mapped correctly.
        // But 'symptoms' might be a sum in the engine. For the visual we often want an average (0-5 scale).
        // Let's look at the scores provided. The survey definition sums them.
        // So we divide by count.
        return 0; // Placeholder if we rely purely on mapped dimensions
    };

    // Domain mapping logic
    // We need to normalize everything to a 4-color scale (Green, Yellow, Orange, Red)
    // heights: Green=75%, Yellow=60%, Orange=45%, Red=30% (relative to container)
    // X-positions: Distributed 
    
    const H_GREEN = 70;
    const H_YELLOW = 55;
    const H_ORANGE = 40;
    const H_RED = 25;

    const getColorHeight = (val: number, type: 'ccq' | 'binary' | 'tri' | 'lung' | 'bmi'): { c: string, h: number } => {
        // CCQ (0-5, lower is better)
        if (type === 'ccq') {
            // Use average score 0-5
            if (val <= 1) return { c: 'green', h: H_GREEN };
            if (val <= 2) return { c: 'yellow', h: H_YELLOW };
            if (val <= 3) return { c: 'orange', h: H_ORANGE };
            return { c: 'red', h: H_RED };
        }
        // Binary (0=Good, 1=Bad) e.g. Smoking
        if (type === 'binary') {
            return val === 0 ? { c: 'green', h: H_GREEN } : { c: 'red', h: H_RED };
        }
        // Tri-state (0=Good, 1=Med, 2=Bad) e.g. Exacerbations
        if (type === 'tri') {
            if (val === 0) return { c: 'green', h: H_GREEN };
            if (val === 1) return { c: 'yellow', h: H_YELLOW };
            return { c: 'red', h: H_RED };
        }
        // Lung Function (0=Good, 1=Med, 2=Bad, 3=Very Bad)
        if (type === 'lung') {
             if (val === 0) return { c: 'green', h: H_GREEN };
             if (val === 1) return { c: 'yellow', h: H_YELLOW };
             if (val === 2) return { c: 'orange', h: H_ORANGE };
             return { c: 'red', h: H_RED };
        }
        // BMI
        if (type === 'bmi') {
             if (!val) return { c: 'green', h: H_GREEN }; // Unknown
             if (val >= 18.5 && val <= 25) return { c: 'green', h: H_GREEN };
             if ((val > 25 && val <= 30) || (val < 18.5 && val >= 17)) return { c: 'orange', h: H_ORANGE };
             return { c: 'red', h: H_RED };
        }
        return { c: 'green', h: H_GREEN };
    };

    // Calculate averages for CCQ domains manually to ensure 0-5 scale
    // Q1-5 Symptoms
    const scoreSymptoms = (getScore('q1')+getScore('q2')+getScore('q3')+getScore('q4')+getScore('q5')) / 5;
    // Q6-10 Functional
    const scoreFunctional = (getScore('q6')+getScore('q7')+getScore('q8')+getScore('q9')+getScore('q10')) / 5;
    // Q11-14 Mental
    const scoreMental = (getScore('q11')+getScore('q12')+getScore('q13')+getScore('q14')) / 4;
    
    // Specific item proxies for balloons (as per image logic usually)
    // Benauwdheid (Dyspnea) -> q1 (rest) + q2 (activity) + q5 (tightness) avg
    const valDyspnea = (getScore('q1') + getScore('q2') + getScore('q5')) / 3;
    // Klachten (Cough/Phlegm) -> q3 + q4 avg
    const valCough = (getScore('q3') + getScore('q4')) / 2;
    // Vermoeidheid (Fatigue) -> q2 is often used as proxy or if explicitly added. 
    // CCQ doesn't have explicit fatigue, usually mapped to Functional or q2. Let's use Functional avg.
    const valFatigue = scoreFunctional; 
    // Emoties (Emotions) -> q11 + q12 avg
    const valEmotions = (getScore('q11') + getScore('q12')) / 2;
    // Geestelijk -> Mental domain
    const valMental = scoreMental;

    const data = [
        { label: 'Roken', ...getColorHeight(getScore('smoking'), 'binary') },
        { label: 'Longaanval', ...getColorHeight(getScore('exacerbations'), 'tri') },
        { label: 'Benauwdheid', ...getColorHeight(valDyspnea, 'ccq') },
        { label: 'BMI', ...getColorHeight(bmi || 22, 'bmi') },
        { label: 'Longfunctie', ...getColorHeight(getScore('lungFunction'), 'lung') },
        { label: 'Bewegen', ...getColorHeight(getScore('exercise'), 'binary') },
        { label: 'Klachten', ...getColorHeight(valCough, 'ccq') }, // Cough/Phlegm
        { label: 'Lichamelijk', ...getColorHeight(scoreFunctional, 'ccq') },
        { label: 'Geestelijk', ...getColorHeight(valMental, 'ccq') },
        { label: 'Vermoeidheid', ...getColorHeight(valFatigue, 'ccq') },
        { label: 'Emoties', ...getColorHeight(valEmotions, 'ccq') },
    ];

    return (
        <div className="w-full h-64 relative bg-gradient-to-b from-sky-300 to-sky-100 rounded-xl border-4 border-white shadow-inner overflow-hidden">
            {/* Sky */}
            <div className="absolute top-8 right-12 opacity-40">
                <div className="w-20 h-8 bg-white rounded-full blur-md"></div>
            </div>

            {/* Grass */}
            <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-green-600 to-green-400 border-t-4 border-green-700/20">
                 <div className="w-full h-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #000 5px, #000 10px)' }}></div>
            </div>

            {/* Balloons */}
            <div className="absolute inset-0">
                {data.map((d, i) => {
                    // Distribute with padding on sides (10% to 90%)
                    const xPercent = 8 + (i * (84 / (data.length - 1)));
                    return (
                        <Balloon 
                            key={i}
                            label={d.label}
                            color={d.c}
                            heightPercent={d.h}
                            xPercent={xPercent}
                            isStaggered={i % 2 !== 0}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ZlmBalloonVisual;
