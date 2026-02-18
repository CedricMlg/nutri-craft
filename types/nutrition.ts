/**
 * src/types/nutrition.ts
 */

export type Gender = "male" | "female";

// Standard PAL (Physical Activity Level) multipliers
export type ActivityLevel = 1.2 | 1.375 | 1.55 | 1.725 | 1.9;

export type Goal = "maintenance" | "weight-loss" | "weight-gain";

// Intensity tiers for cutting or bulking
export type GoalIntensity = "low" | "moderate" | "high";

export interface UserStats {
  weight: number; // in kg
  height: number; // in cm
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
  goalIntensity: GoalIntensity;
}

export interface CalorieTargets {
  tdee: number; // Maintenance calories
  dailyTarget: number; // Final target after adjustments
  deficitOrSurplus: number;
}

export interface DailyEntry {
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isLocked: boolean;
  isTraining: boolean;
  isCustom: boolean; // To know if the user manually touched it
}
