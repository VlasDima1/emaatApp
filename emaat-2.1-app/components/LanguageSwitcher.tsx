

import React, { FC } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageSwitcherProps {
  theme?: 'light' | 'dark';
}

const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ theme = 'light' }) => {
  const { language, setLanguage } = useLanguage();

  const containerClass = theme === 'light' 
    ? "flex items-center space-x-1 bg-gray-200 rounded-full p-0.5 flex-wrap justify-center gap-1"
    : "flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-full p-0.5 flex-wrap justify-center gap-1";
  
  const activeButtonClass = 'bg-white text-brand-primary shadow';
    
  const inactiveButtonClass = theme === 'light'
    ? 'text-gray-500'
    : 'text-white/70 hover:text-white';

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'pl', name: 'Polski' },
    { code: 'pap', name: 'Papiamentu' },
    { code: 'ar', name: 'العربية' },
    { code: 'ar-MA', name: 'الدارجة' },
  ];

  return (
    <div className={containerClass}>
      {languages.map(lang => (
        <button 
          key={lang.code}
          onClick={() => setLanguage(lang.code as any)} 
          className={`px-3 py-1.5 text-sm font-bold rounded-full transition-colors ${language === lang.code ? activeButtonClass : inactiveButtonClass}`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;