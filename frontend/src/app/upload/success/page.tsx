"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle, Sparkles, ArrowRight, Home, FileCheck } from "lucide-react";

export default function UploadSuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <Sparkles className={`h-${4 + Math.floor(Math.random() * 4)} w-${4 + Math.floor(Math.random() * 4)} text-brand-cyan opacity-20`} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 text-center transition-all duration-1000 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        {/* Success Icon */}
        <div className="mb-8">
          <div
            className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 transition-all duration-700 delay-200 ${
              mounted ? "scale-100" : "scale-0"
            }`}
          >
            <CheckCircle className="h-12 w-12 text-green-400" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white">
            Content Submitted!
          </h1>
          <p className="text-lg text-gray-400">
            Your content has been verified and submitted successfully
          </p>
        </div>

        {/* Status Card */}
        <div
          className={`mx-auto mb-8 max-w-sm rounded-2xl border border-gray-800 bg-gray-900/50 p-6 transition-all duration-700 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <FileCheck className="h-6 w-6 text-brand-cyan" />
            <span className="font-semibold text-white">What happens next?</span>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-cyan/20 text-xs font-bold text-brand-cyan">
                1
              </div>
              <div className="text-sm text-gray-300">
                The brand will review your content within 24-48 hours
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-cyan/20 text-xs font-bold text-brand-cyan">
                2
              </div>
              <div className="text-sm text-gray-300">
                You'll receive a notification once approved
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-cyan/20 text-xs font-bold text-brand-cyan">
                3
              </div>
              <div className="text-sm text-gray-300">
                Your collaboration will be marked as completed
              </div>
            </div>
          </div>
        </div>

        {/* Karma Points */}
        <div
          className={`mx-auto mb-8 max-w-sm rounded-2xl border border-brand-magenta/30 bg-brand-magenta/10 p-4 transition-all duration-700 delay-500 ${
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-magenta" />
              <span className="text-sm font-medium text-white">Karma Earned</span>
            </div>
            <span className="text-xl font-bold text-brand-magenta">+50</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className={`space-y-3 transition-all duration-700 delay-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Link
            href="/collabs"
            className="flex w-full max-w-sm mx-auto items-center justify-center gap-2 rounded-full bg-brand-cyan px-8 py-4 font-semibold text-black transition-all hover:scale-105 active:scale-95"
          >
            View My Collabs
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            href="/home"
            className="flex w-full max-w-sm mx-auto items-center justify-center gap-2 rounded-full border border-gray-700 bg-transparent px-8 py-4 font-semibold text-white transition-all hover:border-gray-600 hover:bg-gray-900 active:scale-95"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
