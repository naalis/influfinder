"use client";

import Link from "next/link";
import { useState } from "react";

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
    <div className="flex min-h-screen flex-col justify-between bg-black p-6">
      {/* Skip Button */}
      <div className="flex justify-end pt-4">
        <Link
          href="/onboarding/categories"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Skip
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {!isConnecting ? (
          <>
            <div className="mb-8">
              <div className="mb-6 text-8xl">📸</div>
              <h1 className="mb-4 text-3xl font-bold text-white">
                Connect Your Instagram
              </h1>
              <p className="max-w-md text-lg text-gray-400">
                Link your Instagram account to showcase your reach and get matched with the best opportunities
              </p>
            </div>

            <div className="w-full max-w-md space-y-4">
              {/* Benefits List */}
              <div className="mb-8 space-y-3 rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
                <div className="flex items-start gap-3">
                  <span className="text-brand-cyan text-2xl">✓</span>
                  <div className="text-left">
                    <div className="font-semibold text-white">Better Matches</div>
                    <div className="text-sm text-gray-400">
                      Get offers tailored to your audience
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-brand-cyan text-2xl">✓</span>
                  <div className="text-left">
                    <div className="font-semibold text-white">Track Your Growth</div>
                    <div className="text-sm text-gray-400">
                      See your stats and tier progress
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-brand-cyan text-2xl">✓</span>
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
                className="w-full rounded-2xl bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] px-6 py-4 font-semibold text-white transition-all hover:scale-105 active:scale-95"
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
            <div className="mb-6 animate-pulse text-8xl">📸</div>
            <h2 className="mb-2 text-2xl font-bold text-white">
              Connecting...
            </h2>
            <p className="text-gray-400">Please wait a moment</p>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 pb-4">
        <div className="h-2 w-2 rounded-full bg-brand-cyan"></div>
        <div className="h-2 w-2 rounded-full bg-gray-700"></div>
        <div className="h-2 w-2 rounded-full bg-gray-700"></div>
      </div>
    </div>
  );
}
