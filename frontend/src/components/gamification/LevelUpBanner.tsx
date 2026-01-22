"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import TierBadge from "@/components/TierBadge";
import type { TierLevel } from "@/lib/tiers";

interface LevelUpBannerProps {
  newTier: TierLevel;
  onClose: () => void;
}

export default function LevelUpBanner({ newTier, onClose }: LevelUpBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative mx-4 w-full max-w-sm overflow-hidden rounded-3xl border border-brand-cyan/30 bg-gradient-to-br from-gray-900 to-black p-8 text-center transition-all duration-500 ${
          isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-gray-700"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>

        {/* Sparkles animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute h-4 w-4 animate-pulse text-brand-cyan opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative">
          <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-cyan">
            Level Up!
          </div>

          <div className="mb-6">
            <TierBadge tier={newTier} size="xl" variant="gradient" />
          </div>

          <h2 className="mb-2 text-2xl font-bold text-white">
            Congratulations!
          </h2>
          <p className="mb-6 text-gray-400">
            You've unlocked new opportunities and exclusive benefits
          </p>

          <button
            onClick={handleClose}
            className="w-full rounded-full bg-brand-cyan px-8 py-3 font-semibold text-black transition-all hover:scale-105 active:scale-95"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}
