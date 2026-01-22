"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  { id: "food", label: "🍽️ Food & Dining", color: "from-orange-500 to-red-500" },
  { id: "travel", label: "✈️ Travel", color: "from-blue-500 to-cyan-500" },
  { id: "wellness", label: "🧘 Wellness", color: "from-green-500 to-teal-500" },
  { id: "fashion", label: "👗 Fashion", color: "from-pink-500 to-purple-500" },
  { id: "beauty", label: "💄 Beauty", color: "from-rose-500 to-pink-500" },
  { id: "fitness", label: "💪 Fitness", color: "from-red-500 to-orange-600" },
  { id: "tech", label: "📱 Tech", color: "from-indigo-500 to-blue-500" },
  { id: "entertainment", label: "🎬 Entertainment", color: "from-purple-500 to-indigo-500" },
  { id: "lifestyle", label: "🌟 Lifestyle", color: "from-yellow-500 to-orange-500" },
  { id: "home", label: "🏠 Home & Decor", color: "from-teal-500 to-green-500" },
];

export default function CategoriesPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((cat) => cat !== id)
        : [...prev, id]
    );
  };

  const canContinue = selected.length >= 3;

  return (
    <div className="flex min-h-screen flex-col bg-black p-6">
      {/* Header */}
      <div className="mb-8 pt-8">
        <h1 className="mb-3 text-3xl font-bold text-white">
          Choose Your Interests
        </h1>
        <p className="text-lg text-gray-400">
          Select at least 3 categories to get personalized offers
        </p>

        {/* Selection Counter */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/50 px-4 py-2">
          <span className="text-sm font-semibold text-brand-cyan">
            {selected.length}
          </span>
          <span className="text-sm text-gray-400">/ 3 minimum</span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-8 flex-1">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => {
            const isSelected = selected.includes(category.id);

            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all ${
                  isSelected
                    ? "scale-105 ring-2 ring-brand-cyan"
                    : "scale-100"
                }`}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} ${
                    isSelected ? "opacity-100" : "opacity-30"
                  } transition-opacity`}
                ></div>

                {/* Content */}
                <div className="relative">
                  <div className="mb-2 text-2xl">
                    {category.label.split(" ")[0]}
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {category.label.split(" ").slice(1).join(" ")}
                  </div>
                </div>

                {/* Check Mark */}
                {isSelected && (
                  <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-brand-cyan">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="space-y-3">
        <Link
          href={canContinue ? "/onboarding/success" : "#"}
          className={`block w-full rounded-full px-8 py-4 text-center font-semibold transition-all ${
            canContinue
              ? "bg-brand-cyan text-black hover:scale-105 active:scale-95"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
          }`}
          onClick={(e) => !canContinue && e.preventDefault()}
        >
          {canContinue ? "Continue" : "Select at least 3 categories"}
        </Link>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 pt-4">
          <div className="h-2 w-2 rounded-full bg-brand-cyan"></div>
          <div className="h-2 w-2 rounded-full bg-brand-cyan"></div>
          <div className="h-2 w-2 rounded-full bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
}
