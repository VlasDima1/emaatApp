
import { Survey, SurveyScores } from '../../types';
import { LungsIcon } from '../../components/Icons';

const ccqScoreConverter = (rawScores: SurveyScores): SurveyScores => {
    const totalScore = rawScores.score || 0;
    // The CCQ score is the average of the 14 items.
    const finalScore = totalScore / 14;
    return { ...rawScores, score: finalScore };
};

export const zlmSurvey: Survey = {
    id: 'zlm',
    nameKey: 'surveys.zlm.name',
    descriptionKey: 'surveys.zlm.description',
    icon: LungsIcon,
    questions: [
        // CCQ Questions 1-14
        { id: 'q1', textKey: 'surveys.zlm.questions.q1', answerOptionsKey: 'frequency' },
        { id: 'q2', textKey: 'surveys.zlm.questions.q2', answerOptionsKey: 'frequency' },
        { id: 'q3', textKey: 'surveys.zlm.questions.q3', answerOptionsKey: 'frequency' },
        { id: 'q4', textKey: 'surveys.zlm.questions.q4', answerOptionsKey: 'frequency' },
        { id: 'q5', textKey: 'surveys.zlm.questions.q5', answerOptionsKey: 'frequency' },
        { id: 'q6', textKey: 'surveys.zlm.questions.q6', answerOptionsKey: 'limitation' },
        { id: 'q7', textKey: 'surveys.zlm.questions.q7', answerOptionsKey: 'limitation' },
        { id: 'q8', textKey: 'surveys.zlm.questions.q8', answerOptionsKey: 'limitation' },
        { id: 'q9', textKey: 'surveys.zlm.questions.q9', answerOptionsKey: 'limitation' },
        { id: 'q10', textKey: 'surveys.zlm.questions.q10', answerOptionsKey: 'limitation' },
        { id: 'q11', textKey: 'surveys.zlm.questions.q11', answerOptionsKey: 'frequency' },
        { id: 'q12', textKey: 'surveys.zlm.questions.q12', answerOptionsKey: 'frequency' },
        { id: 'q13', textKey: 'surveys.zlm.questions.q13', answerOptionsKey: 'frequency' },
        { id: 'q14', textKey: 'surveys.zlm.questions.q14', answerOptionsKey: 'frequency' },
        // Extra ZLM Questions
        { id: 'q15', textKey: 'surveys.zlm.questions.q15', answerOptionsKey: 'smoking' },
        { id: 'q16', textKey: 'surveys.zlm.questions.q16', answerOptionsKey: 'exacerbations' },
        { id: 'q17', textKey: 'surveys.zlm.questions.q17', answerOptionsKey: 'exercise' },
        { id: 'q18', textKey: 'surveys.zlm.questions.q18', answerOptionsKey: 'lungFunction' },
    ],
    answerOptions: {
        'frequency': [
            { textKey: 'surveys.zlm.answers.freq0', value: 0 },
            { textKey: 'surveys.zlm.answers.freq1', value: 1 },
            { textKey: 'surveys.zlm.answers.freq2', value: 2 },
            { textKey: 'surveys.zlm.answers.freq3', value: 3 },
            { textKey: 'surveys.zlm.answers.freq4', value: 4 },
            { textKey: 'surveys.zlm.answers.freq5', value: 5 },
        ],
        'limitation': [
            { textKey: 'surveys.zlm.answers.lim0', value: 0 },
            { textKey: 'surveys.zlm.answers.lim1', value: 1 },
            { textKey: 'surveys.zlm.answers.lim2', value: 2 },
            { textKey: 'surveys.zlm.answers.lim3', value: 3 },
            { textKey: 'surveys.zlm.answers.lim4', value: 4 },
            { textKey: 'surveys.zlm.answers.lim5', value: 5 },
        ],
        'smoking': [
            { textKey: 'surveys.zlm.answers.smokeYes', value: 1 },
            { textKey: 'surveys.zlm.answers.smokeNo', value: 0 },
        ],
        'exacerbations': [
            { textKey: 'surveys.zlm.answers.ex0', value: 0 },
            { textKey: 'surveys.zlm.answers.ex1', value: 1 },
            { textKey: 'surveys.zlm.answers.ex2', value: 2 },
        ],
        'exercise': [
            { textKey: 'surveys.zlm.answers.moveYes', value: 0 },
            { textKey: 'surveys.zlm.answers.moveNo', value: 1 },
        ],
        'lungFunction': [
            { textKey: 'surveys.zlm.answers.lungFunction', value: -1 },
             { textKey: "> 80%", value: 0 },
             { textKey: "50 - 80%", value: 1 },
             { textKey: "30 - 50%", value: 2 },
             { textKey: "< 30%", value: 3 },
        ]
    },
    scoringMap: {
        // Standard CCQ total score (sum of 14 items) for the overall result
        score: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14'],
        
        // Specific items stored individually for the balloon visual
        // Note: The visual component extracts answers directly via result.answers for some, 
        // but keeping them in scores makes it robust for standard result rendering.
        q1: ['q1'], q2: ['q2'], q3: ['q3'], q4: ['q4'], q5: ['q5'],
        q6: ['q6'], q7: ['q7'], q8: ['q8'], q9: ['q9'], q10: ['q10'],
        q11: ['q11'], q12: ['q12'], q13: ['q13'], q14: ['q14'],
        
        smoking: ['q15'],
        exacerbations: ['q16'],
        exercise: ['q17'],
        lungFunction: ['q18'],
        
        // Aggregated sub-domains for result list summary
        symptoms: ['q1', 'q2', 'q3', 'q4', 'q5'], // Sum of symptoms
        functional: ['q6', 'q7', 'q8', 'q9', 'q10'], // Sum of functional
        mental: ['q11', 'q12', 'q13', 'q14'], // Sum of mental
    },
    scoreConverter: ccqScoreConverter,
    interpretationThresholds: {
        // Total CCQ Score (Average)
        score: { moderate: 1.1, high: 2.1 },
        
        // Single item binaries/tri-states
        smoking: { moderate: 0.5, high: 0.5 }, // 0=No (Low), 1=Yes (High)
        exacerbations: { moderate: 1, high: 2 }, // 0=Low, 1=Mod, 2+=High
        exercise: { moderate: 0.5, high: 0.5 }, // 0=Yes (Low burden), 1=No (High burden)
        lungFunction: { moderate: 1, high: 2 }, // 0=Good, 1=Mod, 2/3=High
        
        // Aggregate domains (Sums, roughly scaled based on item count x 1.1/2.1 thresholds)
        // 5 items: Mod ~ 5.5, High ~ 10.5
        symptoms: { moderate: 6, high: 11 }, 
        functional: { moderate: 6, high: 11 },
        // 4 items: Mod ~ 4.4, High ~ 8.4
        mental: { moderate: 5, high: 9 },
        
        // Proxies used in Visual but good to have thresholds if they appear in list
        fatigue: { moderate: 2, high: 4 }, 
        emotions: { moderate: 2, high: 4 },
    },
};
