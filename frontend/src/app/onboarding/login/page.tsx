"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-black p-6">
      {/* Header */}
      <div className="pt-8">
        <h1 className="mb-3 text-4xl font-bold text-white">
          Welcome Back
        </h1>
        <p className="text-lg text-gray-400">
          Sign in to continue your journey
        </p>
      </div>

      {/* Social Login Buttons */}
      <div className="flex-1 flex items-center">
        <div className="w-full max-w-md mx-auto space-y-4">
          {/* Instagram Login */}
          <Link
            href="/onboarding/connect-instagram"
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] px-6 py-4 text-white transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-2xl">📸</span>
            <span className="font-semibold">Continue with Instagram</span>
          </Link>

          {/* Google Login */}
          <button className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-700 bg-gray-900 px-6 py-4 text-white transition-all hover:border-gray-600 hover:bg-gray-800 active:scale-95">
            <span className="text-2xl">G</span>
            <span className="font-semibold">Continue with Google</span>
          </button>

          {/* Apple Login */}
          <button className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-700 bg-gray-900 px-6 py-4 text-white transition-all hover:border-gray-600 hover:bg-gray-800 active:scale-95">
            <span className="text-2xl"></span>
            <span className="font-semibold">Continue with Apple</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-4">
            <div className="h-px flex-1 bg-gray-800"></div>
            <span className="text-sm text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-800"></div>
          </div>

          {/* Email Option */}
          <button className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-brand-cyan bg-transparent px-6 py-4 text-brand-cyan transition-all hover:bg-brand-cyan/10 active:scale-95">
            <span className="text-2xl">✉️</span>
            <span className="font-semibold">Continue with Email</span>
          </button>
        </div>
      </div>

      {/* Terms */}
      <div className="text-center text-xs text-gray-500">
        By continuing, you agree to our{" "}
        <span className="text-brand-cyan">Terms of Service</span> and{" "}
        <span className="text-brand-cyan">Privacy Policy</span>
      </div>
    </div>
  );
}
