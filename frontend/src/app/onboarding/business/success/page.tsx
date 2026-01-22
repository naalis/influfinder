"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Building2, Users, TrendingUp, Megaphone } from "lucide-react";

export default function BusinessSuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black p-6">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/20 via-brand-purple/30 to-brand-cyan/20" />

      {/* Subtle glow effects */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-brand-magenta/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-brand-cyan/20 blur-3xl" />

      {/* Main Content */}
      <div
        className={`relative z-10 text-center transition-all duration-1000 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        {/* Welcome Badge */}
        <div className="mb-8">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-gradient-to-br from-brand-magenta/30 to-brand-purple/30 p-5">
              <Building2 className="h-16 w-16 text-brand-magenta" />
            </div>
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-brand-magenta via-white to-brand-cyan bg-clip-text text-4xl font-bold text-transparent">
            Welcome to Influfinder!
          </h1>
          <p className="mb-8 text-lg text-gray-300">
            Your business account is ready
          </p>
        </div>

        {/* Features Card */}
        <div
          className={`mx-auto mb-8 max-w-md overflow-hidden rounded-2xl border border-brand-purple/30 bg-gray-900/80 backdrop-blur-sm transition-all duration-1000 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-gradient-to-r from-brand-magenta/10 via-brand-purple/10 to-brand-cyan/10 p-6">
            <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-magenta">
              What you can do
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl bg-black/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-cyan/20">
                  <Users className="h-5 w-5 text-brand-cyan" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">Find Creators</div>
                  <div className="text-sm text-gray-400">Browse verified creators</div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-black/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-magenta/20">
                  <Megaphone className="h-5 w-5 text-brand-magenta" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">Post Offers</div>
                  <div className="text-sm text-gray-400">Create collaboration opportunities</div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-black/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-purple/20">
                  <TrendingUp className="h-5 w-5 text-brand-purple" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">Track Results</div>
                  <div className="text-sm text-gray-400">Monitor campaign performance</div>
                </div>
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
            href="/business/dashboard"
            className="block w-full max-w-md mx-auto rounded-full bg-gradient-to-r from-brand-magenta via-brand-purple to-brand-cyan px-8 py-4 text-center font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-brand-purple/30 active:scale-95"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/business/create-offer"
            className="block w-full max-w-md mx-auto rounded-full border border-brand-magenta/50 bg-transparent px-8 py-4 text-center font-semibold text-brand-magenta transition-all hover:border-brand-magenta hover:bg-brand-magenta/10 active:scale-95"
          >
            Create First Offer
          </Link>
        </div>
      </div>
    </div>
  );
}
