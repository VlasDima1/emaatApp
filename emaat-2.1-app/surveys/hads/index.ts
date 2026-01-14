import { Survey } from '../../types';
import { ShieldExclamationIcon } from '../../components/Icons';

export const hadsSurvey: Survey = {
    id: 'hads',
    nameKey: 'surveys.hads.name',
    descriptionKey: 'surveys.hads.description',
    icon: ShieldExclamationIcon,
    questions: Array.from({ length: 14 }, (_, i) => ({
        id: `q${i + 1}`,
        textKey: `surveys.hads.questions.q${i + 1}`,
        answerOptionsKey: 'default',
    })),
    answerOptions: {
        'default': [
            // Note: The scoring is reversed for some questions. This is handled in the question text itself.
            // E.g., "Most of the time (3)" vs "Not at all (3)". The value is always what's shown.
            { textKey: 'surveys.hads.answers.a3', value: 3 },
            { textKey: 'surveys.hads.answers.a2', value: 2 },
            { textKey: 'surveys.hads.answers.a1', value: 1 },
            { textKey: 'surveys.hads.answers.a0', value: 0 },
        ],
    },
    scoringMap: {
        anxiety: ['q1', 'q3', 'q5', 'q7', 'q9', 'q11', 'q13'],
        depression: ['q2', 'q4', 'q6', 'q8', 'q10', 'q12', 'q14'],
    },
    interpretationThresholds: {
        anxiety: { moderate: 8, high: 11 },
        depression: { moderate: 8, high: 11 },
    },
};