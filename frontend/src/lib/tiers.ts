/**
 * Tier System for Influfinder
 * Defines the gamification tiers (0-5) with metadata
 */

export type TierLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface TierInfo {
  level: TierLevel;
  name: string;
  displayName: string;
  color: string;
  colorLight: string;
  colorDark: string;
  description: string;
  minCollabs: number;
  emoji: string;
}

export const TIER_CONFIG: Record<TierLevel, TierInfo> = {
  0: {
    level: 0,
    name: "newbie",
    displayName: "Newbie",
    color: "tier-0",
    colorLight: "tier-0-light",
    colorDark: "tier-0-dark",
    description: "Just getting started on your creator journey",
    minCollabs: 0,
    emoji: "🌟",
  },
  1: {
    level: 1,
    name: "explorer",
    displayName: "Explorer",
    color: "tier-1",
    colorLight: "tier-1-light",
    colorDark: "tier-1-dark",
    description: "Building your presence with fresh collaborations",
    minCollabs: 3,
    emoji: "💫",
  },
  2: {
    level: 2,
    name: "pro",
    displayName: "Pro",
    color: "tier-2",
    colorLight: "tier-2-light",
    colorDark: "tier-2-dark",
    description: "Established creator with consistent impact",
    minCollabs: 10,
    emoji: "⚡",
  },
  3: {
    level: 3,
    name: "elite",
    displayName: "Elite",
    color: "tier-3",
    colorLight: "tier-3-light",
    colorDark: "tier-3-dark",
    description: "Premium influencer with exclusive opportunities",
    minCollabs: 25,
    emoji: "💎",
  },
  4: {
    level: 4,
    name: "master",
    displayName: "Master",
    color: "tier-4",
    colorLight: "tier-4-light",
    colorDark: "tier-4-dark",
    description: "Top-tier creator with powerful influence",
    minCollabs: 50,
    emoji: "🔥",
  },
  5: {
    level: 5,
    name: "legend",
    displayName: "Legend",
    color: "tier-5",
    colorLight: "tier-5-light",
    colorDark: "tier-5-dark",
    description: "Legendary creator - pinnacle of achievement",
    minCollabs: 100,
    emoji: "🏆",
  },
};

/**
 * Get tier info by level
 */
export function getTierInfo(level: TierLevel): TierInfo {
  return TIER_CONFIG[level];
}

/**
 * Get tier level based on number of completed collaborations
 */
export function calculateTierLevel(completedCollabs: number): TierLevel {
  if (completedCollabs >= 100) return 5;
  if (completedCollabs >= 50) return 4;
  if (completedCollabs >= 25) return 3;
  if (completedCollabs >= 10) return 2;
  if (completedCollabs >= 3) return 1;
  return 0;
}

/**
 * Get progress to next tier
 */
export function getProgressToNextTier(completedCollabs: number): {
  currentTier: TierLevel;
  nextTier: TierLevel | null;
  progress: number;
  collabsNeeded: number;
} {
  const currentTier = calculateTierLevel(completedCollabs);
  const nextTier = currentTier < 5 ? ((currentTier + 1) as TierLevel) : null;

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progress: 100,
      collabsNeeded: 0,
    };
  }

  const currentTierInfo = getTierInfo(currentTier);
  const nextTierInfo = getTierInfo(nextTier);
  const collabsNeeded = nextTierInfo.minCollabs - completedCollabs;
  const totalCollabsForNextTier = nextTierInfo.minCollabs - currentTierInfo.minCollabs;
  const currentProgress = completedCollabs - currentTierInfo.minCollabs;
  const progress = Math.round((currentProgress / totalCollabsForNextTier) * 100);

  return {
    currentTier,
    nextTier,
    progress,
    collabsNeeded,
  };
}
