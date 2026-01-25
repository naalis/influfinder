import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../theme/app_colors.dart';

enum TierLevel {
  newbie,    // 0: 0-2 collabs
  explorer,  // 1: 3-9 collabs
  pro,       // 2: 10-24 collabs
  elite,     // 3: 25-49 collabs
  master,    // 4: 50-99 collabs
  legend,    // 5: 100+ collabs
}

class TierInfo {
  final TierLevel level;
  final String name;
  final String displayName;
  final Color color;
  final Color colorLight;
  final Color colorDark;
  final String description;
  final int minCollabs;
  final int? maxCollabs;
  final IconData icon;
  final List<String> benefits;

  const TierInfo({
    required this.level,
    required this.name,
    required this.displayName,
    required this.color,
    required this.colorLight,
    required this.colorDark,
    required this.description,
    required this.minCollabs,
    this.maxCollabs,
    required this.icon,
    required this.benefits,
  });
}

final List<TierInfo> tierInfoList = [
  TierInfo(
    level: TierLevel.newbie,
    name: 'newbie',
    displayName: 'Newbie',
    color: const Color(0xFF94A3B8),
    colorLight: const Color(0xFFCBD5E1),
    colorDark: const Color(0xFF64748B),
    description: 'Just getting started',
    minCollabs: 0,
    maxCollabs: 2,
    icon: LucideIcons.star,
    benefits: [
      'Access to basic offers',
      'Build your profile',
    ],
  ),
  TierInfo(
    level: TierLevel.explorer,
    name: 'explorer',
    displayName: 'Explorer',
    color: const Color(0xFF22C55E),
    colorLight: const Color(0xFF86EFAC),
    colorDark: const Color(0xFF16A34A),
    description: 'Learning the ropes',
    minCollabs: 3,
    maxCollabs: 9,
    icon: LucideIcons.sparkles,
    benefits: [
      'More offers available',
      'Priority support',
      'Basic analytics',
    ],
  ),
  TierInfo(
    level: TierLevel.pro,
    name: 'pro',
    displayName: 'Pro',
    color: AppColors.cyan,
    colorLight: const Color(0xFFA5F3FC),
    colorDark: const Color(0xFF06B6D4),
    description: 'Proven track record',
    minCollabs: 10,
    maxCollabs: 24,
    icon: LucideIcons.zap,
    benefits: [
      'Premium offers access',
      'Extended deadlines',
      'Detailed analytics',
      'Verified badge',
    ],
  ),
  TierInfo(
    level: TierLevel.elite,
    name: 'elite',
    displayName: 'Elite',
    color: AppColors.purple,
    colorLight: const Color(0xFFC4B5FD),
    colorDark: const Color(0xFF7C3AED),
    description: 'Top performer',
    minCollabs: 25,
    maxCollabs: 49,
    icon: LucideIcons.gem,
    benefits: [
      'Exclusive VIP offers',
      'Direct brand invites',
      'Priority matching',
      'Featured profile',
      'Early access to new features',
    ],
  ),
  TierInfo(
    level: TierLevel.master,
    name: 'master',
    displayName: 'Master',
    color: AppColors.magenta,
    colorLight: const Color(0xFFF9A8D4),
    colorDark: const Color(0xFFDB2777),
    description: 'Industry leader',
    minCollabs: 50,
    maxCollabs: 99,
    icon: LucideIcons.flame,
    benefits: [
      'All Elite benefits',
      'Custom collaboration terms',
      'Dedicated account manager',
      'Brand partnership opportunities',
      'Premium placement',
    ],
  ),
  TierInfo(
    level: TierLevel.legend,
    name: 'legend',
    displayName: 'Legend',
    color: const Color(0xFFFBBF24),
    colorLight: const Color(0xFFFDE68A),
    colorDark: const Color(0xFFD97706),
    description: 'Hall of fame',
    minCollabs: 100,
    maxCollabs: null,
    icon: LucideIcons.trophy,
    benefits: [
      'All Master benefits',
      'Legend status badge',
      'Exclusive events access',
      'Top creator perks',
      'Priority everything',
      'Brand ambassador opportunities',
    ],
  ),
];

class TierService {
  static TierLevel calculateTierLevel(int collabs) {
    if (collabs >= 100) return TierLevel.legend;
    if (collabs >= 50) return TierLevel.master;
    if (collabs >= 25) return TierLevel.elite;
    if (collabs >= 10) return TierLevel.pro;
    if (collabs >= 3) return TierLevel.explorer;
    return TierLevel.newbie;
  }

  static TierInfo getTierInfo(TierLevel level) {
    return tierInfoList.firstWhere((t) => t.level == level);
  }

  static TierInfo getTierInfoFromCollabs(int collabs) {
    return getTierInfo(calculateTierLevel(collabs));
  }

  static TierInfo? getNextTier(TierLevel currentLevel) {
    final currentIndex = TierLevel.values.indexOf(currentLevel);
    if (currentIndex >= TierLevel.values.length - 1) return null;
    return getTierInfo(TierLevel.values[currentIndex + 1]);
  }

  static double calculateProgress(int collabs) {
    final currentTier = getTierInfoFromCollabs(collabs);
    final nextTier = getNextTier(currentTier.level);

    if (nextTier == null) return 1.0; // Already at max tier

    final collabsInCurrentTier = collabs - currentTier.minCollabs;
    final collabsNeededForNext = nextTier.minCollabs - currentTier.minCollabs;

    return (collabsInCurrentTier / collabsNeededForNext).clamp(0.0, 1.0);
  }

  static int collabsToNextTier(int collabs) {
    final currentTier = getTierInfoFromCollabs(collabs);
    final nextTier = getNextTier(currentTier.level);

    if (nextTier == null) return 0; // Already at max tier
    return nextTier.minCollabs - collabs;
  }
}
