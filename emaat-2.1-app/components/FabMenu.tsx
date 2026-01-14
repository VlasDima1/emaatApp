
import React, { useState, FC } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { PlusIcon, ClipboardPlusIcon, DumbbellIcon, XIcon, ClipboardDocumentListIcon, SmokingIcon, PencilIcon, UtensilsIcon, BeakerIcon } from './Icons';
import { ChallengeState, JournalId } from '../types';

interface FabMenuProps {
    onLogActivity: () => void;
    onLogMeasurement: () => void;
    onFillSurvey: () => void;
    onLogSmoke: () => void;
    onLogJournal: () => void;
    onOpenChatbot: () => void;
    onLogSnack?: () => void;
    onLogDrink?: () => void;
    challenge?: ChallengeState;
    activeJournal?: JournalId;
}

const FabMenu: FC<FabMenuProps> = ({ onLogActivity, onLogMeasurement, onFillSurvey, onLogSmoke, onLogJournal, onOpenChatbot, onLogSnack, onLogDrink, challenge, activeJournal }) => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuItems = [
        ...(challenge?.id === 'voedingChallenge' && onLogSnack ? [{ labelKey: 'mainScreen.logSnack', icon: UtensilsIcon, action: onLogSnack }] : []),
        ...(challenge?.id === 'voedingChallenge' && onLogDrink ? [{ labelKey: 'mainScreen.logDrink', icon: BeakerIcon, action: onLogDrink }] : []),
        ...(challenge?.id === 'stopRokenChallenge' ? [{ labelKey: 'mainScreen.logSmoke', icon: SmokingIcon, action: onLogSmoke }] : []),
        ...(activeJournal ? [{ labelKey: 'journals.logEntry', icon: PencilIcon, action: onLogJournal }] : []),
        { labelKey: 'surveys.fillSurvey', icon: ClipboardDocumentListIcon, action: onFillSurvey },
        { labelKey: 'mainScreen.logMeasurement', icon: ClipboardPlusIcon, action: onLogMeasurement },
        { labelKey: 'mainScreen.logHealthyStep', icon: DumbbellIcon, action: onLogActivity },
    ];

    const handleAction = (action: () => void) => {
        action();
        setIsOpen(false);
    };


    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-51 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleMenu}
                aria-hidden={!isOpen}
            />
            <div className="fixed bottom-24 right-6 z-52 md:bottom-6">
                {isOpen && (
                    <div className="flex flex-col items-end gap-4 mb-4">
                        {menuItems.map((item, index) => (
                             <div key={item.labelKey} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                <div className="bg-white/90 text-sm font-semibold text-brand-dark px-3 py-1.5 rounded-lg shadow-md">
                                    {t(item.labelKey)}
                                </div>
                                <button
                                    onClick={() => handleAction(item.action)}
                                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                                >
                                    <item.icon className="w-6 h-6 text-brand-primary" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                 <button onClick={toggleMenu} className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-xl hover:bg-indigo-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300">
                    {isOpen ? <XIcon className="w-8 h-8" /> : <PlusIcon className="w-8 h-8" />}
                </button>
            </div>
        </>
    );
};

export default FabMenu;
