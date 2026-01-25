import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/widgets.dart';
import '../../../core/services/services.dart';
import '../../../core/models/models.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  int _currentPhotoIndex = 0;
  final PageController _pageController = PageController();

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  String _formatNumber(int num) {
    if (num >= 1000000) {
      return '${(num / 1000000).toStringAsFixed(1).replaceAll('.0', '')}M';
    }
    if (num >= 1000) {
      return '${(num / 1000).toStringAsFixed(1).replaceAll('.0', '')}K';
    }
    return num.toString();
  }

  @override
  Widget build(BuildContext context) {
    final authService = context.watch<AuthService>();
    final user = authService.user ?? mockUserProfile;
    final tierInfo = TierService.getTierInfoFromCollabs(user.collabs);
    final nextTier = TierService.getNextTier(tierInfo.level);
    final progress = TierService.calculateProgress(user.collabs);
    final collabsToNext = TierService.collabsToNextTier(user.collabs);

    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                _buildPhotoGallery(user),
                const SizedBox(height: 24),
                _buildProfileInfo(user, tierInfo),
                const SizedBox(height: 24),
                _buildStatsGrid(user),
                const SizedBox(height: 24),
                _buildConnectedAccounts(user, authService),
                const SizedBox(height: 24),
                _buildTierProgress(user, tierInfo, nextTier, progress, collabsToNext),
                const SizedBox(height: 24),
                _buildTierBenefits(tierInfo),
                const SizedBox(height: 24),
                _buildCategories(user),
                const SizedBox(height: 24),
                _buildMenuItems(context, authService),
                const SizedBox(height: 100),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPhotoGallery(UserProfile user) {
    final photos = user.photos.isNotEmpty
        ? user.photos
        : ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80'];

    return SizedBox(
      height: 220,
      child: Stack(
        children: [
          PageView.builder(
            controller: _pageController,
            itemCount: photos.length,
            onPageChanged: (index) => setState(() => _currentPhotoIndex = index),
            itemBuilder: (context, index) {
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  color: AppColors.surfaceLight,
                ),
                clipBehavior: Clip.antiAlias,
                child: Image.network(
                  photos[index],
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => const Center(
                    child: Icon(LucideIcons.image, color: AppColors.textMuted, size: 48),
                  ),
                ),
              );
            },
          ),
          // Photo indicators
          Positioned(
            bottom: 12,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(photos.length, (index) {
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: _currentPhotoIndex == index ? 20 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: _currentPhotoIndex == index
                        ? AppColors.cyan
                        : Colors.white.withValues(alpha: 0.5),
                    borderRadius: BorderRadius.circular(4),
                  ),
                );
              }),
            ),
          ),
          // Photo counter
          Positioned(
            top: 12,
            left: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.background.withValues(alpha: 0.8),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '${_currentPhotoIndex + 1} / ${photos.length}',
                style: AppTypography.labelSmall,
              ),
            ),
          ),
          // Settings button
          Positioned(
            top: 12,
            right: 12,
            child: GestureDetector(
              onTap: () {
                // Navigate to settings
              },
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.background.withValues(alpha: 0.8),
                  shape: BoxShape.circle,
                ),
                child: const Icon(LucideIcons.settings, color: AppColors.textSecondary, size: 20),
              ),
            ),
          ),
          // Edit photos button
          Positioned(
            bottom: 12,
            right: 12,
            child: GestureDetector(
              onTap: () {
                // Edit photos
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.background.withValues(alpha: 0.8),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(LucideIcons.pencil, size: 14, color: AppColors.cyan),
                    const SizedBox(width: 6),
                    Text('Edit', style: AppTypography.labelSmall.copyWith(color: AppColors.cyan)),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileInfo(UserProfile user, TierInfo tierInfo) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(user.name, style: AppTypography.h2),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [tierInfo.color, tierInfo.colorDark],
                ),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: tierInfo.color.withValues(alpha: 0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(tierInfo.icon, size: 12, color: Colors.white),
                  const SizedBox(width: 4),
                  Text(tierInfo.displayName, style: AppTypography.labelSmall.copyWith(color: Colors.white)),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          user.username,
          style: AppTypography.body.copyWith(color: AppColors.textSecondary),
        ),
        if (user.location != null) ...[
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(LucideIcons.mapPin, size: 14, color: AppColors.textMuted),
              const SizedBox(width: 4),
              Text(
                user.location!,
                style: AppTypography.bodySmall.copyWith(color: AppColors.textMuted),
              ),
            ],
          ),
        ],
        if (user.bio != null) ...[
          const SizedBox(height: 8),
          Text(
            user.bio!,
            style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary),
            textAlign: TextAlign.center,
          ),
        ],
      ],
    );
  }

  Widget _buildStatsGrid(UserProfile user) {
    return Row(
      children: [
        _StatCard(value: '${user.collabs}', label: 'Collabs', color: AppColors.cyan),
        const SizedBox(width: 12),
        _StatCard(value: '${user.karma}', label: 'Karma', color: AppColors.magenta),
        const SizedBox(width: 12),
        _StatCard(value: _formatNumber(user.reach), label: 'Reach', color: AppColors.purple),
        const SizedBox(width: 12),
        _StatCard(
          value: user.rating.toStringAsFixed(1),
          label: 'Rating',
          color: const Color(0xFFFACC15),
          icon: LucideIcons.star,
        ),
      ],
    );
  }

  Widget _buildConnectedAccounts(UserProfile user, AuthService authService) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Connected Accounts', style: AppTypography.label),
              Text(
                '${user.socialAccounts.where((a) => a.connected).length}/${user.socialAccounts.length}',
                style: AppTypography.caption,
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...user.socialAccounts.map((account) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _SocialAccountTile(
                account: account,
                onConnect: () => _connectAccount(context, account.platform),
                onDisconnect: () => _showDisconnectDialog(context, authService, account.platform),
              ),
            );
          }),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(LucideIcons.info, size: 14, color: AppColors.textMuted),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Connect more accounts to increase your reach and get better offers',
                  style: AppTypography.caption.copyWith(fontSize: 11),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _connectAccount(BuildContext context, SocialPlatform platform) {
    String route;
    switch (platform) {
      case SocialPlatform.instagram:
        route = '/connect/instagram';
        break;
      case SocialPlatform.tiktok:
        route = '/connect/tiktok';
        break;
      case SocialPlatform.youtube:
        route = '/connect/youtube';
        break;
    }
    context.push(route);
  }

  void _showDisconnectDialog(BuildContext context, AuthService authService, SocialPlatform platform) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: Text('Disconnect ${platform.name.capitalize()}?', style: AppTypography.h4),
        content: Text(
          'Are you sure you want to disconnect this account? You can reconnect it later.',
          style: AppTypography.body.copyWith(color: AppColors.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel', style: AppTypography.label.copyWith(color: AppColors.textSecondary)),
          ),
          TextButton(
            onPressed: () {
              authService.disconnectSocialAccount(platform);
              Navigator.pop(context);
            },
            child: Text('Disconnect', style: AppTypography.label.copyWith(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  Widget _buildTierProgress(
    UserProfile user,
    TierInfo tierInfo,
    TierInfo? nextTier,
    double progress,
    int collabsToNext,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.surface, tierInfo.color.withValues(alpha: 0.1)],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: tierInfo.color.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(LucideIcons.trendingUp, size: 20, color: tierInfo.color),
                  const SizedBox(width: 8),
                  Text('Tier Progress', style: AppTypography.label),
                ],
              ),
              if (nextTier != null)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: nextTier.color.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(nextTier.icon, size: 12, color: nextTier.color),
                      const SizedBox(width: 4),
                      Text(
                        'Next: ${nextTier.displayName}',
                        style: AppTypography.caption.copyWith(color: nextTier.color),
                      ),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          // Progress bar
          Container(
            height: 12,
            decoration: BoxDecoration(
              color: AppColors.surfaceLight,
              borderRadius: BorderRadius.circular(6),
            ),
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: progress,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [tierInfo.color, tierInfo.colorLight],
                  ),
                  borderRadius: BorderRadius.circular(6),
                  boxShadow: [
                    BoxShadow(
                      color: tierInfo.color.withValues(alpha: 0.5),
                      blurRadius: 8,
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                nextTier != null
                    ? '${user.collabs} / ${nextTier.minCollabs} collabs'
                    : '${user.collabs} collabs (Max tier!)',
                style: AppTypography.caption,
              ),
              Text(
                '${(progress * 100).toInt()}%',
                style: AppTypography.label.copyWith(color: tierInfo.color),
              ),
            ],
          ),
          if (nextTier != null) ...[
            const SizedBox(height: 8),
            Text(
              'Complete $collabsToNext more collab${collabsToNext != 1 ? 's' : ''} to reach ${nextTier.displayName}',
              style: AppTypography.caption.copyWith(color: AppColors.textMuted),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildTierBenefits(TierInfo tierInfo) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(tierInfo.icon, size: 20, color: tierInfo.color),
              const SizedBox(width: 8),
              Text('${tierInfo.displayName} Benefits', style: AppTypography.label),
            ],
          ),
          const SizedBox(height: 16),
          ...tierInfo.benefits.asMap().entries.map((entry) {
            final colors = [AppColors.cyan, AppColors.magenta, AppColors.purple, AppColors.blue];
            final color = colors[entry.key % colors.length];
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(LucideIcons.check, size: 16, color: color),
                  ),
                  const SizedBox(width: 12),
                  Expanded(child: Text(entry.value, style: AppTypography.bodySmall)),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildCategories(UserProfile user) {
    final categoryColors = {
      'food': Colors.orange,
      'travel': Colors.blue,
      'fashion': Colors.pink,
      'fitness': Colors.green,
      'beauty': Colors.purple,
      'lifestyle': Colors.yellow.shade700,
      'gaming': Colors.red,
      'music': Colors.indigo,
      'photography': Colors.cyan,
      'education': Colors.teal,
    };

    final categoryIcons = {
      'food': LucideIcons.utensils,
      'travel': LucideIcons.plane,
      'fashion': LucideIcons.shirt,
      'fitness': LucideIcons.dumbbell,
      'beauty': LucideIcons.sparkles,
      'lifestyle': LucideIcons.home,
      'gaming': LucideIcons.gamepad2,
      'music': LucideIcons.music,
      'photography': LucideIcons.camera,
      'education': LucideIcons.bookOpen,
    };

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Content Categories', style: AppTypography.label),
              GestureDetector(
                onTap: () {
                  // Edit categories
                },
                child: const Icon(LucideIcons.pencil, size: 16, color: AppColors.textMuted),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: user.categories.map((cat) {
              final color = categoryColors[cat.toLowerCase()] ?? AppColors.cyan;
              final icon = categoryIcons[cat.toLowerCase()] ?? LucideIcons.tag;

              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: color.withValues(alpha: 0.3)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(icon, size: 14, color: color),
                    const SizedBox(width: 6),
                    Text(
                      cat[0].toUpperCase() + cat.substring(1),
                      style: AppTypography.labelSmall.copyWith(color: color),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuItems(BuildContext context, AuthService authService) {
    return Column(
      children: [
        _MenuItem(icon: LucideIcons.settings, label: 'Settings', onTap: () {}),
        const SizedBox(height: 8),
        _MenuItem(icon: LucideIcons.bell, label: 'Notifications', onTap: () {}),
        const SizedBox(height: 8),
        _MenuItem(icon: LucideIcons.helpCircle, label: 'Help & Support', onTap: () {}),
        const SizedBox(height: 8),
        _MenuItem(
          icon: LucideIcons.logOut,
          label: 'Sign Out',
          isDestructive: true,
          onTap: () async {
            await authService.logout();
            if (context.mounted) {
              context.go('/onboarding');
            }
          },
        ),
      ],
    );
  }
}

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }
}

class _StatCard extends StatelessWidget {
  final String value;
  final String label;
  final Color color;
  final IconData? icon;

  const _StatCard({
    required this.value,
    required this.label,
    required this.color,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.surfaceLight),
        ),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (icon != null) ...[
                  Icon(icon, size: 14, color: color),
                  const SizedBox(width: 4),
                ],
                Text(value, style: AppTypography.h4.copyWith(color: color)),
              ],
            ),
            const SizedBox(height: 4),
            Text(label, style: AppTypography.caption.copyWith(fontSize: 10)),
          ],
        ),
      ),
    );
  }
}

class _SocialAccountTile extends StatelessWidget {
  final SocialAccount account;
  final VoidCallback onConnect;
  final VoidCallback onDisconnect;

  const _SocialAccountTile({
    required this.account,
    required this.onConnect,
    required this.onDisconnect,
  });

  Color get _platformColor {
    switch (account.platform) {
      case SocialPlatform.instagram:
        return const Color(0xFFE4405F);
      case SocialPlatform.tiktok:
        return const Color(0xFF00F2EA);
      case SocialPlatform.youtube:
        return const Color(0xFFFF0000);
    }
  }

  IconData get _platformIcon {
    switch (account.platform) {
      case SocialPlatform.instagram:
        return LucideIcons.instagram;
      case SocialPlatform.tiktok:
        return LucideIcons.music2;
      case SocialPlatform.youtube:
        return LucideIcons.youtube;
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: account.connected ? null : onConnect,
      onLongPress: account.connected ? onDisconnect : null,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: account.connected
              ? _platformColor.withValues(alpha: 0.1)
              : AppColors.surfaceLight,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: account.connected
                ? _platformColor.withValues(alpha: 0.3)
                : AppColors.surfaceLight,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                gradient: account.connected
                    ? LinearGradient(
                        colors: account.platform == SocialPlatform.instagram
                            ? [
                                const Color(0xFFFEDA77),
                                const Color(0xFFF58529),
                                const Color(0xFFDD2A7B),
                                const Color(0xFF8134AF),
                              ]
                            : [_platformColor, _platformColor.withValues(alpha: 0.8)],
                      )
                    : null,
                color: account.connected ? null : AppColors.textMuted,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(_platformIcon, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: account.connected
                  ? Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(account.platformName, style: AppTypography.label),
                            if (account.verified) ...[
                              const SizedBox(width: 4),
                              Icon(LucideIcons.badgeCheck, size: 14, color: _platformColor),
                            ],
                          ],
                        ),
                        Text(
                          '@${account.username} • ${account.formattedFollowers} followers • ${account.formattedEngagement} eng.',
                          style: AppTypography.caption.copyWith(fontSize: 10),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    )
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Connect ${account.platformName}',
                          style: AppTypography.label.copyWith(color: AppColors.textSecondary),
                        ),
                        Text(
                          'Tap to connect your account',
                          style: AppTypography.caption.copyWith(fontSize: 10),
                        ),
                      ],
                    ),
            ),
            Icon(
              account.connected ? LucideIcons.checkCircle : LucideIcons.plus,
              size: 20,
              color: account.connected ? _platformColor : AppColors.textMuted,
            ),
          ],
        ),
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isDestructive;
  final VoidCallback onTap;

  const _MenuItem({
    required this.icon,
    required this.label,
    this.isDestructive = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = isDestructive ? Colors.red.shade400 : AppColors.textPrimary;
    final bgColor = isDestructive ? Colors.red.withValues(alpha: 0.1) : AppColors.surface;
    final borderColor = isDestructive ? Colors.red.withValues(alpha: 0.3) : AppColors.surfaceLight;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: borderColor),
        ),
        child: Row(
          children: [
            Icon(icon, size: 20, color: isDestructive ? color : AppColors.textMuted),
            const SizedBox(width: 12),
            Expanded(child: Text(label, style: AppTypography.body.copyWith(color: color))),
            if (!isDestructive) const Icon(LucideIcons.chevronRight, size: 20, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }
}
