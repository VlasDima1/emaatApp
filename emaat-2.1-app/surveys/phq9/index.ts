import { Survey } from '../../types';
import { FaceFrownIcon } from '../../components/Icons';

export const phq9Survey: Survey = {
    id: 'phq9',
    nameKey: 'surveys.phq9.name',
    descriptionKey: 'surveys.phq9.description',
    icon: FaceFrownIcon,
    questions: Array.from({ length: 9 }, (_, i) => ({
        id: `q${i + 1}`,
        textKey: `surveys.phq9.questions.q${i + 1}`,
        answerOptionsKey: 'default',
    })),
    answerOptions: {
        'default': [
            { textKey: 'surveys.phq9.answers.a0', value: 0 },
            { textKey: 'surveys.phq9.answers.a1', value: 1 },
            { textKey: 'surveys.phq9.answers.a2', value: 2 },
            { textKey: 'surveys.phq9.answers.a3', value: 3 },
        ]
    },
    scoringMap: {
        score: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9'],
    },
    interpretationThresholds: {
        score: { moderate: 10, high: 20 }, // 10-19: Moderate to Moderately Severe, >=20: Severe
    },
};