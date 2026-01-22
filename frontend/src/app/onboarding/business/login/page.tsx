"use client";

import Link from "next/link";
import { Building2, Mail, ArrowLeft } from "lucide-react";

export default function BusinessLoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-black p-6">
      {/* Gradient background - magenta theme for business */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-magenta/20 via-black to-black" />

      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-brand-magenta/30 blur-3xl" />

      {/* Back Button */}
      <div className="relative z-10 pt-4">
        <Link
          href="/onboarding/select-type"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </Link>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="pt-4 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-magenta/20">
              <Building2 className="h-8 w-8 text-brand-magenta" />
            </div>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white">
            Business Portal
          </h1>
          <p className="text-lg text-gray-300">
            Connect with top creators for your brand
          </p>
        </div>
      </div>

      {/* Login Options */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-md mx-auto space-y-4">
          {/* Google Login */}
          <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-700 bg-gray-900/80 px-6 py-4 text-white transition-all hover:border-brand-magenta/50 hover:bg-gray-800 active:scale-95">
            <span className="text-2xl font-bold">G</span>
            <span className="font-semibold">Continue with Google</span>
          </button>

          {/* Microsoft Login */}
          <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-700 bg-gray-900/80 px-6 py-4 text-white transition-all hover:border-brand-magenta/50 hover:bg-gray-800 active:scale-95">
            <span className="text-2xl font-bold">M</span>
            <span className="font-semibold">Continue with Microsoft</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            <span className="text-sm text-gray-400">or</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>

          {/* Email Registration */}
          <Link
            href="/onboarding/business/register"
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-brand-magenta/50 bg-brand-magenta/10 px-6 py-4 text-brand-magenta transition-all hover:border-brand-magenta hover:bg-brand-magenta/20 active:scale-95"
          >
            <Mail className="h-6 w-6" />
            <span className="font-semibold">Register with Email</span>
          </Link>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-400 pt-4">
            Already have a business account?{" "}
            <button className="text-brand-magenta hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>

      {/* Terms */}
      <div className="relative z-10 text-center text-xs text-gray-400">
        By continuing, you agree to our{" "}
        <span className="text-brand-magenta hover:underline cursor-pointer">Business Terms</span> and{" "}
        <span className="text-brand-magenta hover:underline cursor-pointer">Privacy Policy</span>
      </div>
    </div>
  );
}
