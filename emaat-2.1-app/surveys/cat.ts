import { Survey } from '../types';
import { LungsIcon } from '../components/Icons';

export const catSurvey: Survey = {
    id: 'cat',
    nameKey: 'surveys.cat.name',
    descriptionKey: 'surveys.cat.description',
    icon: LungsIcon,
    questions: Array.from({ length: 8 }, (_, i) => ({
        id: `q${i + 1}`,
        textKey: `surveys.cat.questions.q${i + 1}`,
        answerOptionsKey: 'default',
    })),
    answerOptions: {
        'default': [
            { textKey: 'surveys.cat.answers.a0', value: 0 },
            { textKey: 'surveys.cat.answers.a1', value: 1 },
            { textKey: 'surveys.cat.answers.a2', value: 2 },
            { textKey: 'surveys.cat.answers.a3', value: 3 },
            { textKey: 'surveys.cat.answers.a4', value: 4 },
            { textKey: 'surveys.cat.answers.a5', value: 5 },
        ],
    },
    scoringMap: {
        score: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'],
    },
    interpretationThresholds: {
        score: { moderate: 10, high: 21 }, // 10-20: Medium Impact, >20: High/Very High Impact
    },
};
