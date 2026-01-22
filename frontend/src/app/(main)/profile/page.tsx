import TierBadge from "@/components/TierBadge";
import { getProgressToNextTier } from "@/lib/tiers";

export default function ProfilePage() {
  // Example user data
  const userCollabs = 7;
  const progress = getProgressToNextTier(userCollabs);

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <header className="mb-6 text-center">
          <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-brand-cyan to-brand-magenta p-1">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-black text-4xl">
              👤
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold">Your Profile</h1>
          <p className="text-sm text-gray-400">@creator_username</p>
        </header>

        {/* Tier Card */}
        <div className="mb-6 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">Current Tier</span>
            <TierBadge tier={progress.currentTier} size="lg" variant="gradient" />
          </div>

          {/* Progress to Next Tier */}
          {progress.nextTier && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Progress to Next Tier</span>
                <span className="font-semibold text-brand-cyan">
                  {progress.progress}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress.progress}%`,
                    backgroundImage: "linear-gradient(90deg, var(--brand-cyan) 0%, var(--brand-blue) 100%)",
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {progress.collabsNeeded} more collabs to reach the next tier
              </p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
            <div className="mb-1 text-2xl font-bold text-brand-cyan">{userCollabs}</div>
            <div className="text-xs text-gray-400">Collabs</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
            <div className="mb-1 text-2xl font-bold text-brand-magenta">2.5K</div>
            <div className="text-xs text-gray-400">Reach</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
            <div className="mb-1 text-2xl font-bold text-brand-purple">4.8</div>
            <div className="text-xs text-gray-400">Rating</div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-brand-purple/10 to-brand-blue/10 p-6 text-center">
          <div className="mb-2 text-4xl">⚙️</div>
          <h3 className="mb-1 font-semibold">More Features Coming</h3>
          <p className="text-sm text-gray-400">
            Edit profile, settings, and more
          </p>
        </div>
      </div>
    </div>
  );
}
