
import { Survey, SurveyScores } from '../../types';
import { LungsIcon } from '../../components/Icons';

const ccqScoreConverter = (rawScores: SurveyScores): SurveyScores => {
    const totalScore = rawScores.score || 0;
    // The CCQ score is the average of the 14 items.
    // The raw score gathered by the generic handler is a sum.
    const finalScore = totalScore / 14;
    return { ...rawScores, score: finalScore };
};

export const ccqSurvey: Survey = {
    id: 'ccq',
    nameKey: 'surveys.ccq.name',
    descriptionKey: 'surveys.ccq.description',
    icon: LungsIcon,
    questions: [
        // Domain A: Symptoms (Frequency scale)
        { id: 'q1', textKey: 'surveys.ccq.questions.q1', answerOptionsKey: 'frequency' },
        { id: 'q2', textKey: 'surveys.ccq.questions.q2', answerOptionsKey: 'frequency' },
        { id: 'q3', textKey: 'surveys.ccq.questions.q3', answerOptionsKey: 'frequency' },
        { id: 'q4', textKey: 'surveys.ccq.questions.q4', answerOptionsKey: 'frequency' },
        { id: 'q5', textKey: 'surveys.ccq.questions.q5', answerOptionsKey: 'frequency' },
        // Domain B: Functional Status (Limitation scale)
        { id: 'q6', textKey: 'surveys.ccq.questions.q6', answerOptionsKey: 'limitation' },
        { id: 'q7', textKey: 'surveys.ccq.questions.q7', answerOptionsKey: 'limitation' },
        { id: 'q8', textKey: 'surveys.ccq.questions.q8', answerOptionsKey: 'limitation' },
        { id: 'q9', textKey: 'surveys.ccq.questions.q9', answerOptionsKey: 'limitation' },
        { id: 'q10', textKey: 'surveys.ccq.questions.q10', answerOptionsKey: 'limitation' },
        // Domain C: Mental Health (Frequency scale mostly, but standard scale 0-5 applies)
        { id: 'q11', textKey: 'surveys.ccq.questions.q11', answerOptionsKey: 'frequency' },
        { id: 'q12', textKey: 'surveys.ccq.questions.q12', answerOptionsKey: 'frequency' },
        { id: 'q13', textKey: 'surveys.ccq.questions.q13', answerOptionsKey: 'frequency' },
        { id: 'q14', textKey: 'surveys.ccq.questions.q14', answerOptionsKey: 'frequency' },
    ],
    answerOptions: {
        'frequency': [
            { textKey: 'surveys.ccq.answers.freq0', value: 0 },
            { textKey: 'surveys.ccq.answers.freq1', value: 1 },
            { textKey: 'surveys.ccq.answers.freq2', value: 2 },
            { textKey: 'surveys.ccq.answers.freq3', value: 3 },
            { textKey: 'surveys.ccq.answers.freq4', value: 4 },
            { textKey: 'surveys.ccq.answers.freq5', value: 5 },
        ],
        'limitation': [
            { textKey: 'surveys.ccq.answers.lim0', value: 0 },
            { textKey: 'surveys.ccq.answers.lim1', value: 1 },
            { textKey: 'surveys.ccq.answers.lim2', value: 2 },
            { textKey: 'surveys.ccq.answers.lim3', value: 3 },
            { textKey: 'surveys.ccq.answers.lim4', value: 4 },
            { textKey: 'surveys.ccq.answers.lim5', value: 5 },
        ]
    },
    scoringMap: {
        // All questions contribute to the total score
        score: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14'],
    },
    scoreConverter: ccqScoreConverter,
    interpretationThresholds: {
        // 0.0 - 1.0: Very light
        // 1.1 - 2.0: Light -> Mapped to Low (up to 1.0) / Moderate start at 1.1?
        // Let's map: < 1.1 = Low, 1.1 - 3.0 = Moderate, > 3.0 = High
        score: { moderate: 1.1, high: 3.1 },
    },
};
