import { getTierInfo, type TierLevel } from "@/lib/tiers";
import {
  Star,
  Sparkles,
  Zap,
  Gem,
  Flame,
  Trophy,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  star: Star,
  sparkles: Sparkles,
  zap: Zap,
  gem: Gem,
  flame: Flame,
  trophy: Trophy,
};

interface TierBadgeProps {
  tier: TierLevel;
  size?: "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
  showLevel?: boolean;
  variant?: "default" | "outline" | "gradient";
  className?: string;
}

const sizeClasses = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1.5",
  lg: "text-base px-4 py-2",
  xl: "text-lg px-6 py-3",
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-6 w-6",
};

export default function TierBadge({
  tier,
  size = "md",
  showIcon = true,
  showLevel = false,
  variant = "default",
  className = "",
}: TierBadgeProps) {
  const tierInfo = getTierInfo(tier);
  const Icon = iconMap[tierInfo.icon] || Star;

  const baseClasses = "inline-flex items-center gap-2 rounded-full font-semibold transition-all";
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];

  // Get tier color from CSS variables
  const getTierColorStyle = () => {
    const colorVar = `var(--tier-${tier})`;
    const colorLightVar = `var(--tier-${tier}-light)`;
    const colorDarkVar = `var(--tier-${tier}-dark)`;

    switch (variant) {
      case "default":
        return {
          backgroundColor: colorVar,
          color: tier === 0 ? "#1f2937" : "#ffffff",
        };
      case "outline":
        return {
          border: `2px solid ${colorVar}`,
          backgroundColor: "transparent",
          color: colorVar,
        };
      case "gradient":
        // Special gradient for Tier 5 (Legend)
        if (tier === 5) {
          return {
            backgroundImage: `linear-gradient(135deg, ${colorVar} 0%, ${colorLightVar} 100%)`,
            color: "#ffffff",
          };
        }
        return {
          backgroundImage: `linear-gradient(135deg, ${colorVar} 0%, ${colorDarkVar} 100%)`,
          color: tier === 0 ? "#1f2937" : "#ffffff",
        };
      default:
        return {
          backgroundColor: colorVar,
          color: "#ffffff",
        };
    }
  };

  return (
    <div
      className={`${baseClasses} ${sizeClass} ${className}`}
      style={getTierColorStyle()}
      role="status"
      aria-label={`Tier ${tier}: ${tierInfo.displayName}`}
    >
      {showIcon && <Icon className={iconSize} />}
      <span>
        {showLevel && `Tier ${tier} - `}
        {tierInfo.displayName}
      </span>
    </div>
  );
}
