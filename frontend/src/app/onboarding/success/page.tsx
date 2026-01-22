"use client";

import TierBadge from "@/components/TierBadge";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OnboardingSuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black p-6">
      {/* Animated confetti-like background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <span className="text-2xl opacity-30">
              {["✨", "🎉", "⭐", "💫", "🌟"][Math.floor(Math.random() * 5)]}
            </span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 text-center transition-all duration-1000 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        {/* Welcome Badge */}
        <div className="mb-8">
          <div className="mb-6 text-8xl">🎊</div>
          <h1 className="mb-4 text-4xl font-bold text-white">
            Welcome to Influfinder!
          </h1>
          <p className="mb-8 text-lg text-gray-400">
            You&apos;re all set to start your creator journey
          </p>
        </div>

        {/* Tier Card */}
        <div
          className={`mx-auto mb-8 max-w-md rounded-2xl border-2 border-brand-cyan/30 bg-gradient-to-br from-gray-900 to-black p-8 transition-all duration-1000 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-cyan">
            Your Starting Tier
          </div>

          <div className="mb-6 flex justify-center">
            <TierBadge tier={0} size="xl" variant="gradient" />
          </div>

          <p className="mb-6 text-gray-400">
            Complete your first collaborations to level up and unlock exclusive opportunities
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 rounded-xl border border-gray-800 bg-gray-900/50 p-4">
            <div>
              <div className="mb-1 text-2xl font-bold text-brand-cyan">0</div>
              <div className="text-xs text-gray-500">Collabs</div>
            </div>
            <div>
              <div className="mb-1 text-2xl font-bold text-brand-purple">0</div>
              <div className="text-xs text-gray-500">Karma</div>
            </div>
            <div>
              <div className="mb-1 text-2xl font-bold text-brand-magenta">$0</div>
              <div className="text-xs text-gray-500">Saved</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className={`space-y-3 transition-all duration-1000 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Link
            href="/home"
            className="block w-full max-w-md mx-auto rounded-full bg-brand-cyan px-8 py-4 text-center font-semibold text-black transition-all hover:scale-105 active:scale-95"
          >
            Explore Opportunities
          </Link>

          <Link
            href="/profile"
            className="block w-full max-w-md mx-auto rounded-full border-2 border-gray-700 bg-transparent px-8 py-4 text-center font-semibold text-white transition-all hover:border-gray-600 hover:bg-gray-900 active:scale-95"
          >
            View My Profile
          </Link>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-brand-cyan"></div>
          <div className="h-2 w-2 rounded-full bg-brand-cyan"></div>
          <div className="h-2 w-2 rounded-full bg-brand-cyan"></div>
        </div>
      </div>
    </div>
  );
}
