import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/widgets.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Notifications', style: AppTypography.h2),
                        const SizedBox(height: 4),
                        Text(
                          'Stay updated on your collabs',
                          style: AppTypography.body.copyWith(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(LucideIcons.settings, size: 20, color: AppColors.textMuted),
                    ),
                  ],
                ),
              ),
              // Notifications List
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  children: [
                    _buildSectionHeader('Today'),
                    _NotificationTile(
                      icon: LucideIcons.mail,
                      iconColor: AppColors.magenta,
                      title: 'New Invitation!',
                      subtitle: 'Paradise Beach Resort wants to collaborate with you',
                      time: '2h ago',
                      isUnread: true,
                    ),
                    _NotificationTile(
                      icon: LucideIcons.checkCircle,
                      iconColor: const Color(0xFF4ADE80),
                      title: 'Application Accepted',
                      subtitle: 'Glow Beauty Bar accepted your application',
                      time: '5h ago',
                      isUnread: true,
                    ),
                    const SizedBox(height: 16),
                    _buildSectionHeader('Yesterday'),
                    _NotificationTile(
                      icon: LucideIcons.clock,
                      iconColor: const Color(0xFFFB923C),
                      title: 'Reminder',
                      subtitle: 'Your visit to Bella Vita is scheduled for tomorrow',
                      time: '1d ago',
                    ),
                    _NotificationTile(
                      icon: LucideIcons.star,
                      iconColor: const Color(0xFFFACC15),
                      title: 'New Review',
                      subtitle: 'Café Deluxe left you a 5-star review!',
                      time: '1d ago',
                    ),
                    const SizedBox(height: 16),
                    _buildSectionHeader('This Week'),
                    _NotificationTile(
                      icon: LucideIcons.trendingUp,
                      iconColor: AppColors.cyan,
                      title: 'Level Up!',
                      subtitle: 'You\'re close to reaching Tier 3',
                      time: '3d ago',
                    ),
                    _NotificationTile(
                      icon: LucideIcons.gift,
                      iconColor: AppColors.purple,
                      title: 'New Offer Available',
                      subtitle: 'TechHub Store posted a new collaboration',
                      time: '4d ago',
                    ),
                    _NotificationTile(
                      icon: LucideIcons.messageCircle,
                      iconColor: const Color(0xFF60A5FA),
                      title: 'New Message',
                      subtitle: 'FitZone Gym sent you a message',
                      time: '5d ago',
                    ),
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(
        title,
        style: AppTypography.label.copyWith(color: AppColors.textSecondary),
      ),
    );
  }
}

class _NotificationTile extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final String time;
  final bool isUnread;

  const _NotificationTile({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.time,
    this.isUnread = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isUnread ? iconColor.withOpacity(0.05) : AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isUnread ? iconColor.withOpacity(0.2) : AppColors.surfaceLight,
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: iconColor, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: AppTypography.label.copyWith(
                          color: isUnread ? AppColors.textPrimary : AppColors.textSecondary,
                        ),
                      ),
                    ),
                    Text(
                      time,
                      style: AppTypography.caption.copyWith(fontSize: 10),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          if (isUnread) ...[
            const SizedBox(width: 8),
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: iconColor,
                shape: BoxShape.circle,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
