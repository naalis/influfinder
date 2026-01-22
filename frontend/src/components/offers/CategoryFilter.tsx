"use client";

import { ComponentType } from "react";
import {
  AllCategoriesIcon,
  DiningIcon,
  FitnessIcon,
  WellnessIcon,
  FashionIcon,
  TravelIcon,
  BeautyIcon,
  TechIcon,
  HomeIcon,
} from "@/components/brand/BrandIcons";

interface IconComponentProps {
  className?: string;
  size?: number;
  color?: string;
}

const iconMap: Record<string, ComponentType<IconComponentProps>> = {
  all: AllCategoriesIcon,
  dining: DiningIcon,
  fitness: FitnessIcon,
  wellness: WellnessIcon,
  fashion: FashionIcon,
  travel: TravelIcon,
  beauty: BeautyIcon,
  tech: TechIcon,
  home: HomeIcon,
};

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="hide-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-4">
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category.id;
        const Icon = iconMap[category.icon] || AllCategoriesIcon;
        // Alternate icon colors between cyan and magenta
        const iconColor = isSelected ? "#000000" : (index % 2 === 0 ? "#75FBDE" : "#EA33E9");

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              isSelected
                ? "bg-gradient-to-r from-brand-cyan to-brand-magenta text-black shadow-lg shadow-brand-purple/20"
                : "border border-gray-700/50 bg-gray-900/80 text-gray-200 hover:border-brand-cyan/50 hover:bg-gray-800"
            }`}
          >
            <Icon size={16} color={iconColor} />
            {category.label}
          </button>
        );
      })}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
