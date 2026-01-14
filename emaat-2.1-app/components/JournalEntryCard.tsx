import React, { FC } from 'react';
import { JournalEntry, JournalQuestion } from '../journals/types';
import { JOURNAL_CONFIG } from '../journals';
import { useLanguage } from '../contexts/LanguageContext';
import { useAsset } from '../hooks/useAsset';
import { SpinnerIcon, LockIcon } from './Icons';

const MemoryPhoto: FC<{ memoryKey: string }> = ({ memoryKey }) => {
    const [photoUrl, loading] = useAsset(memoryKey);

    if (loading) {
        return <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0"><SpinnerIcon className="w-6 h-6 text-gray-400 animate-spin" /></div>;
    }

    if (photoUrl) {
        return <img src={photoUrl} alt="memory" className="w-16 h-16 rounded-md object-cover flex-shrink-0" />;
    }

    return null;
}

const JournalEntryCard: FC<{ entry: JournalEntry }> = ({ entry }) => {
    const { t, language } = useLanguage();
    const config = JOURNAL_CONFIG[entry.journalId];
    if (!config) return null;
    
    const Icon = config.icon;
    const color = 'text-teal-500';

    const formatDate = (date: Date) => new Intl.DateTimeFormat(language === 'nl' ? 'nl-NL' : 'en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(date);

    const dataEntries = Object.entries(entry.data).filter(([key, value]) => value !== '' && value !== null && value !== undefined);

    return (
        <li className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-start">
                <div className={`mt-1 p-3 rounded-full bg-gray-100 ${color}`}><Icon className="w-6 h-6" /></div>
                <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-brand-dark">{t(config.nameKey)}</p>
                            <p className="text-sm text-gray-500">{formatDate(entry.timestamp)}</p>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-brand-secondary">
                            <p>+5 {t('common.pointsAbbreviation')}</p>
                        </div>
                    </div>
                    
                    {dataEntries.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                           {dataEntries.map(([key, value]) => {
                                const question = config.questions.find(q => q.id === key);
                                if (!question) return null;
                                
                                let displayValue = String(value);
                                if (question.type === 'yes-no') {
                                    displayValue = value === 'yes' ? t('common.yes') : t('common.no');
                                }

                                return (
                                    <div key={key} className="text-sm">
                                        <p className="font-semibold text-gray-600">{t(question.labelKey)}</p>
                                        <p className="text-gray-800 pl-2">{displayValue}</p>
                                    </div>
                                );
                           })}
                        </div>
                    )}

                    {entry.memory && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-3">
                            {entry.memory.photoUrl && <MemoryPhoto memoryKey={entry.memory.photoUrl} />}
                            <div className="flex-grow space-y-2">
                                {entry.memory.isPrivate && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                        <LockIcon className="w-3 h-3"/>
                                        <span>{t('common.private')}</span>
                                    </div>
                                )}
                                {entry.memory.content && (<p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded-md">"{entry.memory.content.substring(0, 100)}{entry.memory.content.length > 100 ? '...' : ''}"</p>)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
};

export default JournalEntryCard;
