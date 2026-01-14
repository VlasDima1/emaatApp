import { Survey } from '../../types';
import { ShieldExclamationIcon } from '../../components/Icons';

export const gad7Survey: Survey = {
    id: 'gad7',
    nameKey: 'surveys.gad7.name',
    descriptionKey: 'surveys.gad7.description',
    icon: ShieldExclamationIcon,
    questions: Array.from({ length: 7 }, (_, i) => ({
        id: `q${i + 1}`,
        textKey: `surveys.gad7.questions.q${i + 1}`,
        answerOptionsKey: 'default',
    })),
    answerOptions: {
        'default': [
            { textKey: 'surveys.gad7.answers.a0', value: 0 },
            { textKey: 'surveys.gad7.answers.a1', value: 1 },
            { textKey: 'surveys.gad7.answers.a2', value: 2 },
            { textKey: 'surveys.gad7.answers.a3', value: 3 },
        ]
    },
    scoringMap: {
        score: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'],
    },
    interpretationThresholds: {
        score: { moderate: 10, high: 15 }, // 10-14: Moderate, >=15: Severe
    },
};