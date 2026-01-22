"use client";

import Link from "next/link";
import { useState } from "react";
import { Instagram, Check, Loader2 } from "lucide-react";

export default function ConnectInstagramPage() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate connection
    setTimeout(() => {
      window.location.href = "/onboarding/categories";
    }, 2000);
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-black p-6">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/10 via-black to-brand-magenta/10" />

      {/* Skip Button */}
      <div className="relative z-10 flex justify-end pt-4">
        <Link
          href="/onboarding/categories"
          className="text-sm text-gray-400 hover:text-brand-cyan transition-colors"
        >
          Skip
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        {!isConnecting ? (
          <>
            <div className="mb-8">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] p-6 shadow-lg shadow-[#dc2743]/30">
                  <Instagram className="h-16 w-16 text-white" />
                </div>
              </div>
              <h1 className="mb-4 text-3xl font-bold text-white">
                Connect Your Instagram
              </h1>
              <p className="max-w-md text-lg text-gray-300">
                Link your Instagram account to showcase your reach and get matched with the best opportunities
              </p>
            </div>

            <div className="w-full max-w-md space-y-4">
              {/* Benefits List */}
              <div className="mb-8 space-y-3 rounded-2xl border border-brand-cyan/20 bg-gradient-to-br from-brand-cyan/5 to-brand-magenta/5 p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-cyan/20">
                    <Check className="h-4 w-4 text-brand-cyan" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">Better Matches</div>
                    <div className="text-sm text-gray-400">
                      Get offers tailored to your audience
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-magenta/20">
                    <Check className="h-4 w-4 text-brand-magenta" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">Track Your Growth</div>
                    <div className="text-sm text-gray-400">
                      See your stats and tier progress
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-purple/20">
                    <Check className="h-4 w-4 text-brand-purple" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">Build Trust</div>
                    <div className="text-sm text-gray-400">
                      Verified accounts get priority access
                    </div>
                  </div>
                </div>
              </div>

              {/* Connect Button */}
              <button
                onClick={handleConnect}
                className="w-full rounded-2xl bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] px-6 py-4 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#dc2743]/30 active:scale-95"
              >
                Connect Instagram Account
              </button>

              <p className="text-xs text-gray-500">
                We&apos;ll never post without your permission
              </p>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] p-6">
                <Loader2 className="h-16 w-16 animate-spin text-white" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-white">
              Connecting...
            </h2>
            <p className="text-gray-400">Please wait a moment</p>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="relative z-10 flex justify-center gap-2 pb-4">
        <div className="h-2 w-2 rounded-full bg-brand-cyan"></div>
        <div className="h-2 w-2 rounded-full bg-gray-700"></div>
        <div className="h-2 w-2 rounded-full bg-gray-700"></div>
      </div>
    </div>
  );
}
