import { Survey } from '../types';
import { LungsIcon } from '../components/Icons';

export const mmrcSurvey: Survey = {
    id: 'mmrc',
    nameKey: 'surveys.mmrc.name',
    descriptionKey: 'surveys.mmrc.description',
    icon: LungsIcon,
    questions: [
        { id: 'q1', textKey: 'surveys.mmrc.questions.q1', answerOptionsKey: 'default' },
    ],
    answerOptions: {
        'default': [
            { textKey: 'surveys.mmrc.answers.a0', value: 0 },
            { textKey: 'surveys.mmrc.answers.a1', value: 1 },
            { textKey: 'surveys.mmrc.answers.a2', value: 2 },
            { textKey: 'surveys.mmrc.answers.a3', value: 3 },
            { textKey: 'surveys.mmrc.answers.a4', value: 4 },
        ],
    },
    scoringMap: {
        score: ['q1'],
    },
    interpretationThresholds: {
        // Grades 0-1 (Mild), 2 (Moderate), 3-4 (Severe)
        score: { moderate: 2, high: 3 },
    },
};