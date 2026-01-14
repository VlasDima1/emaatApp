
import { Survey, SurveyScores } from '../../types';
import { ClipboardCheckIcon } from '../../components/Icons';

// Raw score to scaled activation score conversion table for PAM-13
const pam13ConversionTable: Record<number, number> = {
    13: 33.3, 14: 35.8, 15: 37.9, 16: 39.7, 17: 41.4, 18: 42.9, 19: 44.2, 20: 45.5, 
    21: 46.7, 22: 47.8, 23: 48.9, 24: 50.0, 25: 51.0, 26: 52.2, 27: 53.3, 28: 54.4, 
    29: 55.6, 30: 56.8, 31: 58.0, 32: 59.2, 33: 60.5, 34: 61.8, 35: 63.2, 36: 64.6, 
    37: 66.0, 38: 67.5, 39: 69.1, 40: 70.7, 41: 72.4, 42: 74.1, 43: 75.9, 44: 77.8, 
    45: 79.8, 46: 81.9, 47: 84.1, 48: 86.5, 49: 89.1, 50: 92.1, 51: 95.7, 52: 96.1,
};

const pam13ScoreConverter = (rawScores: SurveyScores): SurveyScores => {
    const rawScore = rawScores.score;
    if (rawScore === undefined) return { score: 0 };
    
    // For scores outside the table, use the closest value
    const minKey = 13;
    const maxKey = 52;
    let convertedScore = 0;
    if (rawScore < minKey) convertedScore = pam13ConversionTable[minKey];
    else if (rawScore > maxKey) convertedScore = pam13ConversionTable[maxKey];
    else convertedScore = pam13ConversionTable[rawScore];

    return { ...rawScores, score: convertedScore };
};


export const pam13Survey: Survey = {
    id: 'pam13',
    nameKey: 'surveys.pam13.name',
    descriptionKey: 'surveys.pam13.description',
    icon: ClipboardCheckIcon,
    questions: Array.from({ length: 13 }, (_, i) => ({
        id: `q${i + 1}`,
        textKey: `surveys.pam13.questions.q${i + 1}`,
        answerOptionsKey: 'default',
    })),
    answerOptions: {
        'default': [
            { textKey: 'surveys.pam13.answers.a1', value: 1 }, // Disagree Strongly
            { textKey: 'surveys.pam13.answers.a2', value: 2 }, // Disagree
            { textKey: 'surveys.pam13.answers.a3', value: 3 }, // Agree
            { textKey: 'surveys.pam13.answers.a4', value: 4 }, // Agree Strongly
            { textKey: 'surveys.pam13.answers.a5', value: 0 }, // N/A
        ],
    },
    scoringMap: {
        score: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13'],
    },
    scoreConverter: pam13ScoreConverter,
    interpretationThresholds: {
        // Level 1: <= 47.0
        // Level 2: 47.1 - 55.1
        // Level 3: 55.2 - 67.0
        // Level 4: > 67.0
        // Mapping to low/moderate/high
        score: { moderate: 55.2, high: 67.1 },
    },
};
