import React from 'react';
import { 
    BrainCircuitIcon, ClockIcon, DumbbellIcon, FireIcon, HeartIcon, LeafIcon, PencilIcon,
    PlusIcon, SpeakerIcon, StarIcon, UsersIcon, UtensilsIcon, XCircleIcon, BedIcon, AwardIcon, ClipboardListIcon,
    HomeIcon, ScaleIcon, WindIcon, TreesIcon
} from '../../components/Icons';

export const beweegChallengeIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    EnergyIcon: FireIcon,
    FocusIcon: BrainCircuitIcon,
    DecisionIcon: PencilIcon,
    MemoryIcon: BrainCircuitIcon,
    StressIcon: LeafIcon,
    HealthIcon: HeartIcon,
    ImmuneSystemIcon: FireIcon, // Re-using for weerstand
    MoodIcon: HeartIcon,
    QualityOfLifeIcon: StarIcon, // New mapping
    RoutineIcon: ClockIcon,
    GoalIcon: AwardIcon, // New mapping
    ExerciseIcon: DumbbellIcon,
    PauseIcon: ClockIcon, // New mapping for 'pauze'
    TravelIcon: WindIcon, // New mapping
    GroupIcon: UsersIcon,
    SportClubIcon: DumbbellIcon, // New mapping
    NutritionIcon: UtensilsIcon,
    MusicIcon: SpeakerIcon,
    CoachIcon: UsersIcon, // New mapping
    FunIcon: StarIcon, // New mapping
    MusclesIcon: DumbbellIcon,
    BonesIcon: ScaleIcon, // Using scale as a proxy for bone density
    BloodVesselsIcon: HeartIcon,
    DigestionIcon: UtensilsIcon,
    BrainActivityIcon: BrainCircuitIcon, // More specific than BrainIcon
    SkinIcon: HomeIcon, // Placeholder
    HeartDiseaseIcon: HeartIcon,
    BloodPressureIcon: HeartIcon,
    WeightIcon: ScaleIcon,
    IllnessIcon: XCircleIcon,
    DiabetesIcon: XCircleIcon,
    CancerIcon: XCircleIcon,
    MortalityIcon: XCircleIcon,
    BrainDiseaseIcon: BrainCircuitIcon,
    BackPainIcon: HomeIcon, // Placeholder
    FlexibilityIcon: LeafIcon, // Using relax/leaf icon for flexibility
    CardioIcon: DumbbellIcon,
    StrengthIcon: DumbbellIcon,
    BuildUpIcon: PlusIcon,
    NeckPainIcon: HomeIcon, // Placeholder
    BackIcon: HomeIcon, // Placeholder
    JointsIcon: DumbbellIcon,
    AnklesIcon: DumbbellIcon,
    FamilyWalkIcon: UsersIcon,
    DanceIcon: SpeakerIcon,
    ActiveGamingIcon: StarIcon,
    OutdoorActivitiesIcon: TreesIcon,
    SportsIcon: DumbbellIcon,
    InjuryIcon: XCircleIcon,
    ArthritisIcon: DumbbellIcon,
    RheumatismIcon: DumbbellIcon,
    DisabilityIcon: UsersIcon,
    LearningIcon: BrainCircuitIcon,
    AttentionIcon: BrainCircuitIcon,
    BDNFIcon: BrainCircuitIcon,
    WalkingIcon: DumbbellIcon,
    CyclingIcon: DumbbellIcon,
    RunningIcon: DumbbellIcon,
    FitnessIcon: DumbbellIcon,
    HouseholdIcon: HomeIcon,
    SwimmingIcon: DumbbellIcon,
    FoodIcon: UtensilsIcon,
    HydrationIcon: WindIcon,
    ScheduleIcon: ClockIcon,
    WeatherIcon: WindIcon,
    VacationIcon: StarIcon,
    ChallengeIcon: AwardIcon,
    HelpIcon: UsersIcon,
    MotivationIcon: FireIcon,
    EndIcon: AwardIcon, // For the final day
};