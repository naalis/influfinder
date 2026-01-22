"use client";

import TierBadge from "@/components/TierBadge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Isotipo } from "@/components/brand";

export default function OnboardingSuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black p-6">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/20 via-brand-purple/30 to-brand-cyan/20" />

      {/* Subtle glow effects */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-brand-cyan/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-brand-magenta/20 blur-3xl" />

      {/* Main Content */}
      <div
        className={`relative z-10 text-center transition-all duration-1000 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        {/* Welcome Badge with Isotipo */}
        <div className="mb-8">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-gradient-to-br from-brand-cyan/20 to-brand-magenta/20 p-4">
              <Isotipo size={72} variant="gradient" />
            </div>
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-brand-cyan via-white to-brand-magenta bg-clip-text text-4xl font-bold text-transparent">
            Welcome to Influfinder!
          </h1>
          <p className="mb-8 text-lg text-gray-300">
            You&apos;re all set to start your creator journey
          </p>
        </div>

        {/* Tier Card */}
        <div
          className={`mx-auto mb-8 max-w-md overflow-hidden rounded-2xl border border-brand-purple/30 bg-gray-900/80 backdrop-blur-sm transition-all duration-1000 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Card header gradient */}
          <div className="bg-gradient-to-r from-brand-cyan/10 via-brand-purple/10 to-brand-magenta/10 p-8">
            <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-cyan">
              Your Starting Tier
            </div>

            <div className="mb-6 flex justify-center">
              <TierBadge tier={0} size="xl" variant="gradient" />
            </div>

            <p className="mb-6 text-gray-300">
              Complete your first collaborations to level up and unlock exclusive opportunities
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 rounded-xl border border-gray-700/50 bg-black/50 p-4">
              <div>
                <div className="mb-1 text-2xl font-bold text-brand-cyan">0</div>
                <div className="text-xs text-gray-400">Collabs</div>
              </div>
              <div>
                <div className="mb-1 text-2xl font-bold text-brand-purple">0</div>
                <div className="text-xs text-gray-400">Karma</div>
              </div>
              <div>
                <div className="mb-1 text-2xl font-bold text-brand-magenta">$0</div>
                <div className="text-xs text-gray-400">Saved</div>
              </div>
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
            className="block w-full max-w-md mx-auto rounded-full bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-magenta px-8 py-4 text-center font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-brand-purple/30 active:scale-95"
          >
            Explore Opportunities
          </Link>

          <Link
            href="/profile"
            className="block w-full max-w-md mx-auto rounded-full border border-brand-cyan/50 bg-transparent px-8 py-4 text-center font-semibold text-brand-cyan transition-all hover:border-brand-cyan hover:bg-brand-cyan/10 active:scale-95"
          >
            View My Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
