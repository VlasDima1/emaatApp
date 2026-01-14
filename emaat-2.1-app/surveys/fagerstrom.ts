import { Survey } from '../types';
import { SmokingIcon } from '../components/Icons';

export const fagerstromSurvey: Survey = {
    id: 'fagerstrom',
    nameKey: 'surveys.fagerstrom.name',
    descriptionKey: 'surveys.fagerstrom.description',
    icon: SmokingIcon,
    questions: [
        { id: 'q1', textKey: 'surveys.fagerstrom.questions.q1', answerOptionsKey: 'q1' },
        { id: 'q2', textKey: 'surveys.fagerstrom.questions.q2', answerOptionsKey: 'q2' },
        { id: 'q3', textKey: 'surveys.fagerstrom.questions.q3', answerOptionsKey: 'q3' },
        { id: 'q4', textKey: 'surveys.fagerstrom.questions.q4', answerOptionsKey: 'q4' },
        { id: 'q5', textKey: 'surveys.fagerstrom.questions.q5', answerOptionsKey: 'q5' },
        { id: 'q6', textKey: 'surveys.fagerstrom.questions.q6', answerOptionsKey: 'q6' },
    ],
    answerOptions: {
        'q1': [
            { textKey: 'surveys.fagerstrom.answers.q1a0', value: 3 },
            { textKey: 'surveys.fagerstrom.answers.q1a1', value: 2 },
            { textKey: 'surveys.fagerstrom.answers.q1a2', value: 1 },
            { textKey: 'surveys.fagerstrom.answers.q1a3', value: 0 },
        ],
        'q2': [
            { textKey: 'surveys.common.yes', value: 1 },
            { textKey: 'surveys.common.no', value: 0 },
        ],
        'q3': [
            { textKey: 'surveys.fagerstrom.answers.q3a0', value: 1 },
            { textKey: 'surveys.fagerstrom.answers.q3a1', value: 0 },
        ],
        'q4': [
            { textKey: 'surveys.fagerstrom.answers.q4a0', value: 3 },
            { textKey: 'surveys.fagerstrom.answers.q4a1', value: 2 },
            { textKey: 'surveys.fagerstrom.answers.q4a2', value: 1 },
            { textKey: 'surveys.fagerstrom.answers.q4a3', value: 0 },
        ],
        'q5': [
            { textKey: 'surveys.common.yes', value: 1 },
            { textKey: 'surveys.common.no', value: 0 },
        ],
        'q6': [
            { textKey: 'surveys.common.yes', value: 1 },
            { textKey: 'surveys.common.no', value: 0 },
        ],
    },
    scoringMap: {
        score: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'],
    },
    interpretationThresholds: {
        // Levels: 0-2 (Very Low), 3-4 (Low), 5 (Medium), 6-7 (High), 8-10 (Very High)
        // Mapping to low/moderate/high
        score: { moderate: 5, high: 8 },
    },
};