
import { Language } from './types';
import { fourDKLTranslations } from './surveys/fourDKL/translations';
import { phq9Translations } from './surveys/phq9/translations';
import { gad7Translations } from './surveys/gad7/translations';
import { auditTranslations } from './surveys/audit/translations';
import { catTranslations } from './surveys/cat/translations';
import { vasPainTranslations } from './surveys/vasPain/translations';
import { gfiTranslations } from './surveys/gfi/translations';
import { hadsTranslations } from './surveys/hads/translations';
import { fagerstromTranslations } from './surveys/fagerstrom/translations';
import { mmrcTranslations } from './surveys/mmrc/translations';
import { pam13Translations } from './surveys/pam13/translations';
import { ccqTranslations } from './surveys/ccq/translations';
import { zlmTranslations } from './surveys/zlm/translations';
import { sleepChallengeTranslations } from './challenges/sleepChallenge/translations';
import { beweegChallengeTranslations } from './challenges/beweegChallenge/translations';
import { voedingChallengeTranslations } from './challenges/voedingChallenge/translations';
import { stopRokenChallengeTranslations } from './challenges/stopRokenChallenge/translations';
import { socialChallengeTranslations } from './challenges/socialChallenge/translations';
import { stressChallengeTranslations } from './challenges/stressChallenge/translations';
import { commonTranslations } from './translations/common';
import { entitiesTranslations } from './translations/entities';
import { measurementsTranslations } from './translations/measurements';
import { screensTranslations } from './translations/screens';
import { journalTranslations } from './journals/translations';

// --- NEW ROBUST TRANSLATION AGGREGATION STRATEGY ---

type TranslationModule = Partial<Record<Language, object>>;

// Define all modules in one place for easy maintenance and scalability.
const surveyModules: TranslationModule[] = [
  fourDKLTranslations, phq9Translations, gad7Translations, auditTranslations, catTranslations,
  vasPainTranslations, gfiTranslations, hadsTranslations, fagerstromTranslations, mmrcTranslations, pam13Translations, ccqTranslations, zlmTranslations
];

const challengeModules: TranslationModule[] = [
  sleepChallengeTranslations, beweegChallengeTranslations, voedingChallengeTranslations,
  stopRokenChallengeTranslations, socialChallengeTranslations, stressChallengeTranslations,
];

const coreModules: TranslationModule[] = [
  commonTranslations, entitiesTranslations, measurementsTranslations, screensTranslations, journalTranslations
];

// A robust deep merge utility to combine translation objects.
function isObject(item: any): item is object {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target: any, ...sources: any[]): any {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject((source as any)[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], (source as any)[key]);
            } else {
                Object.assign(target, { [key]: (source as any)[key] });
            }
        }
    }
    return mergeDeep(target, ...sources);
}

// This function automatically builds a complete, merged translation bundle for each supported language.
// It gracefully handles modules that may not yet have translations for a new language, preventing crashes.
function buildLanguageBundles() {
    const languages: Language[] = ['en', 'nl', 'tr', 'fr', 'es', 'de', 'ar', 'ar-MA', 'pap', 'pl'];
    const bundles: Partial<Record<Language, any>> = {};

    for (const lang of languages) {
        // 1. Merge all core translation files.
        const coreBundle = coreModules.reduce((acc: Record<string, any>, module) => {
            if (module[lang]) {
                mergeDeep(acc, module[lang]);
            }
            return acc;
        }, {});
        
        // 2. Aggregate all survey translations into a single 'surveys' object.
        const surveyBundle = surveyModules.reduce((acc: Record<string, any>, module) => {
            if (module[lang]) {
                mergeDeep(acc, module[lang]);
            }
            return acc;
        }, {});

        // 3. Aggregate all challenge translations into a single 'challenge' object.
        const challengeBundle = challengeModules.reduce((acc: Record<string, any>, module) => {
            if (module[lang]) {
                mergeDeep(acc, module[lang]);
            }
            return acc;
        }, {});
        
        // 4. Intelligently combine the core, survey, and challenge bundles.
        const finalBundle = coreBundle;
        if (Object.keys(surveyBundle).length > 0) {
            // Deep merge into the 'surveys' key, preserving any existing keys from screens.ts.
            if (!finalBundle.surveys) finalBundle.surveys = {};
            mergeDeep(finalBundle.surveys, surveyBundle);
        }
        if (Object.keys(challengeBundle).length > 0) {
            // Deep merge into the 'challenge' key.
            if (!finalBundle.challenge) finalBundle.challenge = {};
            mergeDeep(finalBundle.challenge, challengeBundle);
        }
        
        bundles[lang] = finalBundle;
    }

    return bundles as Record<Language, any>;
}

// The final, safely constructed translations object.
export const translations = buildLanguageBundles();
