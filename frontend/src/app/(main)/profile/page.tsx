"use client";

import TierBadge from "@/components/TierBadge";
import { getProgressToNextTier, getTierInfo, TIER_CONFIG } from "@/lib/tiers";
import {
  User,
  Settings,
  ChevronRight,
  Star,
  TrendingUp,
  Award,
  Heart,
  Camera,
  Bell,
  HelpCircle,
  LogOut,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";

// Format number consistently to avoid hydration mismatch
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function ProfilePage() {
  // Example user data
  const userCollabs = 7;
  const userKarma = 850;
  const userReach = 2500;
  const userRating = 4.8;
  const progress = getProgressToNextTier(userCollabs);
  const currentTierInfo = getTierInfo(progress.currentTier);

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-gray-800 bg-gradient-to-br from-gray-900 to-black px-6 pb-8 pt-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan via-transparent to-brand-magenta" />
        </div>

        <div className="relative mx-auto max-w-lg">
          {/* Settings Button */}
          <Link
            href="/profile/settings"
            className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/50 transition-colors hover:bg-gray-800"
          >
            <Settings className="h-5 w-5 text-gray-400" />
          </Link>

          {/* Profile Avatar */}
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-brand-cyan to-brand-magenta p-1">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
                  <User className="h-12 w-12 text-white" />
                </div>
              </div>
              {/* Camera Button */}
              <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-cyan text-black transition-transform hover:scale-110">
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center">
            <h1 className="mb-1 text-2xl font-bold text-white">Creator Name</h1>
            <p className="mb-4 text-sm text-gray-400">@creator_username</p>

            {/* Tier Badge */}
            <div className="flex justify-center">
              <TierBadge tier={progress.currentTier} size="lg" variant="gradient" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-6 py-6">
        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-4 gap-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-center">
            <div className="mb-1 text-xl font-bold text-brand-cyan">{userCollabs}</div>
            <div className="text-xs text-gray-500">Collabs</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-center">
            <div className="mb-1 text-xl font-bold text-brand-magenta">{userKarma}</div>
            <div className="text-xs text-gray-500">Karma</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-center">
            <div className="mb-1 text-xl font-bold text-brand-purple">{formatNumber(userReach)}</div>
            <div className="text-xs text-gray-500">Reach</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-center">
            <div className="mb-1 flex items-center justify-center gap-1 text-xl font-bold text-yellow-400">
              <Star className="h-4 w-4" fill="currentColor" />
              {userRating}
            </div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
        </div>

        {/* Tier Progress Card */}
        <div className="mb-6 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-cyan" />
              <span className="font-semibold text-white">Tier Progress</span>
            </div>
            {progress.nextTier && (
              <span className="text-sm text-gray-400">
                Next: {getTierInfo(progress.nextTier).displayName}
              </span>
            )}
          </div>

          {progress.nextTier ? (
            <div className="space-y-3">
              {/* Progress Bar */}
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress.progress}%`,
                    backgroundImage: "linear-gradient(90deg, var(--brand-cyan) 0%, var(--brand-blue) 100%)",
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  {userCollabs} / {getTierInfo(progress.nextTier).minCollabs} collabs
                </span>
                <span className="font-semibold text-brand-cyan">
                  {progress.progress}%
                </span>
              </div>

              <p className="text-xs text-gray-500">
                Complete {progress.collabsNeeded} more collab{progress.collabsNeeded > 1 ? "s" : ""} to reach {getTierInfo(progress.nextTier).displayName}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl bg-brand-magenta/10 p-4">
              <Award className="h-8 w-8 text-brand-magenta" />
              <div>
                <div className="font-semibold text-white">Maximum Tier Achieved!</div>
                <div className="text-sm text-gray-400">
                  You've reached the pinnacle of achievement
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tier Benefits */}
        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <Zap className="h-5 w-5 text-brand-cyan" />
            Your Tier Benefits
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-cyan/20">
                <Star className="h-4 w-4 text-brand-cyan" />
              </div>
              <span className="text-gray-300">Access to Tier {progress.currentTier}+ offers</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-magenta/20">
                <Shield className="h-4 w-4 text-brand-magenta" />
              </div>
              <span className="text-gray-300">Priority application review</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-purple/20">
                <Heart className="h-4 w-4 text-brand-purple" />
              </div>
              <span className="text-gray-300">Enhanced profile visibility</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <Link
            href="/profile/settings"
            className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:bg-gray-900"
          >
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-gray-400" />
              <span className="text-white">Settings</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </Link>

          <Link
            href="/profile/notifications"
            className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:bg-gray-900"
          >
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-gray-400" />
              <span className="text-white">Notifications</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </Link>

          <Link
            href="/help"
            className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:bg-gray-900"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-gray-400" />
              <span className="text-white">Help & Support</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </Link>

          <button className="flex w-full items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-4 transition-colors hover:bg-red-500/20">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-red-400" />
              <span className="text-red-400">Sign Out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
