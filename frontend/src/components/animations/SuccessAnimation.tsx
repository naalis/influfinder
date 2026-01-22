"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface SuccessAnimationProps {
  size?: "sm" | "md" | "lg";
  onComplete?: () => void;
}

const sizeClasses = {
  sm: { container: "h-12 w-12", icon: "h-6 w-6" },
  md: { container: "h-16 w-16", icon: "h-8 w-8" },
  lg: { container: "h-24 w-24", icon: "h-12 w-12" },
};

export default function SuccessAnimation({
  size = "md",
  onComplete,
}: SuccessAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const classes = sizeClasses[size];

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`relative flex items-center justify-center ${classes.container}`}
    >
      {/* Background Circle */}
      <div
        className={`absolute inset-0 rounded-full bg-green-500 transition-all duration-500 ${
          isAnimating ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />

      {/* Check Icon */}
      <Check
        className={`relative z-10 text-white transition-all duration-300 delay-200 ${classes.icon} ${
          isAnimating ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
        strokeWidth={3}
      />

      {/* Pulse Ring */}
      <div
        className={`absolute inset-0 rounded-full border-2 border-green-500 transition-all duration-700 ${
          isAnimating ? "scale-150 opacity-0" : "scale-100 opacity-100"
        }`}
      />
    </div>
  );
}
