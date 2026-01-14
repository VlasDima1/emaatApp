import { Survey } from '../types';
import { BeakerIcon } from '../components/Icons';

export const auditSurvey: Survey = {
    id: 'audit',
    nameKey: 'surveys.audit.name',
    descriptionKey: 'surveys.audit.description',
    icon: BeakerIcon,
    questions: [
        { id: 'q1', textKey: 'surveys.audit.questions.q1', answerOptionsKey: 'q1' },
        { id: 'q2', textKey: 'surveys.audit.questions.q2', answerOptionsKey: 'q2' },
        { id: 'q3', textKey: 'surveys.audit.questions.q3', answerOptionsKey: 'q1' },
        { id: 'q4', textKey: 'surveys.audit.questions.q4', answerOptionsKey: 'q1' },
        { id: 'q5', textKey: 'surveys.audit.questions.q5', answerOptionsKey: 'q1' },
        { id: 'q6', textKey: 'surveys.audit.questions.q6', answerOptionsKey: 'q1' },
        { id: 'q7', textKey: 'surveys.audit.questions.q7', answerOptionsKey: 'q1' },
        { id: 'q8', textKey: 'surveys.audit.questions.q8', answerOptionsKey: 'q1' },
        { id: 'q9', textKey: 'surveys.audit.questions.q9', answerOptionsKey: 'q9' },
        { id: 'q10', textKey: 'surveys.audit.questions.q10', answerOptionsKey: 'q9' },
    ],
    answerOptions: {
        'q1': [
            { textKey: 'surveys.audit.answers.q1a0', value: 0 },
            { textKey: 'surveys.audit.answers.q1a1', value: 1 },
            { textKey: 'surveys.audit.answers.q1a2', value: 2 },
            { textKey: 'surveys.audit.answers.q1a3', value: 3 },
            { textKey: 'surveys.audit.answers.q1a4', value: 4 },
        ],
        'q2': [
            { textKey: 'surveys.audit.answers.q2a0', value: 0 },
            { textKey: 'surveys.audit.answers.q2a1', value: 1 },
            { textKey: 'surveys.audit.answers.q2a2', value: 2 },
            { textKey: 'surveys.audit.answers.q2a3', value: 3 },
            { textKey: 'surveys.audit.answers.q2a4', value: 4 },
        ],
        'q9': [
            { textKey: 'surveys.common.no', value: 0 },
            { textKey: 'surveys.audit.answers.q9a1', value: 2 },
            { textKey: 'surveys.audit.answers.q9a2', value: 4 },
        ],
    },
    scoringMap: {
        score: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'],
    },
    interpretationThresholds: {
        score: { moderate: 8, high: 20 }, // >=8: Hazardous, >=20: Likely dependence
    },
};
