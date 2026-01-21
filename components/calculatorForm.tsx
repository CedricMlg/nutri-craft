// src/components/CalculatorForm.tsx
"use client";

import { useState } from "react";
import { UserStats } from "@/types/nutrition";
import { calculateTDEE } from "@/lib/nutrition-logic";

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
  const [result, setResult] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    setResult(tdee);
  };

  return (
    <div className="p-4 border rounded shadow">
      <p>
        Calculons premièrement le nombre de calories que tu consommes par jour
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
        <label className="text-sm font-medium text-gray-700">Ton sexe</label>
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
          <option value="weight-gain">Prise de masse / Gain de poids</option>
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
        Calculate my TDEE
      </button>

      {result && (
        <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded">
          Your estimated TDEE is: <strong>{result} kcal</strong>
        </div>
      )}
    </div>
  );
}
