// src/components/CalculatorForm.tsx
"use client";

import { useState } from "react";
import { UserStats, CalorieTargets } from "@/types/nutrition";
import { calculateTDEE, calculateDailyPlan } from "@/lib/nutrition-logic";

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

  const handleFinalCalculate = () => {
    if (!userTDEE) return;
    const restPlan = calculateDailyPlan(userTDEE, formData, false);
    const trainPlan = calculateDailyPlan(userTDEE, formData, true);

    setDailyRestPlan(restPlan);
    setDailyTrainPlan(trainPlan);
  };

  const handleCalculate = () => {
    const tdee = calculateTDEE(formData);

    setStep(2);
    setUserTDEE(tdee);
  };

  const handleBack = () => {
    setStep(1);

    setDailyRestPlan(null);
    setDailyTrainPlan(null);
  };

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
                {DAYS_OF_WEEK.map((day) => {
                  const isTraining = trainingDays.includes(day);
                  return (
                    <div
                      key={day}
                      className={`p-3 rounded-lg flex justify-between items-center ${
                        isTraining
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      } border`}
                    >
                      <span className="font-medium">{day}</span>
                      <span className="font-bold">
                        {isTraining
                          ? dailyTrainPlan.dailyTarget
                          : dailyRestPlan.dailyTarget}
                        kcal
                      </span>
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
