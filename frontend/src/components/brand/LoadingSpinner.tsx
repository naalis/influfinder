"use client";

import Isotipo from "./Isotipo";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
};

export default function LoadingSpinner({
  size = "md",
  text,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="animate-pulse">
        <Isotipo size={sizeMap[size]} variant="gradient" />
      </div>
      {text && (
        <p className="animate-pulse text-sm font-medium text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
}
