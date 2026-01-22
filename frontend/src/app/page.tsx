import TierBadge from "@/components/TierBadge";
import { TIER_CONFIG, getProgressToNextTier, type TierLevel } from "@/lib/tiers";

export default function Home() {
  const tiers: TierLevel[] = [0, 1, 2, 3, 4, 5];

  // Example: User with 7 completed collabs
  const userCollabs = 7;
  const progress = getProgressToNextTier(userCollabs);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">
            Influfinder Creator App
          </h1>
          <p className="mt-2 text-lg text-foreground/70">
            Tier System Design Tokens
          </p>
        </div>

        {/* Current User Status Example */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-900">
          <h2 className="mb-4 text-xl font-semibold">Your Profile</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground/70">Current Tier:</span>
              <TierBadge tier={progress.currentTier} size="lg" variant="gradient" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/70">Progress to Next Tier</span>
                <span className="font-semibold">{progress.progress}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-tier-2 transition-all"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              <p className="text-sm text-foreground/70">
                {progress.collabsNeeded} collabs needed to reach{" "}
                {progress.nextTier && TIER_CONFIG[progress.nextTier].displayName}
              </p>
            </div>
          </div>
        </div>

        {/* All Tiers Showcase */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">All Tier Levels</h2>

          {/* Default Variant */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground/80">Default Style</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tiers.map((tier) => (
                <div
                  key={tier}
                  className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <TierBadge tier={tier} size="md" />
                    <span className="text-sm text-foreground/50">Tier {tier}</span>
                  </div>
                  <p className="text-sm text-foreground/70">
                    {TIER_CONFIG[tier].description}
                  </p>
                  <p className="mt-2 text-xs text-foreground/50">
                    Min. {TIER_CONFIG[tier].minCollabs} collabs
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Size Variations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground/80">Size Variations</h3>
            <div className="rounded-xl bg-white p-6 dark:bg-gray-900">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="w-16 text-sm text-foreground/70">Small:</span>
                  <TierBadge tier={2} size="sm" />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="w-16 text-sm text-foreground/70">Medium:</span>
                  <TierBadge tier={2} size="md" />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="w-16 text-sm text-foreground/70">Large:</span>
                  <TierBadge tier={2} size="lg" />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="w-16 text-sm text-foreground/70">XL:</span>
                  <TierBadge tier={2} size="xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Variant Styles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground/80">Style Variants</h3>
            <div className="rounded-xl bg-white p-6 dark:bg-gray-900">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="w-20 text-sm text-foreground/70">Default:</span>
                  <TierBadge tier={3} variant="default" />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="w-20 text-sm text-foreground/70">Outline:</span>
                  <TierBadge tier={3} variant="outline" />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="w-20 text-sm text-foreground/70">Gradient:</span>
                  <TierBadge tier={3} variant="gradient" />
                </div>
              </div>
            </div>
          </div>

          {/* All Tiers in Row */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground/80">Quick Reference</h3>
            <div className="flex flex-wrap gap-3 rounded-xl bg-white p-6 dark:bg-gray-900">
              {tiers.map((tier) => (
                <TierBadge key={tier} tier={tier} size="md" showLevel />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
