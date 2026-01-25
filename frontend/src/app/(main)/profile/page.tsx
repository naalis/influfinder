"use client";

import TierBadge from "@/components/TierBadge";
import PhotoGallery from "@/components/profile/PhotoGallery";
import ConnectedAccounts from "@/components/profile/ConnectedAccounts";
import CreatorCategories from "@/components/profile/CreatorCategories";
import { getProgressToNextTier, getTierInfo } from "@/lib/tiers";
import {
  Settings,
  ChevronRight,
  Star,
  TrendingUp,
  Award,
  Heart,
  Bell,
  HelpCircle,
  LogOut,
  Shield,
  Zap,
  MapPin,
} from "lucide-react";
import Link from "next/link";

// Format number consistently to avoid hydration mismatch
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export default function ProfilePage() {
  // Example user data
  const userData = {
    name: "Sofia Martinez",
    username: "sofia.creates",
    location: "Miami, FL",
    bio: "Food & Travel Creator | Exploring the world one bite at a time",
    collabs: 7,
    karma: 850,
    reach: 125000,
    rating: 4.8,
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    ],
    socialAccounts: [
      {
        platform: "instagram" as const,
        username: "sofia.creates",
        followers: 125000,
        engagementRate: 4.8,
        verified: true,
        connected: true,
      },
      {
        platform: "tiktok" as const,
        username: "sofiacreates",
        followers: 89000,
        engagementRate: 6.2,
        verified: false,
        connected: true,
      },
      {
        platform: "youtube" as const,
        connected: false,
      },
    ],
    categories: ["food", "travel", "lifestyle", "photography"],
  };

  const progress = getProgressToNextTier(userData.collabs);

  const handleAddPhoto = () => {
    // TODO: Implement photo upload modal
    console.log("Add photo clicked");
  };

  const handleConnectAccount = (platform: string) => {
    // TODO: Implement OAuth flow
    console.log("Connect", platform);
  };

  const handleEditCategories = () => {
    // TODO: Implement category edit modal
    console.log("Edit categories clicked");
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Main Container - Centered with max-width 500px */}
      <div className="mx-auto max-w-[500px] px-6 pt-6">
        {/* Photo Gallery Section */}
        <div className="relative mb-6">
          <PhotoGallery
            photos={userData.photos}
            onAddPhoto={handleAddPhoto}
            editable={true}
          />

          {/* Settings Button - Floating */}
          <Link
            href="/profile/settings"
            className="absolute -right-2 top-0 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 transition-colors hover:bg-gray-800"
          >
            <Settings className="h-5 w-5 text-gray-400" />
          </Link>
        </div>
        {/* Name, Username, Location */}
        <div className="mb-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
            <TierBadge tier={progress.currentTier} size="sm" />
          </div>
          <p className="mb-1 text-gray-400">@{userData.username}</p>
          <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5" />
            {userData.location}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-4 gap-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-center">
            <div className="mb-1 text-xl font-bold text-brand-cyan">{userData.collabs}</div>
            <div className="text-xs text-gray-500">Collabs</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-center">
            <div className="mb-1 text-xl font-bold text-brand-magenta">{userData.karma}</div>
            <div className="text-xs text-gray-500">Karma</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-center">
            <div className="mb-1 text-xl font-bold text-brand-purple">{formatNumber(userData.reach)}</div>
            <div className="text-xs text-gray-500">Reach</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-center">
            <div className="mb-1 flex items-center justify-center gap-1 text-xl font-bold text-yellow-400">
              <Star className="h-4 w-4" fill="currentColor" />
              {userData.rating}
            </div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="mb-6">
          <ConnectedAccounts
            accounts={userData.socialAccounts}
            onConnect={handleConnectAccount}
          />
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
                    backgroundImage: "linear-gradient(90deg, #75FBDE 0%, #1020E0 100%)",
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  {userData.collabs} / {getTierInfo(progress.nextTier).minCollabs} collabs
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

        {/* Creator Categories */}
        <div className="mb-6">
          <CreatorCategories
            categories={userData.categories}
            onEdit={handleEditCategories}
            editable={true}
          />
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
