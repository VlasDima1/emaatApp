
import React from 'react';
import { Domain } from '../types';
import {
    SleepIcon, MovementIcon, NutritionIcon, StressIcon,
    SocialIcon, StopSmokingIcon, AlcoholIcon, RelaxationIcon, PurposeIcon, FinancesIcon, HeartIcon
} from '../components/icons';

export interface DomainMeta {
    colorHex: string;
    colorClass: string;
    icon: React.FC<{ className?: string }>;
    unit: string;
}

export const DOMAIN_META: Record<Domain, DomainMeta> = {
    [Domain.Slaap]: { colorHex: '#6366f1', colorClass: 'bg-indigo-500', icon: SleepIcon, unit: 'uur' },
    [Domain.Beweeg]: { colorHex: '#22c55e', colorClass: 'bg-green-500', icon: MovementIcon, unit: 'stappen' },
    [Domain.Voeding]: { colorHex: '#f97316', colorClass: 'bg-orange-500', icon: NutritionIcon, unit: 'score' },
    [Domain.Stress]: { colorHex: '#f59e0b', colorClass: 'bg-amber-500', icon: StressIcon, unit: 'score' },
    [Domain.Sociaal]: { colorHex: '#a855f7', colorClass: 'bg-purple-500', icon: SocialIcon, unit: 'score' },
    [Domain.Roken]: { colorHex: '#64748b', colorClass: 'bg-slate-500', icon: StopSmokingIcon, unit: 'sigaretten' },
    [Domain.Alcohol]: { colorHex: '#ef4444', colorClass: 'bg-red-500', icon: AlcoholIcon, unit: 'eenheden' },
    [Domain.Ontspanning]: { colorHex: '#14b8a6', colorClass: 'bg-teal-500', icon: RelaxationIcon, unit: 'score' },
    [Domain.Zingeving]: { colorHex: '#f43f5e', colorClass: 'bg-rose-500', icon: PurposeIcon, unit: 'score' },
    [Domain.Financien]: { colorHex: '#06b6d4', colorClass: 'bg-cyan-500', icon: FinancesIcon, unit: 'score' },
    [Domain.Hartfalen]: { colorHex: '#dc2626', colorClass: 'bg-red-600', icon: HeartIcon, unit: 'score' },
};

export const getDomainMeta = (domain: Domain): DomainMeta => {
    return DOMAIN_META[domain] || { colorHex: '#64748b', colorClass: 'bg-gray-500', icon: null, unit: 'score' };
};
