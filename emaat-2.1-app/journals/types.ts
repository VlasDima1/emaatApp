
import { Memory } from '../types';

export type JournalId = 'klachtenDagboek' | 'hoofdpijnDagboek' | 'buikpijnDagboek' | 'astmaCopdDagboek' | 'hartfalenDagboek' | 'angstStressDagboek';

// --- Specific Journal Data Interfaces ---

export interface KlachtenDagboekData {
    klacht: string;
    ernst: number;
    beginmoment: string;
    context: string;
    gedachten: string;
    gevoelens: string;
    gedrag: string;
    effect: string;
    reacties: string;
}

export interface HoofdpijnDagboekData {
    aanval: 'yes' | 'no';
    startDuur?: string;
    pijnscore?: number;
    locatieType?: string;
    begeleidendeKlachten?: string;
    triggers?: string;
    medicatie?: string;
    activiteitenbeperking?: string;
}

export interface BuikpijnDagboekData {
    pijnscore: number;
    ontlasting: string; // Could be number for Bristol score
    voeding: string;
    opgeblazen: number;
    stress: number;
    bewegen: string;
    andereKlachten: string;
    triggers: string;
}

export interface AstmaCopdDagboekData {
    benauwdheid: number;
    hoesten: string;
    slijm: string;
    nachtelijkeKlachten: 'yes' | 'no';
    inspanningstolerantie: string;
    luchtwegverwijder: string;
    triggers: string;
    aanvallen: string;
}

export interface HartfalenDagboekData {
    gewicht: number;
    gewichtsverandering: 'yes' | 'no';
    benauwdheid: number;
    oedeem: 'yes' | 'no';
    nachtelijkPlassen: number;
    vermoeidheid: string;
    etenDrinken: string;
    medicatie: string;
}

export interface AngstStressDagboekData {
    situatie: string;
    angstStress: number;
    gedachten: string;
    lichamelijkeReacties: string;
    gedrag: string;
    alternatieveGedachte: string;
    watHielp: string;
    effectAchteraf: string;
}

// FIX: Update `JournalEntryData` to be an intersection of `Partial` types for each specific journal data interface. This change resolves a type error where `keyof JournalEntryData` was incorrectly inferred as `never`, allowing string literals to be correctly assigned as question IDs.
export type JournalEntryData = 
    Partial<KlachtenDagboekData> &
    Partial<HoofdpijnDagboekData> &
    Partial<BuikpijnDagboekData> &
    Partial<AstmaCopdDagboekData> &
    Partial<HartfalenDagboekData> &
    Partial<AngstStressDagboekData>;

export interface JournalEntry {
    id: string;
    journalId: JournalId;
    timestamp: Date;
    data: Partial<JournalEntryData>;
    memory?: Memory;
}

export type JournalQuestionType = 'text' | 'slider' | 'yes-no' | 'textarea' | 'time' | 'bristol-scale';

export interface JournalQuestion {
    id: keyof JournalEntryData;
    labelKey: string;
    type: JournalQuestionType;
    required?: boolean;
    placeholderKey?: string;
    min?: number;
    max?: number;
    step?: number;
}