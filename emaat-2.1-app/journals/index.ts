import React from 'react';
import { JournalId, JournalQuestion } from './types';
import { BookOpenIcon, HeartPulseIcon, BeakerIcon, LungsIcon, HeartIcon, ShieldExclamationIcon, BrainCircuitIcon, UtensilsIcon } from '../components/Icons';

export const JOURNAL_CONFIG: Record<JournalId, { 
    nameKey: string; 
    descriptionKey: string; 
    icon: React.ComponentType<{ className?: string }>;
    questions: JournalQuestion[];
}> = {
    klachtenDagboek: {
        nameKey: 'journals.klachtenDagboek.name',
        descriptionKey: 'journals.klachtenDagboek.description',
        icon: BeakerIcon,
        questions: [
            { id: 'klacht', labelKey: 'journals.klachtenDagboek.q.klacht', type: 'text', required: true },
            { id: 'ernst', labelKey: 'journals.klachtenDagboek.q.ernst', type: 'slider', min: 0, max: 10, step: 1, required: true },
            { id: 'beginmoment', labelKey: 'journals.klachtenDagboek.q.beginmoment', type: 'text' },
            { id: 'context', labelKey: 'journals.klachtenDagboek.q.context', type: 'textarea' },
            { id: 'gedachten', labelKey: 'journals.klachtenDagboek.q.gedachten', type: 'textarea' },
            { id: 'gevoelens', labelKey: 'journals.klachtenDagboek.q.gevoelens', type: 'textarea' },
            { id: 'gedrag', labelKey: 'journals.klachtenDagboek.q.gedrag', type: 'textarea' },
            { id: 'effect', labelKey: 'journals.klachtenDagboek.q.effect', type: 'textarea' },
            { id: 'reacties', labelKey: 'journals.klachtenDagboek.q.reacties', type: 'textarea' },
        ],
    },
    hoofdpijnDagboek: {
        nameKey: 'journals.hoofdpijnDagboek.name',
        descriptionKey: 'journals.hoofdpijnDagboek.description',
        icon: BrainCircuitIcon,
        questions: [
            { id: 'aanval', labelKey: 'journals.hoofdpijnDagboek.q.aanval', type: 'yes-no', required: true },
            { id: 'startDuur', labelKey: 'journals.hoofdpijnDagboek.q.startDuur', type: 'text' },
            { id: 'pijnscore', labelKey: 'journals.hoofdpijnDagboek.q.pijnscore', type: 'slider', min: 0, max: 10, step: 1 },
            { id: 'locatieType', labelKey: 'journals.hoofdpijnDagboek.q.locatieType', type: 'text' },
            { id: 'begeleidendeKlachten', labelKey: 'journals.hoofdpijnDagboek.q.begeleidendeKlachten', type: 'textarea' },
            { id: 'triggers', labelKey: 'journals.hoofdpijnDagboek.q.triggers', type: 'textarea' },
            { id: 'medicatie', labelKey: 'journals.hoofdpijnDagboek.q.medicatie', type: 'textarea' },
            { id: 'activiteitenbeperking', labelKey: 'journals.hoofdpijnDagboek.q.activiteitenbeperking', type: 'textarea' },
        ],
    },
    buikpijnDagboek: {
        nameKey: 'journals.buikpijnDagboek.name',
        descriptionKey: 'journals.buikpijnDagboek.description',
        icon: UtensilsIcon,
        questions: [
            { id: 'pijnscore', labelKey: 'journals.buikpijnDagboek.q.pijnscore', type: 'slider', min: 0, max: 10, step: 1 },
            { id: 'ontlasting', labelKey: 'journals.buikpijnDagboek.q.ontlasting', type: 'text' },
            { id: 'voeding', labelKey: 'journals.buikpijnDagboek.q.voeding', type: 'textarea' },
            { id: 'opgeblazen', labelKey: 'journals.buikpijnDagboek.q.opgeblazen', type: 'slider', min: 0, max: 10, step: 1 },
            { id: 'stress', labelKey: 'journals.buikpijnDagboek.q.stress', type: 'slider', min: 0, max: 10, step: 1 },
            { id: 'bewegen', labelKey: 'journals.buikpijnDagboek.q.bewegen', type: 'text' },
            { id: 'andereKlachten', labelKey: 'journals.buikpijnDagboek.q.andereKlachten', type: 'textarea' },
            { id: 'triggers', labelKey: 'journals.buikpijnDagboek.q.triggers', type: 'textarea' },
        ],
    },
    astmaCopdDagboek: {
        nameKey: 'journals.astmaCopdDagboek.name',
        descriptionKey: 'journals.astmaCopdDagboek.description',
        icon: LungsIcon,
        questions: [
            { id: 'benauwdheid', labelKey: 'journals.astmaCopdDagboek.q.benauwdheid', type: 'slider', min: 0, max: 10, step: 1 },
            { id: 'hoesten', labelKey: 'journals.astmaCopdDagboek.q.hoesten', type: 'text' },
            { id: 'slijm', labelKey: 'journals.astmaCopdDagboek.q.slijm', type: 'text' },
            { id: 'nachtelijkeKlachten', labelKey: 'journals.astmaCopdDagboek.q.nachtelijkeKlachten', type: 'yes-no' },
            { id: 'inspanningstolerantie', labelKey: 'journals.astmaCopdDagboek.q.inspanningstolerantie', type: 'textarea' },
            { id: 'luchtwegverwijder', labelKey: 'journals.astmaCopdDagboek.q.luchtwegverwijder', type: 'text' },
            { id: 'triggers', labelKey: 'journals.astmaCopdDagboek.q.triggers', type: 'textarea' },
            { id: 'aanvallen', labelKey: 'journals.astmaCopdDagboek.q.aanvallen', type: 'textarea' },
        ],
    },
    hartfalenDagboek: {
        nameKey: 'journals.hartfalenDagboek.name',
        descriptionKey: 'journals.hartfalenDagboek.description',
        icon: HeartIcon,
        questions: [
            { id: 'gewicht', labelKey: 'journals.hartfalenDagboek.q.gewicht', type: 'text', required: true },
            { id: 'gewichtsverandering', labelKey: 'journals.hartfalenDagboek.q.gewichtsverandering', type: 'yes-no' },
            { id: 'benauwdheid', labelKey: 'journals.hartfalenDagboek.q.benauwdheid', type: 'slider', min: 0, max: 10, step: 1 },
            { id: 'oedeem', labelKey: 'journals.hartfalenDagboek.q.oedeem', type: 'yes-no' },
            { id: 'nachtelijkPlassen', labelKey: 'journals.hartfalenDagboek.q.nachtelijkPlassen', type: 'text' },
            { id: 'vermoeidheid', labelKey: 'journals.hartfalenDagboek.q.vermoeidheid', type: 'textarea' },
            { id: 'etenDrinken', labelKey: 'journals.hartfalenDagboek.q.etenDrinken', type: 'textarea' },
            { id: 'medicatie', labelKey: 'journals.hartfalenDagboek.q.medicatie', type: 'textarea' },
        ],
    },
    angstStressDagboek: {
        nameKey: 'journals.angstStressDagboek.name',
        descriptionKey: 'journals.angstStressDagboek.description',
        icon: ShieldExclamationIcon,
        questions: [
            { id: 'situatie', labelKey: 'journals.angstStressDagboek.q.situatie', type: 'textarea' },
            { id: 'angstStress', labelKey: 'journals.angstStressDagboek.q.angstStress', type: 'slider', min: 0, max: 10, step: 1 },
            { id: 'gedachten', labelKey: 'journals.angstStressDagboek.q.gedachten', type: 'textarea' },
            { id: 'lichamelijkeReacties', labelKey: 'journals.angstStressDagboek.q.lichamelijkeReacties', type: 'textarea' },
            { id: 'gedrag', labelKey: 'journals.angstStressDagboek.q.gedrag', type: 'textarea' },
            { id: 'alternatieveGedachte', labelKey: 'journals.angstStressDagboek.q.alternatieveGedachte', type: 'textarea' },
            { id: 'watHielp', labelKey: 'journals.angstStressDagboek.q.watHielp', type: 'textarea' },
            { id: 'effectAchteraf', labelKey: 'journals.angstStressDagboek.q.effectAchteraf', type: 'textarea' },
        ],
    },
};
