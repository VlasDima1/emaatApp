import { Survey } from '../types';
import { UserGroupIcon } from '../components/Icons';

export const gfiSurvey: Survey = {
    id: 'gfi',
    nameKey: 'surveys.gfi.name',
    descriptionKey: 'surveys.gfi.description',
    icon: UserGroupIcon,
    questions: Array.from({ length: 15 }, (_, i) => ({
        id: `q${i + 1}`,
        textKey: `surveys.gfi.questions.q${i + 1}`,
        answerOptionsKey: 'default',
    })),
    answerOptions: {
        'default': [
            { textKey: 'surveys.common.yes', value: 1 },
            { textKey: 'surveys.common.no', value: 0 },
        ],
    },
    scoringMap: {
        score: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15'],
    },
    interpretationThresholds: {
        score: { moderate: 4, high: 16 }, // >=4 is frail. High is impossible.
    },
};
