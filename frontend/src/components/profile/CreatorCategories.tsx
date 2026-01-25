"use client";

import {
  Utensils,
  Plane,
  Shirt,
  Dumbbell,
  Sparkles,
  Home,
  Gamepad2,
  Music,
  Camera,
  BookOpen,
} from "lucide-react";
import { ComponentType } from "react";

interface CreatorCategoriesProps {
  categories: string[];
  onEdit?: () => void;
  editable?: boolean;
}

interface CategoryConfig {
  icon: ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const categoryConfig: Record<string, CategoryConfig> = {
  food: {
    icon: Utensils,
    color: "text-orange-400",
    bgColor: "bg-orange-400/20",
  },
  travel: {
    icon: Plane,
    color: "text-blue-400",
    bgColor: "bg-blue-400/20",
  },
  fashion: {
    icon: Shirt,
    color: "text-pink-400",
    bgColor: "bg-pink-400/20",
  },
  fitness: {
    icon: Dumbbell,
    color: "text-green-400",
    bgColor: "bg-green-400/20",
  },
  beauty: {
    icon: Sparkles,
    color: "text-purple-400",
    bgColor: "bg-purple-400/20",
  },
  lifestyle: {
    icon: Home,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/20",
  },
  gaming: {
    icon: Gamepad2,
    color: "text-red-400",
    bgColor: "bg-red-400/20",
  },
  music: {
    icon: Music,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/20",
  },
  photography: {
    icon: Camera,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/20",
  },
  education: {
    icon: BookOpen,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/20",
  },
};

export default function CreatorCategories({
  categories,
  onEdit,
  editable = true,
}: CreatorCategoriesProps) {
  const formatCategoryName = (cat: string) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">Content Categories</h3>
        {editable && (
          <button
            onClick={onEdit}
            className="text-sm text-brand-cyan hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const config = categoryConfig[category.toLowerCase()] || {
            icon: Sparkles,
            color: "text-gray-400",
            bgColor: "bg-gray-400/20",
          };
          const Icon = config.icon;

          return (
            <div
              key={category}
              className={`flex items-center gap-2 rounded-full ${config.bgColor} px-4 py-2`}
            >
              <Icon className={`h-4 w-4 ${config.color}`} />
              <span className={`text-sm font-medium ${config.color}`}>
                {formatCategoryName(category)}
              </span>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No categories selected yet
        </p>
      )}
    </div>
  );
}
