"use client";

import Link from "next/link";
import { useState } from "react";
import { Instagram, Mail, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      window.location.href = "/onboarding/profile-setup";
    }, 1500);
  };

  if (showEmailForm) {
    return (
      <div className="relative flex min-h-screen flex-col bg-black p-6">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/20 via-black to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-brand-purple/30 blur-3xl" />

        {/* Back Button */}
        <div className="relative z-10 pt-4">
          <button
            onClick={() => setShowEmailForm(false)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="relative z-10 pt-8 text-center">
          <h1 className="mb-3 text-4xl font-bold text-white">
            Create Account
          </h1>
          <p className="text-lg text-gray-300">
            Sign up with your email
          </p>
        </div>

        {/* Form */}
        <div className="relative z-10 flex-1 flex items-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full rounded-2xl border bg-gray-900/80 px-4 py-4 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-gray-700 focus:border-brand-cyan focus:ring-brand-cyan/50"
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full rounded-2xl border bg-gray-900/80 px-4 py-4 pr-12 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500/50"
                      : "border-gray-700 focus:border-brand-cyan focus:ring-brand-cyan/50"
                  }`}
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full rounded-2xl border bg-gray-900/80 px-4 py-4 pr-12 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500/50"
                      : "border-gray-700 focus:border-brand-cyan focus:ring-brand-cyan/50"
                  }`}
                  placeholder="Repeat your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-magenta px-6 py-4 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-brand-purple/30 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                className="text-brand-cyan hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>

        {/* Terms */}
        <div className="relative z-10 text-center text-xs text-gray-400">
          By creating an account, you agree to our{" "}
          <span className="text-brand-cyan hover:underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="text-brand-cyan hover:underline cursor-pointer">Privacy Policy</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-black p-6">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/20 via-black to-black" />

      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-brand-purple/30 blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="pt-8 text-center">
          <h1 className="mb-3 text-4xl font-bold text-white">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-300">
            Sign in to continue your journey
          </p>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-md mx-auto space-y-4">
          {/* Instagram Login */}
          <Link
            href="/onboarding/connect-instagram"
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] px-6 py-4 text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#dc2743]/30 active:scale-95"
          >
            <Instagram className="h-6 w-6" />
            <span className="font-semibold">Continue with Instagram</span>
          </Link>

          {/* Google Login */}
          <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-700 bg-gray-900/80 px-6 py-4 text-white transition-all hover:border-brand-cyan/50 hover:bg-gray-800 active:scale-95">
            <span className="text-2xl font-bold">G</span>
            <span className="font-semibold">Continue with Google</span>
          </button>

          {/* Apple Login */}
          <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-700 bg-gray-900/80 px-6 py-4 text-white transition-all hover:border-brand-cyan/50 hover:bg-gray-800 active:scale-95">
            <span className="text-2xl"></span>
            <span className="font-semibold">Continue with Apple</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            <span className="text-sm text-gray-400">or</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>

          {/* Email Option */}
          <button
            onClick={() => setShowEmailForm(true)}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-brand-cyan/50 bg-brand-cyan/10 px-6 py-4 text-brand-cyan transition-all hover:border-brand-cyan hover:bg-brand-cyan/20 active:scale-95"
          >
            <Mail className="h-6 w-6" />
            <span className="font-semibold">Continue with Email</span>
          </button>
        </div>
      </div>

      {/* Terms */}
      <div className="relative z-10 text-center text-xs text-gray-400">
        By continuing, you agree to our{" "}
        <span className="text-brand-cyan hover:underline cursor-pointer">Terms of Service</span> and{" "}
        <span className="text-brand-cyan hover:underline cursor-pointer">Privacy Policy</span>
      </div>
    </div>
  );
}
