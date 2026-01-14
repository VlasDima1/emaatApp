
import React from 'react';
import { 
    BrainCircuitIcon, ClockIcon, DumbbellIcon, FireIcon, HeartIcon, LeafIcon, PencilIcon,
    PlusIcon, SpeakerIcon, StarIcon, UsersIcon, UtensilsIcon, XCircleIcon, BedIcon, AwardIcon, ClipboardListIcon,
    HomeIcon, ScaleIcon, WindIcon, TreesIcon, BeakerIcon, SmokingIcon, LungsIcon, DropletIcon, ShieldExclamationIcon,
    FaceFrownIcon, UserGroupIcon, CalendarIcon, CheckCircleIcon
} from '../../components/Icons';

export const socialChallengeIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    // Day 1
    MoodIcon: HeartIcon,
    StressIcon: LeafIcon,
    ConfidenceIcon: AwardIcon,
    RelationshipsIcon: UsersIcon,
    ResilienceIcon: ShieldExclamationIcon,
    // Day 2
    PostureIcon: DumbbellIcon,
    EyeContactIcon: UsersIcon,
    SmileIcon: HeartIcon,
    OpenGestureIcon: UsersIcon,
    ToneIcon: SpeakerIcon,
    // Day 3
    ConnectIcon: UsersIcon,
    OpenerIcon: PencilIcon,
    SurroundingsIcon: TreesIcon,
    InterestIcon: BrainCircuitIcon,
    LightTopicIcon: LeafIcon,
    // Day 4
    ListenIcon: SpeakerIcon,
    // Day 5
    DoorwayIcon: HomeIcon,
    // Day 6
    AnxietyIcon: ShieldExclamationIcon,
    StepsIcon: DumbbellIcon,
    // Day 7
    BreatheIcon: WindIcon,
    PositiveTalkIcon: BrainCircuitIcon,
    RewardIcon: AwardIcon,
    // Day 8
    OpenQuestionIcon: PencilIcon,
    CuriosityIcon: BrainCircuitIcon,
    // Day 9
    HelloIcon: UsersIcon,
    // Day 10
    JoinGroupIcon: UserGroupIcon,
    // Day 11
    AwkwardIcon: FaceFrownIcon,
    ResetIcon: ClockIcon,
    // Day 12
    ConsistencyIcon: CalendarIcon,
    SupportIcon: HeartIcon,
    ReliableIcon: CheckCircleIcon,
    // Day 13
    ApproachabilityIcon: UsersIcon,
    // Day 14
    HabitIcon: ClipboardListIcon,
};
