import React, { FC } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { HomeIcon, ClipboardListIcon, SettingsIcon, CalendarIcon, ChartBarIcon } from './Icons';

type MainView = 'timeline' | 'plan' | 'agenda' | 'stats' | 'settings';

interface BottomNavBarProps {
    activeView: MainView;
    onNavigate: (viewName: MainView) => void;
}

const NavItem: FC<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => {
    const activeClass = 'text-brand-primary';
    const inactiveClass = 'text-gray-500';
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? activeClass : inactiveClass} hover:text-brand-primary`}
        >
            <Icon className="w-6 h-6 mb-1" />
            <span className={`text-xs font-bold ${isActive ? 'text-brand-primary' : 'text-gray-600'}`}>{label}</span>
        </button>
    );
};

const BottomNavBar: FC<BottomNavBarProps> = ({ activeView, onNavigate }) => {
    const { t } = useLanguage();
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around max-w-2xl mx-auto">
                <NavItem
                    icon={HomeIcon}
                    label={t('nav.timeline')}
                    isActive={activeView === 'timeline'}
                    onClick={() => onNavigate('timeline')}
                />
                <NavItem
                    icon={ClipboardListIcon}
                    label={t('nav.plan')}
                    isActive={activeView === 'plan'}
                    onClick={() => onNavigate('plan')}
                />
                <NavItem
                    icon={CalendarIcon}
                    label={t('nav.agenda')}
                    isActive={activeView === 'agenda'}
                    onClick={() => onNavigate('agenda')}
                />
                 <NavItem
                    icon={ChartBarIcon}
                    label={t('nav.stats')}
                    isActive={activeView === 'stats'}
                    onClick={() => onNavigate('stats')}
                />
                <NavItem
                    icon={SettingsIcon}
                    label={t('nav.settings')}
                    isActive={activeView === 'settings'}
                    onClick={() => onNavigate('settings')}
                />
            </div>
        </nav>
    );
};

export default BottomNavBar;