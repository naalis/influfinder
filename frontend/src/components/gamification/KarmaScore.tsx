"use client";

import { Sparkles, TrendingUp, TrendingDown } from "lucide-react";

interface KarmaScoreProps {
  score: number;
  change?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function KarmaScore({
  score,
  change,
  size = "md",
  showLabel = true,
}: KarmaScoreProps) {
  const sizeClasses = {
    sm: {
      container: "gap-1.5",
      icon: "h-4 w-4",
      score: "text-lg",
      label: "text-xs",
      change: "text-xs",
    },
    md: {
      container: "gap-2",
      icon: "h-5 w-5",
      score: "text-2xl",
      label: "text-sm",
      change: "text-sm",
    },
    lg: {
      container: "gap-3",
      icon: "h-6 w-6",
      score: "text-3xl",
      label: "text-base",
      change: "text-base",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex items-center ${classes.container}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-magenta/20">
        <Sparkles className={`${classes.icon} text-brand-magenta`} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className={`${classes.score} font-bold text-brand-magenta`}>
            {score.toLocaleString()}
          </span>
          {change !== undefined && change !== 0 && (
            <span
              className={`flex items-center gap-0.5 ${classes.change} font-medium ${
                change > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {change > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3" />
                  +{change}
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3" />
                  {change}
                </>
              )}
            </span>
          )}
        </div>
        {showLabel && (
          <span className={`${classes.label} text-gray-400`}>Karma Points</span>
        )}
      </div>
    </div>
  );
}
