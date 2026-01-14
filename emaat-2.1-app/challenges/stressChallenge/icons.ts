
import React from 'react';
import { 
    BrainCircuitIcon, ClockIcon, DumbbellIcon, FireIcon, HeartIcon, LeafIcon, PencilIcon,
    PlusIcon, SpeakerIcon, StarIcon, UsersIcon, UtensilsIcon, XCircleIcon, BedIcon, AwardIcon, ClipboardListIcon,
    HomeIcon, ScaleIcon, WindIcon, TreesIcon, HeartPulseIcon,
    ShieldExclamationIcon
} from '../../components/Icons';

export const stressChallengeIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    FightOrFlightIcon: FireIcon,
    RestAndDigestIcon: LeafIcon,
    HeartIcon: HeartIcon,
    ImmuneSystemIcon: ShieldExclamationIcon,
    DigestionIcon: UtensilsIcon,
    BrainIcon: BrainCircuitIcon,
    BreatheIcon: WindIcon,
    MindfulnessIcon: LeafIcon,
    BodyScanIcon: DumbbellIcon,
    WalkIcon: DumbbellIcon,
    NutritionIcon: UtensilsIcon,
    SleepIcon: BedIcon,
    JournalIcon: PencilIcon,
    SocialIcon: UsersIcon,
    BoundariesIcon: ShieldExclamationIcon,
    HobbyIcon: StarIcon,
    ToolkitIcon: ClipboardListIcon,
    TrophyIcon: AwardIcon,
    PencilIcon: PencilIcon,
    HomeIcon: HomeIcon,
    EnergyIcon: FireIcon,
    FocusIcon: BrainCircuitIcon,
    DecisionIcon: PencilIcon,
    MemoryIcon: BrainCircuitIcon,
    StressIcon: LeafIcon,
    HealthIcon: HeartIcon,
    MoodIcon: HeartIcon,
    LeafIcon: LeafIcon,
    XCircleIcon: XCircleIcon,
    ClockIcon: ClockIcon,
    ScaleIcon: ScaleIcon,
};
