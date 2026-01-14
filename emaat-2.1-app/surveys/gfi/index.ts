
import { Survey, SurveyScores } from '../../types';
import { UserGroupIcon } from '../../components/Icons';

const gfiScoreConverter = (rawScores: SurveyScores): SurveyScores => {
    const baseScore = rawScores.score || 0;
    const q15Value = rawScores.q15_score;
    // According to GFI, a self-rated health score of 1-5 indicates frailty (1 point), and 6-10 does not (0 points).
    const q15Points = (q15Value !== undefined && q15Value >= 1 && q15Value <= 5) ? 1 : 0;
    return { ...rawScores, score: baseScore + q15Points };
};

export const gfiSurvey: Survey = {
    id: 'gfi',
    nameKey: 'surveys.gfi.name',
    descriptionKey: 'surveys.gfi.description',
    icon: UserGroupIcon,
    questions: [
        { id: 'q1', textKey: 'surveys.gfi.questions.q1', answerOptionsKey: 'reversed_default' }, // "Do you feel fit?" No=1
        { id: 'q2', textKey: 'surveys.gfi.questions.q2', answerOptionsKey: 'default' },
        { id: 'q3', textKey: 'surveys.gfi.questions.q3', answerOptionsKey: 'default' },
        { id: 'q4', textKey: 'surveys.gfi.questions.q4', answerOptionsKey: 'default' },
        { id: 'q5', textKey: 'surveys.gfi.questions.q5', answerOptionsKey: 'default' },
        { id: 'q6', textKey: 'surveys.gfi.questions.q6', answerOptionsKey: 'reversed_default' }, // "Do you sometimes go out?" No=1
        { id: 'q7', textKey: 'surveys.gfi.questions.q7', answerOptionsKey: 'default' },
        { id: 'q8', textKey: 'surveys.gfi.questions.q8', answerOptionsKey: 'default' },
        { id: 'q9', textKey: 'surveys.gfi.questions.q9', answerOptionsKey: 'default' },
        { id: 'q10', textKey: 'surveys.gfi.questions.q10', answerOptionsKey: 'default' },
        { id: 'q11', textKey: 'surveys.gfi.questions.q11', answerOptionsKey: 'default' },
        { id: 'q12', textKey: 'surveys.gfi.questions.q12', answerOptionsKey: 'default' },
        { id: 'q13', textKey: 'surveys.gfi.questions.q13', answerOptionsKey: 'default' },
        { id: 'q14', textKey: 'surveys.gfi.questions.q14', answerOptionsKey: 'default' },
        { id: 'q15', textKey: 'surveys.gfi.questions.q15', answerOptionsKey: 'q15_options' },
    ],
    answerOptions: {
        'default': [
            { textKey: 'surveys.common.yes', value: 1 },
            { textKey: 'surveys.common.no', value: 0 },
        ],
        'reversed_default': [
            { textKey: 'surveys.common.yes', value: 0 },
            { textKey: 'surveys.common.no', value: 1 },
        ],
        'q15_options': Array.from({ length: 10 }, (_, i) => ({
            textKey: `surveys.gfi.answers.a${i + 1}`, value: i + 1
        })),
    },
    scoringMap: {
        score: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14'],
        q15_score: ['q15'],
    },
    scoreConverter: gfiScoreConverter,
    interpretationThresholds: {
        score: { moderate: 4, high: 16 }, // >=4 is frail. High is impossible.
    },
};
