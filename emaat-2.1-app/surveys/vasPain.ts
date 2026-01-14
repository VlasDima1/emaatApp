import { Survey } from '../types';
import { ExclamationTriangleIcon } from '../components/Icons';

export const vasPainSurvey: Survey = {
    id: 'vasPain',
    nameKey: 'surveys.vasPain.name',
    descriptionKey: 'surveys.vasPain.description',
    icon: ExclamationTriangleIcon,
    questions: [
        { id: 'q1', textKey: 'surveys.vasPain.questions.q1', answerOptionsKey: 'default' },
    ],
    answerOptions: {
        'default': Array.from({ length: 11 }, (_, i) => ({
            textKey: `surveys.vasPain.answers.a${i}`, value: i
        }))
    },
    scoringMap: {
        score: ['q1'],
    },
    interpretationThresholds: {
        score: { moderate: 4, high: 7 }, // 4-6: Moderate, 7-10: Severe
    },
};
