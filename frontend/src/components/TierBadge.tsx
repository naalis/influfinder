import { getTierInfo, type TierLevel } from "@/lib/tiers";

interface TierBadgeProps {
  tier: TierLevel;
  size?: "sm" | "md" | "lg" | "xl";
  showEmoji?: boolean;
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

const emojiSizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
};

export default function TierBadge({
  tier,
  size = "md",
  showEmoji = true,
  showLevel = false,
  variant = "default",
  className = "",
}: TierBadgeProps) {
  const tierInfo = getTierInfo(tier);

  const baseClasses = "inline-flex items-center gap-2 rounded-full font-semibold transition-all";
  const sizeClass = sizeClasses[size];
  const emojiSize = emojiSizes[size];

  let variantClasses = "";
  let textColor = "text-white";

  switch (variant) {
    case "default":
      variantClasses = `bg-${tierInfo.color}`;
      textColor = tier === 5 ? "text-gray-300" : "text-white";
      break;
    case "outline":
      variantClasses = `border-2 border-${tierInfo.color} bg-transparent`;
      textColor = `text-${tierInfo.color}`;
      break;
    case "gradient":
      variantClasses = `bg-gradient-to-r from-${tierInfo.color} to-${tierInfo.colorDark}`;
      textColor = tier === 5 ? "text-gray-300" : "text-white";
      break;
  }

  return (
    <div
      className={`${baseClasses} ${sizeClass} ${variantClasses} ${textColor} ${className}`}
      role="status"
      aria-label={`Tier ${tier}: ${tierInfo.displayName}`}
    >
      {showEmoji && <span className={emojiSize}>{tierInfo.emoji}</span>}
      <span>
        {showLevel && `Tier ${tier} - `}
        {tierInfo.displayName}
      </span>
    </div>
  );
}
