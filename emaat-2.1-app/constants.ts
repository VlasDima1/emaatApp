
import React from 'react';
import type { Activity, Pillar, Badge, MeasurementType } from './types';
import { BedIcon, UtensilsIcon, UsersIcon, PaletteIcon, DumbbellIcon, BookOpenIcon, LeafIcon, TreesIcon, HeartPulseIcon, DropletIcon, ScaleIcon, ThermometerIcon, ActivityIcon, WindIcon, SmokingIcon } from './components/Icons';
import { GOAL_CONFIG } from './goals';

export const LIFESTYLE_PILLARS: Pillar[] = [
  { id: 'sleep', icon: BedIcon },
  { id: 'nutrition', icon: UtensilsIcon },
  { id: 'social', icon: UsersIcon },
  { id: 'stress_reduction', icon: LeafIcon },
  { id: 'exercise', icon: DumbbellIcon },
];

export const ACTIVITIES: Activity[] = [
  { id: 'exercise', icon: DumbbellIcon, points: 25, color: 'text-sky-500', pillar: 'exercise', minLevel: 1 },
  { id: 'nature', icon: TreesIcon, points: 15, color: 'text-lime-600', pillar: 'exercise', minLevel: 1 },
  { id: 'meal', icon: UtensilsIcon, points: 10, color: 'text-emerald-500', pillar: 'nutrition', minLevel: 2 },
  { id: 'social', icon: UsersIcon, points: 20, color: 'text-amber-500', pillar: 'social', minLevel: 2 },
  { id: 'hobby', icon: PaletteIcon, points: 15, color: 'text-rose-500', pillar: 'stress_reduction', minLevel: 2 },
  { id: 'read', icon: BookOpenIcon, points: 10, color: 'text-orange-500', pillar: 'stress_reduction', minLevel: 2 },
  { id: 'relax', icon: LeafIcon, points: 10, color: 'text-teal-500', pillar: 'stress_reduction', minLevel: 2 },
  { id: 'sleep', icon: BedIcon, points: 10, color: 'text-indigo-500', pillar: 'sleep', minLevel: 1 },
  { id: 'smoke', icon: SmokingIcon, points: 0, color: 'text-slate-500', pillar: 'stress_reduction', minLevel: 1 },
];

export const MEASUREMENT_CONFIG: Record<MeasurementType, { icon: React.ComponentType<{ className?: string }>, color: string }> = {
    heartRate: { icon: HeartPulseIcon, color: 'text-rose-500' },
    bloodPressure: { icon: HeartPulseIcon, color: 'text-purple-500' },
    bloodGlucose: { icon: DropletIcon, color: 'text-red-500' },
    steps: { icon: ActivityIcon, color: 'text-lime-600' },
    sleepDuration: { icon: BedIcon, color: 'text-indigo-500' },
    weight: { icon: ScaleIcon, color: 'text-teal-500' },
    temperature: { icon: ThermometerIcon, color: 'text-orange-500' },
    oxygenSaturation: { icon: WindIcon, color: 'text-sky-500' },
    smoke: { icon: SmokingIcon, color: 'text-slate-500' },
};

// @ts-ignore
export { GOAL_CONFIG };

export const POINTS_PER_LEVEL = 100;

export const BADGES: Badge[] = [
  // Sleep
  { activityId: 'sleep', tier: 'bronze', threshold: 100 },
  { activityId: 'sleep', tier: 'silver', threshold: 300 },
  { activityId: 'sleep', tier: 'gold', threshold: 750 },
  // Exercise
  { activityId: 'exercise', tier: 'bronze', threshold: 150 },
  { activityId: 'exercise', tier: 'silver', threshold: 450 },
  { activityId: 'exercise', tier: 'gold', threshold: 1000 },
  // Nature
  { activityId: 'nature', tier: 'bronze', threshold: 100 },
  { activityId: 'nature', tier: 'silver', threshold: 300 },
  { activityId: 'nature', tier: 'gold', threshold: 750 },
  // Meal
  { activityId: 'meal', tier: 'bronze', threshold: 75 },
  { activityId: 'meal', tier: 'silver', threshold: 250 },
  { activityId: 'meal', tier: 'gold', threshold: 600 },
  // Social
  { activityId: 'social', tier: 'bronze', threshold: 125 },
  { activityId: 'social', tier: 'silver', threshold: 400 },
  { activityId: 'social', tier: 'gold', threshold: 900 },
  // Hobby
  { activityId: 'hobby', tier: 'bronze', threshold: 100 },
  { activityId: 'hobby', tier: 'silver', threshold: 300 },
  { activityId: 'hobby', tier: 'gold', threshold: 750 },
  // Read
  { activityId: 'read', tier: 'bronze', threshold: 75 },
  { activityId: 'read', tier: 'silver', threshold: 250 },
  { activityId: 'read', tier: 'gold', threshold: 600 },
  // Relax
  { activityId: 'relax', tier: 'bronze', threshold: 75 },
  { activityId: 'relax', tier: 'silver', threshold: 250 },
  { activityId: 'relax', tier: 'gold', threshold: 600 },
];

export const HOBBIES_NL = ['Wandelen', 'Fietsen', 'Tuinieren', 'Koken', 'Lezen', 'Fotografie', 'Schilderen', 'Gamen', 'Yoga'];
export const SPORTS_NL = ['Voetbal', 'Tennis', 'Fitness', 'Hockey', 'Zwemmen', 'Wielrennen', 'Hardlopen', 'Volleybal'];
