
import { Survey, SurveyScores } from '../../types';
import { HeartIcon } from '../../components/Icons';

const scoreConverter = (rawScores: SurveyScores): SurveyScores => {
    // Calculate domain scores
    const generalScore = (rawScores.g1 || 0) + (rawScores.g2 || 0) + (rawScores.g3 || 0) + 
                         (rawScores.g4 || 0) + (rawScores.g5 || 0) + (rawScores.g6 || 0) + 
                         (rawScores.g7 || 0) + (rawScores.g8 || 0) + (rawScores.g9 || 0) + 
                         (rawScores.g10 || 0) + (rawScores.g11 || 0);
    
    const heartFailureScore = (rawScores.h1 || 0) + (rawScores.h2 || 0) + (rawScores.h3 || 0) + 
                              (rawScores.h4 || 0) + (rawScores.h5 || 0) + (rawScores.h6 || 0) +
                              (rawScores.h7 || 0) + (rawScores.h8 || 0) + (rawScores.h9 || 0);
    
    const totalScore = generalScore + heartFailureScore;
    
    return { 
        ...rawScores, 
        score: totalScore,
        generalScore,
        heartFailureScore
    };
};

export const algemeenHartfalenSurvey: Survey = {
    id: 'algemeenHartfalen',
    nameKey: 'surveys.algemeenHartfalen.name',
    descriptionKey: 'surveys.algemeenHartfalen.description',
    icon: HeartIcon,
    questions: [
        // General questions G1-G11
        { id: 'g1', textKey: 'surveys.algemeenHartfalen.questions.g1', answerOptionsKey: 'frequency' },
        { id: 'g2', textKey: 'surveys.algemeenHartfalen.questions.g2', answerOptionsKey: 'frequency' },
        { id: 'g3', textKey: 'surveys.algemeenHartfalen.questions.g3', answerOptionsKey: 'frequency' },
        { id: 'g4', textKey: 'surveys.algemeenHartfalen.questions.g4', answerOptionsKey: 'frequency' },
        { id: 'g5', textKey: 'surveys.algemeenHartfalen.questions.g5', answerOptionsKey: 'severity' },
        { id: 'g6', textKey: 'surveys.algemeenHartfalen.questions.g6', answerOptionsKey: 'severity' },
        { id: 'g7', textKey: 'surveys.algemeenHartfalen.questions.g7', answerOptionsKey: 'severity' },
        { id: 'g8', textKey: 'surveys.algemeenHartfalen.questions.g8', answerOptionsKey: 'severity' },
        { id: 'g9', textKey: 'surveys.algemeenHartfalen.questions.g9', answerOptionsKey: 'severity' },
        { id: 'g10', textKey: 'surveys.algemeenHartfalen.questions.g10', answerOptionsKey: 'severity' },
        { id: 'g11', textKey: 'surveys.algemeenHartfalen.questions.g11', answerOptionsKey: 'severity' },
        // Heart failure specific questions H1-H9
        { id: 'h1', textKey: 'surveys.algemeenHartfalen.questions.h1', answerOptionsKey: 'severity' },
        { id: 'h2', textKey: 'surveys.algemeenHartfalen.questions.h2', answerOptionsKey: 'severity' },
        { id: 'h3', textKey: 'surveys.algemeenHartfalen.questions.h3', answerOptionsKey: 'severity' },
        { id: 'h4', textKey: 'surveys.algemeenHartfalen.questions.h4', answerOptionsKey: 'severity' },
        { id: 'h5', textKey: 'surveys.algemeenHartfalen.questions.h5', answerOptionsKey: 'severity' },
        { id: 'h6', textKey: 'surveys.algemeenHartfalen.questions.h6', answerOptionsKey: 'severity' },
        { id: 'h7', textKey: 'surveys.algemeenHartfalen.questions.h7', answerOptionsKey: 'occurrences' },
        { id: 'h8', textKey: 'surveys.algemeenHartfalen.questions.h8', answerOptionsKey: 'occurrences' },
        { id: 'h9', textKey: 'surveys.algemeenHartfalen.questions.h9', answerOptionsKey: 'occurrences' },
    ],
    answerOptions: {
        'frequency': [
            { textKey: 'surveys.algemeenHartfalen.answers.freq0', value: 0 },
            { textKey: 'surveys.algemeenHartfalen.answers.freq1', value: 1 },
            { textKey: 'surveys.algemeenHartfalen.answers.freq2', value: 2 },
            { textKey: 'surveys.algemeenHartfalen.answers.freq3', value: 3 },
            { textKey: 'surveys.algemeenHartfalen.answers.freq4', value: 4 },
            { textKey: 'surveys.algemeenHartfalen.answers.freq5', value: 5 },
            { textKey: 'surveys.algemeenHartfalen.answers.freq6', value: 6 },
        ],
        'severity': [
            { textKey: 'surveys.algemeenHartfalen.answers.sev0', value: 0 },
            { textKey: 'surveys.algemeenHartfalen.answers.sev1', value: 1 },
            { textKey: 'surveys.algemeenHartfalen.answers.sev2', value: 2 },
            { textKey: 'surveys.algemeenHartfalen.answers.sev3', value: 3 },
            { textKey: 'surveys.algemeenHartfalen.answers.sev4', value: 4 },
            { textKey: 'surveys.algemeenHartfalen.answers.sev5', value: 5 },
            { textKey: 'surveys.algemeenHartfalen.answers.sev6', value: 6 },
        ],
        'occurrences': [
            { textKey: 'surveys.algemeenHartfalen.answers.occ0', value: 0 },
            { textKey: 'surveys.algemeenHartfalen.answers.occ1', value: 1 },
            { textKey: 'surveys.algemeenHartfalen.answers.occ2', value: 2 },
            { textKey: 'surveys.algemeenHartfalen.answers.occ3', value: 3 },
            { textKey: 'surveys.algemeenHartfalen.answers.occ4', value: 4 },
        ],
    },
    scoringMap: {
        score: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9'],
        generalScore: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11'],
        heartFailureScore: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9'],
        // Individual items
        g1: ['g1'], g2: ['g2'], g3: ['g3'], g4: ['g4'], g5: ['g5'],
        g6: ['g6'], g7: ['g7'], g8: ['g8'], g9: ['g9'], g10: ['g10'], g11: ['g11'],
        h1: ['h1'], h2: ['h2'], h3: ['h3'], h4: ['h4'], h5: ['h5'], h6: ['h6'],
        h7: ['h7'], h8: ['h8'], h9: ['h9'],
    },
    scoreConverter,
    interpretationThresholds: {
        // Total score: 20 questions, max 120 (general) + ~30 (heart failure specific with different scale for h7-h9)
        score: { moderate: 40, high: 80 },
        generalScore: { moderate: 22, high: 44 }, // 11 items, max 66
        heartFailureScore: { moderate: 18, high: 36 }, // 9 items, max ~42
    },
};
