import React from 'react';
import { 
    BrainCircuitIcon, ClockIcon, DumbbellIcon, FireIcon, HeartIcon, LeafIcon, PencilIcon,
    PlusIcon, SpeakerIcon, StarIcon, UsersIcon, UtensilsIcon, XCircleIcon, BedIcon, AwardIcon, ClipboardListIcon,
    HomeIcon, ScaleIcon, WindIcon, TreesIcon, BeakerIcon, DropletIcon
} from '../../components/Icons';

export const hartfalenChallengeIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    // Day 1 - Fluid Balance
    FluidIcon: DropletIcon,
    WaterIcon: DropletIcon,
    CoffeeIcon: UtensilsIcon,
    SoupIcon: UtensilsIcon,
    MeasureIcon: BeakerIcon,
    BodyIcon: HeartIcon,
    WeightIcon: ScaleIcon,
    BalanceIcon: ScaleIcon,
    
    // Day 2 - Salt Restriction
    SaltIcon: UtensilsIcon,
    HerbsIcon: LeafIcon,
    LabelIcon: ClipboardListIcon,
    BloodPressureIcon: HeartIcon,
    FlavorIcon: StarIcon,
    
    // Day 3 - Movement
    WalkingIcon: DumbbellIcon,
    ExerciseIcon: DumbbellIcon,
    StepsIcon: DumbbellIcon,
    RestIcon: BedIcon,
    BreathIcon: WindIcon,
    StrengthIcon: DumbbellIcon,
    PauseIcon: ClockIcon,
    
    // Day 4 - Nutrition
    VegetablesIcon: TreesIcon,
    FruitIcon: TreesIcon,
    ProteinIcon: UtensilsIcon,
    MealIcon: UtensilsIcon,
    ChewIcon: UtensilsIcon,
    CookingIcon: HomeIcon,
    
    // Day 5 - Self-Image & Social Support
    SelfImageIcon: AwardIcon,
    SocialIcon: UsersIcon,
    EmotionsIcon: HeartIcon,
    SupportIcon: UsersIcon,
    HelpIcon: PlusIcon,
    SadnessIcon: HeartIcon,
    
    // Day 6 - Active Hobbies
    HobbyIcon: StarIcon,
    GardeningIcon: LeafIcon,
    YogaIcon: LeafIcon,
    SwimmingIcon: DropletIcon,
    GroupIcon: UsersIcon,
    PaceIcon: ClockIcon,
    
    // Day 7 - Aids & Tools
    ToolsIcon: ClipboardListIcon,
    WalkerIcon: DumbbellIcon,
    BikeIcon: DumbbellIcon,
    ShowerIcon: DropletIcon,
    MedicationIcon: PlusIcon,
    TechIcon: BrainCircuitIcon,
    StairliftIcon: HomeIcon,
    
    // Day 8 - Breathing & Relaxation
    BreathingIcon: WindIcon,
    RelaxIcon: LeafIcon,
    MusicIcon: SpeakerIcon,
    NervousSystemIcon: BrainCircuitIcon,
    HeartRateIcon: HeartIcon,
    MeditateIcon: LeafIcon,
    
    // Day 9 - Medication Check
    PillsIcon: PlusIcon,
    DosageIcon: ClipboardListIcon,
    TherapyIcon: HeartIcon,
    SideEffectsIcon: XCircleIcon,
    ScheduleIcon: ClockIcon,
    NoteIcon: PencilIcon,
    
    // Day 10 - Rest & Sleep
    SleepIcon: BedIcon,
    NightIcon: BedIcon,
    BladderIcon: DropletIcon,
    ComfortIcon: HomeIcon,
    RoutineIcon: ClockIcon,
    InsomniaIcon: XCircleIcon,
    
    // Day 11 - Pleasure & Relaxation
    PleasureIcon: StarIcon,
    PaintingIcon: PencilIcon,
    IntimacyIcon: HeartIcon,
    LearningIcon: BrainCircuitIcon,
    HappinessIcon: StarIcon,
    BrainIcon: BrainCircuitIcon,
    
    // Day 12 - Knowledge Day
    KnowledgeIcon: BrainCircuitIcon,
    SignalsIcon: ClipboardListIcon,
    LimitsIcon: XCircleIcon,
    ProactiveIcon: AwardIcon,
    ReflectionIcon: PencilIcon,
    ControlIcon: AwardIcon,
    
    // Day 13 - Planning & Energy
    PlanningIcon: ClipboardListIcon,
    AgendaIcon: ClockIcon,
    EnergyIcon: FireIcon,
    AlternativeIcon: PlusIcon,
    PrioritiesIcon: StarIcon,
    WorryTimeIcon: ClockIcon,
    
    // Day 14 - Reflection & Outlook
    CelebrationIcon: AwardIcon,
    FutureIcon: StarIcon,
    ProgressIcon: AwardIcon,
    ChallengesIcon: FireIcon,
    ContinueIcon: DumbbellIcon,
    TrophyIcon: AwardIcon,
    
    // General
    HeartIcon: HeartIcon,
    HealthIcon: HeartIcon,
    TipIcon: StarIcon,
    GoalIcon: AwardIcon,
    AssignmentIcon: ClipboardListIcon,
};
