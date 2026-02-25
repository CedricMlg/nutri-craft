// src/components/CalculatorForm.tsx
"use client";

import { useState, useMemo } from "react";
import { UserStats, CalorieTargets, DailyEntry } from "@/types/nutrition";
import {
  calculateTDEE,
  calculateDailyPlan,
  calculateMacros,
  calculateMacrosFromCalories,
  rebalanceSchedule,
} from "@/lib/nutrition-logic";

export default function CalculatorForm() {
  const [formData, setFormData] = useState<UserStats>({
    weight: 80,
    height: 180,
    age: 25,
    gender: "male",
    activityLevel: 1.2,
    goal: "weight-loss",
    goalIntensity: "moderate",
  });
  const DAYS_OF_WEEK = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];
  const [trainingDays, setTrainingDays] = useState<string[]>([]);
  const [step, setStep] = useState<number>(1);
  const [dailyRestPlan, setDailyRestPlan] = useState<CalorieTargets | null>(
    null,
  );
  const [dailyTrainPlan, setDailyTrainPlan] = useState<CalorieTargets | null>(
    null,
  );
  const [userTDEE, setUserTDEE] = useState<number | null>(null);
  const [weeklySchedule, setWeeklySchedule] = useState<DailyEntry[]>([]);
  const [editingDay, setEditingDay] = useState<string | null>(null);

  const updateDay = (dayName: string, updates: Partial<DailyEntry>) => {
    setWeeklySchedule((prev) =>
      prev.map((d) => {
        if (d.day !== dayName) return d;

        const shouldForceLock =
          updates.isLocked !== undefined ? updates.isLocked : true;

        return {
          ...d,
          ...updates,
          isCustom: true,
          isLocked: shouldForceLock,
        };
      }),
    );
  };

  const toggleDay = (day: string) => {
    setTrainingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const isNumberField = type === "number" || name === "activityLevel";

    setFormData((prev) => ({
      ...prev,
      [name]: isNumberField ? Number(value) : value,
    }));
  };

  const handleCalculate = () => {
    const tdee = calculateTDEE(formData);

    setStep(2);
    setUserTDEE(tdee);
  };

  const handleFinalCalculate = () => {
    if (!userTDEE) return;

    const restPlan = calculateDailyPlan(userTDEE, formData, false);
    const trainPlan = calculateDailyPlan(userTDEE, formData, true);

    // Generate the 7 days based on current plans
    const initialSchedule = DAYS_OF_WEEK.map((day) => {
      const isTraining = trainingDays.includes(day);
      const plan = isTraining ? trainPlan : restPlan;
      const macros = calculateMacros(formData, plan);

      return {
        day,
        calories: plan.dailyTarget,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        isLocked: false,
        isTraining,
        isCustom: false,
      };
    });

    setWeeklySchedule(initialSchedule);
    setDailyRestPlan(restPlan);
    setDailyTrainPlan(trainPlan);
  };

  const handleBack = () => {
    setStep(1);

    setDailyRestPlan(null);
    setDailyTrainPlan(null);
  };

  const totalWeeklyTarget = useMemo(() => {
    if (!dailyTrainPlan || !dailyRestPlan) return 0;
    return (
      dailyTrainPlan.dailyTarget * trainingDays.length +
      dailyRestPlan.dailyTarget * (7 - trainingDays.length)
    );
  }, [dailyTrainPlan, dailyRestPlan, trainingDays]);

  return (
    <div className="p-4 border rounded shadow">
      {step === 1 && (
        <>
          <p>
            Calculons premièrement le nombre de calories que tu consommes par
            jour
          </p>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Ton poids (kg)
            </label>
            <input
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-black"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Ta taille (cm)
            </label>
            <input
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-black"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Ton âge</label>
            <input
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-black"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Ton sexe
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-black"
            >
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Ton niveau d&apos;activité physique
            </label>
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-black"
            >
              <option value="1.2">
                Sédentaire - (Peu ou pas d&apos;exercice, travail de bureau)
              </option>
              <option value="1.375">
                Légèrement - (actif Exercice léger (1-3 jours/semaine))
              </option>
              <option value="1.55">
                Modérément - (actif Exercice modéré (3-5 jours/semaine))
              </option>
              <option value="1.725">
                Très actif - (Exercice intense (6-7 jours/semaine))
              </option>
              <option value="1.9">
                Extrêmement actif - (Travail physique intense ou entraînement
                2x/jour)
              </option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Ton objectif
            </label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-black"
            >
              <option value="weight-loss">Sèche / Perte de poids</option>
              <option value="maintenance">Maintient du poids actuel</option>
              <option value="weight-gain">
                Prise de masse / Gain de poids
              </option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Le niveau d&apos;intensité souhaité
            </label>
            <select
              name="goalIntensity"
              value={formData.goalIntensity}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-black"
            >
              <option value="low">Léger</option>
              <option value="moderate">Modéré</option>
              <option value="high">Intense</option>
            </select>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Calculer ma consomation de calories journalière
          </button>

          {userTDEE && (
            <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded">
              Ton éstimation de calories dépensées par jour est de :{" "}
              <strong>{userTDEE} kcal</strong>
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <button
            onClick={handleBack}
            className="text-sm flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            ← Modifier mes informations
          </button>
          <h2 className="text-xl font-bold">📅 Planifie ta semaine</h2>
          <p className="text-sm text-gray-600">
            Sélectionne tes jours d&apos;entraînement :
          </p>

          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  trainingDays.includes(day)
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <button
            onClick={handleFinalCalculate}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg"
          >
            Générer mon programme
          </button>

          {dailyRestPlan && dailyTrainPlan && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">
                Ton Calendrier Calorique
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {weeklySchedule.map((dayEntry) => {
                  const isEditing = editingDay === dayEntry.day;

                  return (
                    <div
                      key={dayEntry.day}
                      className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${
                        dayEntry.isTraining
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      } ${dayEntry.isLocked ? "ring-2 ring-blue-400" : ""}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">
                          {dayEntry.day}
                        </span>
                        <div className="flex gap-2">
                          {/* LOCK BUTTON */}
                          <button
                            onClick={() =>
                              updateDay(dayEntry.day, {
                                isLocked: !dayEntry.isLocked,
                              })
                            }
                            className={`p-1 rounded ${dayEntry.isLocked ? "text-blue-600" : "text-gray-400"}`}
                          >
                            {dayEntry.isLocked ? "🔒" : "🔓"}
                          </button>
                          {/* EDIT BUTTON */}
                          <button
                            onClick={() => {
                              if (isEditing) {
                                // Use the memoized value
                                const balancedSchedule = rebalanceSchedule(
                                  weeklySchedule,
                                  totalWeeklyTarget, // Using the variable from useMemo
                                  formData,
                                );

                                setWeeklySchedule(balancedSchedule);
                                setEditingDay(null);
                              } else {
                                setEditingDay(dayEntry.day);
                              }
                            }}
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                          >
                            {isEditing ? "✅" : "✏️"}
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-2 animate-in fade-in duration-200">
                          <div className="text-right">
                            <label className="text-md font-bold text-green-700 uppercase">
                              kcal
                            </label>
                            <input
                              type="number"
                              className="border rounded p-1 text-md font-bold text-green-700"
                              value={dayEntry.calories}
                              onChange={(e) => {
                                const newCalories = Number(e.target.value);
                                const newMacros = calculateMacrosFromCalories(
                                  newCalories,
                                  formData,
                                );

                                updateDay(dayEntry.day, {
                                  calories: newCalories,
                                  protein: newMacros.protein,
                                  carbs: newMacros.carbs,
                                  fat: newMacros.fat,
                                });
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col p-1 bg-red-100 text-red-700 rounded">
                              <label className="bg-red-100 text-red-700 uppercase">
                                Prot
                              </label>
                              <input
                                type="number"
                                className="border p-1 bg-red-100 text-red-700 rounded"
                                value={dayEntry.protein}
                                onChange={(e) => {
                                  const newProt = Number(e.target.value);

                                  const newTotalCalories =
                                    newProt * 4 +
                                    dayEntry.carbs * 4 +
                                    dayEntry.fat * 9;

                                  updateDay(dayEntry.day, {
                                    protein: newProt,
                                    calories: Math.round(newTotalCalories),
                                  });
                                }}
                              />
                            </div>

                            <div className="flex flex-col p-1 bg-yellow-100 text-yellow-700 rounded">
                              <label className="bg-yellow-100 text-yellow-700 uppercase">
                                Gluc
                              </label>
                              <input
                                type="number"
                                className="border p-1 bg-yellow-100 text-yellow-700 rounded"
                                value={dayEntry.carbs}
                                onChange={(e) => {
                                  const newCarbs = Number(e.target.value);

                                  const newTotalCalories =
                                    dayEntry.protein * 4 +
                                    newCarbs * 4 +
                                    dayEntry.fat * 9;

                                  updateDay(dayEntry.day, {
                                    carbs: newCarbs,
                                    calories: Math.round(newTotalCalories),
                                  });
                                }}
                              />
                            </div>

                            <div className="flex flex-col p-1 bg-blue-100 text-blue-700 rounded">
                              <label className="bg-blue-100 text-blue-700 uppercase">
                                Lip
                              </label>
                              <input
                                type="number"
                                className="border p-1 bg-blue-100 text-blue-700 rounded"
                                value={dayEntry.fat}
                                onChange={(e) => {
                                  const newFat = Number(e.target.value);

                                  const newTotalCalories =
                                    dayEntry.protein * 4 +
                                    dayEntry.carbs * 4 +
                                    newFat * 9;

                                  updateDay(dayEntry.day, {
                                    fat: newFat,
                                    calories: Math.round(newTotalCalories),
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-right">
                            <span className="text-md font-bold text-green-700">
                              {dayEntry.calories} kcal
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col p-1 bg-red-100 text-red-700 rounded">
                              <span className="font-bold">
                                {dayEntry.protein}g
                              </span>
                              <span>Prot</span>
                            </div>

                            <div className="flex flex-col p-1 bg-yellow-100 text-yellow-700 rounded">
                              <span className="font-bold">
                                {dayEntry.carbs}g
                              </span>
                              <span>Gluc</span>
                            </div>

                            <div className="flex flex-col p-1 bg-blue-100 text-blue-700 rounded">
                              <span className="font-bold">{dayEntry.fat}g</span>
                              <span>Lip</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
