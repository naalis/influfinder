"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Utensils,
  Plane,
  HeartPulse,
  Shirt,
  Dumbbell,
  Smartphone,
  Clapperboard,
  Home,
  Check,
  LucideIcon,
  Sparkles,
} from "lucide-react";

interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
}

const categories: Category[] = [
  { id: "food", label: "Food & Dining", icon: Utensils },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "wellness", label: "Wellness", icon: HeartPulse },
  { id: "fashion", label: "Fashion", icon: Shirt },
  { id: "beauty", label: "Beauty", icon: Sparkles },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "tech", label: "Tech", icon: Smartphone },
  { id: "entertainment", label: "Entertainment", icon: Clapperboard },
  { id: "lifestyle", label: "Lifestyle", icon: HeartPulse },
  { id: "home", label: "Home & Decor", icon: Home },
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
    <div className="relative flex min-h-screen flex-col bg-black p-6">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 via-black to-brand-cyan/10" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 pt-8">
          <h1 className="mb-3 text-3xl font-bold text-white">
            Choose Your Interests
          </h1>
          <p className="text-lg text-gray-300">
            Select at least 3 categories to get personalized offers
          </p>

          {/* Selection Counter */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-2">
            <span className="text-sm font-bold text-brand-cyan">
              {selected.length}
            </span>
            <span className="text-sm text-gray-300">/ 3 minimum</span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-8 flex-1">
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category, index) => {
              const isSelected = selected.includes(category.id);
              const Icon = category.icon;
              // Alternate between cyan and magenta for icons
              const iconColor = index % 2 === 0 ? "text-brand-cyan" : "text-brand-magenta";

              return (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 ${
                    isSelected
                      ? "scale-[1.02]"
                      : "hover:scale-[1.02]"
                  }`}
                >
                  {/* Background */}
                  <div className={`absolute inset-0 transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-br from-brand-cyan/20 via-brand-purple/20 to-brand-magenta/20"
                      : "bg-gray-900/80 group-hover:bg-gray-800/80"
                  }`} />

                  {/* Gradient border effect */}
                  <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  }`} style={{
                    padding: '1px',
                    background: 'linear-gradient(135deg, #75FBDE, #662D91, #EA33E9)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }} />

                  {/* Content */}
                  <div className="relative flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                      isSelected
                        ? "bg-gradient-to-br from-brand-cyan/30 to-brand-magenta/30"
                        : "bg-gray-800 group-hover:bg-gray-700"
                    }`}>
                      <Icon className={`h-5 w-5 transition-colors duration-300 ${
                        isSelected ? "text-white" : iconColor
                      }`} />
                    </div>
                    <div className={`text-sm font-semibold transition-colors duration-300 ${
                      isSelected ? "text-white" : "text-gray-200"
                    }`}>
                      {category.label}
                    </div>
                  </div>

                  {/* Check Mark */}
                  {isSelected && (
                    <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-brand-cyan to-brand-magenta">
                      <Check className="h-3 w-3 text-white" />
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
                ? "bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-magenta text-white hover:scale-105 hover:shadow-lg hover:shadow-brand-purple/30 active:scale-95"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
            onClick={(e) => !canContinue && e.preventDefault()}
          >
            {canContinue ? "Continue" : "Select at least 3 categories"}
          </Link>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 pt-4">
            <div className="h-2 w-2 rounded-full bg-brand-cyan"></div>
            <div className="h-2 w-2 rounded-full bg-brand-magenta"></div>
            <div className="h-2 w-2 rounded-full bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
