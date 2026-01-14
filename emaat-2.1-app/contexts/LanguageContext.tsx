import React, { createContext, useContext, useCallback, useState, FC } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('nl');

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    const keys = key.split('.');
    
    let translation = keys.reduce((acc, currentKey) => acc?.[currentKey], translations[language]);

    if (translation === undefined) {
      translation = keys.reduce((acc, currentKey) => acc?.[currentKey], translations['en']);
    }

    let finalTranslation = translation !== undefined ? String(translation) : key;

    if (typeof finalTranslation !== 'string') {
        console.warn(`Translation for key "${key}" is not a string.`);
        return key;
    }

    if (replacements) {
        Object.entries(replacements).forEach(([keyToReplace, value]) => {
            finalTranslation = finalTranslation.replace(`{${keyToReplace}}`, String(value));
        });
    }
    return finalTranslation;
  }, [language]);

  const value = { language, setLanguage, t };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};