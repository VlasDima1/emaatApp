import { Survey } from '../../types';
import { ClipboardDocumentListIcon } from '../../components/Icons';

export const fourDKLSurvey: Survey = {
    id: 'fourDKL',
    nameKey: 'surveys.fourDKL.name',
    descriptionKey: 'surveys.fourDKL.description',
    icon: ClipboardDocumentListIcon,
    questions: Array.from({ length: 50 }, (_, i) => ({
        id: `q${i + 1}`,
        textKey: `surveys.fourDKL.questions.q${i + 1}`,
        answerOptionsKey: 'default',
    })),
    answerOptions: {
        'default': [
            { textKey: 'surveys.answers.no', value: 0 },
            { textKey: 'surveys.answers.sometimes', value: 1 },
            { textKey: 'surveys.answers.regularly', value: 2 },
            { textKey: 'surveys.answers.often', value: 2 },
            { textKey: 'surveys.answers.veryOften', value: 2 },
        ]
    },
    scoringMap: {
        distress: ['q17', 'q19', 'q20', 'q22', 'q25', 'q26', 'q28', 'q29', 'q32', 'q36', 'q37', 'q38', 'q39', 'q41', 'q47', 'q48'],
        depression: ['q30', 'q31', 'q33', 'q34', 'q35', 'q46'],
        anxiety: ['q11', 'q18', 'q21', 'q24', 'q27', 'q40', 'q42', 'q43', 'q44', 'q45', 'q49', 'q50'],
        somatization: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q12', 'q13', 'q14', 'q15', 'q16', 'q23'],
    },
    interpretationThresholds: {
        distress: { moderate: 11, high: 21 },
        depression: { moderate: 3, high: 6 },
        anxiety: { moderate: 4, high: 10 },
        somatization: { moderate: 11, high: 21 },
    },
};
