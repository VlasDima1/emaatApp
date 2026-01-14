import React, { FC, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { JournalId, JournalEntry, JournalEntryData } from '../../journals/types';
import { JOURNAL_CONFIG } from '../../journals';
import { XIcon } from '../Icons';
import AddMemorySubform from '../AddMemorySubform';
import { Memory } from '../../types';
import Slider from '../Slider';

interface LogJournalScreenProps {
    journalId: JournalId;
    onSave: (entry: JournalEntry) => void;
    onClose: () => void;
}

const LogJournalScreen: FC<LogJournalScreenProps> = ({ journalId, onSave, onClose }) => {
    const { t } = useLanguage();
    const config = JOURNAL_CONFIG[journalId];
    const Icon = config.icon;

    const [formData, setFormData] = useState<Partial<JournalEntryData>>({});
    const [memory, setMemory] = useState<Memory | undefined>();

    const handleFormChange = (field: keyof JournalEntryData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleSave = () => {
        const newEntry: JournalEntry = {
            id: `journal-${journalId}-${Date.now()}`,
            journalId,
            timestamp: new Date(),
            data: formData,
            memory,
        };
        onSave(newEntry);
    };

    const isSubmitDisabled = config.questions.some(q => q.required && formData[q.id as keyof typeof formData] === undefined);

    return (
        <div className="min-h-screen bg-brand-light font-sans p-4 flex flex-col justify-center items-center animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <header className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-gray-100 text-teal-500"><Icon className="w-6 h-6" /></div>
                        <h3 className="text-2xl font-bold text-brand-dark">{t(config.nameKey)}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6"/></button>
                </header>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {config.questions.map(q => (
                        <div key={q.id}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t(q.labelKey)} {q.required && <span className="text-red-500">*</span>}
                            </label>
                            {q.type === 'text' && (
                                <input
                                    type="text"
                                    value={(formData[q.id as keyof typeof formData] as string) || ''}
                                    onChange={e => handleFormChange(q.id, e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            )}
                             {q.type === 'textarea' && (
                                <textarea
                                    value={(formData[q.id as keyof typeof formData] as string) || ''}
                                    onChange={e => handleFormChange(q.id, e.target.value)}
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            )}
                            {q.type === 'slider' && (
                                <Slider 
                                    value={(formData[q.id as keyof typeof formData] as number) || 0}
                                    onChange={value => handleFormChange(q.id, value)}
                                    minLabel={String(q.min)}
                                    maxLabel={String(q.max)}
                                />
                            )}
                             {q.type === 'yes-no' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => handleFormChange(q.id, 'yes')} className={`py-2 rounded-lg font-semibold ${formData[q.id as keyof typeof formData] === 'yes' ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}>{t('common.yes')}</button>
                                    <button onClick={() => handleFormChange(q.id, 'no')} className={`py-2 rounded-lg font-semibold ${formData[q.id as keyof typeof formData] === 'no' ? 'bg-rose-500 text-white' : 'bg-gray-200'}`}>{t('common.no')}</button>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    <AddMemorySubform onMemoryChange={setMemory} />
                </div>


                <div className="mt-6 pt-6 border-t">
                    <button onClick={handleSave} disabled={isSubmitDisabled} className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">
                        {t('journals.saveEntry')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogJournalScreen;
