/**
 * src/lib/nutrition-logic.ts
 */

import { UserStats, CalorieTargets } from "@/types/nutrition";

/**
 * Calculates the final daily calorie target based on:
 * - The user's calculated TDEE
 * - The goal (loss/gain)
 * - The intensity of the goal (low/moderate/high)
 * - Whether it is a training day or a rest day
 */
export function calculateDailyPlan(
  userTdee: number,
  stats: UserStats,
  isTrainingDay: boolean,
): CalorieTargets {
  let adjustment = 0;

  // Logic for Weight Loss
  if (stats.goal === "weight-loss") {
    // Base rules: ~500 training / ~400 rest
    const baseDeficit = isTrainingDay ? 500 : 400;

    if (stats.goalIntensity === "low") adjustment = -(baseDeficit - 100);
    if (stats.goalIntensity === "moderate") adjustment = -baseDeficit;
    if (stats.goalIntensity === "high") adjustment = -(baseDeficit + 100);
  }

  // Logic for Weight Gain
  else if (stats.goal === "weight-gain") {
    // Cycling surplus for better body composition
    const baseSurplus = isTrainingDay ? 300 : 100;

    if (stats.goalIntensity === "low") adjustment = baseSurplus;
    if (stats.goalIntensity === "moderate") adjustment = baseSurplus + 150;
    if (stats.goalIntensity === "high") adjustment = baseSurplus + 300;
  }

  // Final maintenance calculation
  return {
    tdee: userTdee,
    dailyTarget: userTdee + adjustment,
    deficitOrSurplus: adjustment,
  };
}

/**
 * Calculates the Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation.
 */
export function calculateBMR(stats: UserStats): number {
  const { weight, height, age, gender } = stats;

  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }

  return 10 * weight + 6.25 * height - 5 * age - 161;
}

/**
 * Calculates the Total Daily Energy Expenditure (TDEE).
 * BMR * Activity Level multiplier.
 */
export function calculateTDEE(stats: UserStats): number {
  const bmr = calculateBMR(stats);
  return Math.round(bmr * stats.activityLevel);
}

export function calculateMacros(user: UserStats, plan: CalorieTargets) {
  const proteinMultiplier = user.goal === "weight-loss" ? 2.2 : 2.6;
  let proteinGrams = user.weight * proteinMultiplier;

  if (proteinGrams > 220) proteinGrams = 220;

  const fatKcal = plan.dailyTarget * 0.25;
  const fatGrams = fatKcal / 9;

  const currentProtKcal = proteinGrams * 4;
  const currentFatKcal = fatGrams * 9;
  const carbGrams = (plan.dailyTarget - currentFatKcal - currentProtKcal) / 4;

  return {
    protein: Math.round(proteinGrams),
    fat: Math.round(fatGrams),
    carbs: Math.round(carbGrams),
    calories: plan.dailyTarget,
  };
}

/**
 * A lighter version of macro calculation that only needs the calorie target.
 */
export function calculateMacrosFromCalories(
  calories: number,
  stats: UserStats,
) {
  return calculateMacros(stats, { dailyTarget: calories } as CalorieTargets);
}
