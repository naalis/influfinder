"use client";

import {
  Trophy,
  Star,
  Zap,
  Heart,
  Target,
  Award,
  Crown,
  Flame,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  heart: Heart,
  target: Target,
  award: Award,
  crown: Crown,
  flame: Flame,
};

interface AchievementBadgeProps {
  icon: string;
  title: string;
  description: string;
  unlocked?: boolean;
  rarity?: "common" | "rare" | "epic" | "legendary";
}

const rarityColors = {
  common: {
    bg: "bg-gray-500/20",
    border: "border-gray-500/30",
    text: "text-gray-400",
    icon: "text-gray-400",
  },
  rare: {
    bg: "bg-brand-cyan/20",
    border: "border-brand-cyan/30",
    text: "text-brand-cyan",
    icon: "text-brand-cyan",
  },
  epic: {
    bg: "bg-brand-purple/20",
    border: "border-brand-purple/30",
    text: "text-brand-purple",
    icon: "text-brand-purple",
  },
  legendary: {
    bg: "bg-brand-magenta/20",
    border: "border-brand-magenta/30",
    text: "text-brand-magenta",
    icon: "text-brand-magenta",
  },
};

export default function AchievementBadge({
  icon,
  title,
  description,
  unlocked = true,
  rarity = "common",
}: AchievementBadgeProps) {
  const Icon = iconMap[icon] || Star;
  const colors = rarityColors[rarity];

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
        unlocked
          ? `${colors.bg} ${colors.border}`
          : "border-gray-800 bg-gray-900/30 opacity-50"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          unlocked ? colors.bg : "bg-gray-800"
        }`}
      >
        <Icon
          className={`h-6 w-6 ${unlocked ? colors.icon : "text-gray-600"}`}
        />
      </div>
      <div className="flex-1">
        <div
          className={`font-semibold ${
            unlocked ? "text-white" : "text-gray-500"
          }`}
        >
          {title}
        </div>
        <div className={`text-xs ${unlocked ? "text-gray-400" : "text-gray-600"}`}>
          {description}
        </div>
      </div>
      {unlocked && (
        <div
          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${colors.bg} ${colors.text}`}
        >
          {rarity}
        </div>
      )}
    </div>
  );
}
