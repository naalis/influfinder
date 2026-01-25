import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/widgets.dart';

class SuccessScreen extends StatelessWidget {
  const SuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              children: [
                const Spacer(),
                // Welcome badge
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: AppColors.cyan.withOpacity(0.3),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.cyan.withOpacity(0.1),
                        blurRadius: 40,
                        spreadRadius: 10,
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      // Influfinder isotype with gradient
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              AppColors.magenta,
                              AppColors.purple,
                              AppColors.cyan,
                            ],
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.magenta.withOpacity(0.3),
                              blurRadius: 20,
                              offset: const Offset(-5, -5),
                            ),
                            BoxShadow(
                              color: AppColors.cyan.withOpacity(0.3),
                              blurRadius: 20,
                              offset: const Offset(5, 5),
                            ),
                          ],
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(18),
                          child: Image.asset(
                            'assets/images/isotype_white.png',
                            fit: BoxFit.contain,
                          ),
                        ),
                      )
                          .animate()
                          .scale(
                            begin: const Offset(0, 0),
                            end: const Offset(1, 1),
                            duration: 600.ms,
                            curve: Curves.elasticOut,
                          )
                          .then()
                          .shimmer(
                            duration: 1200.ms,
                            color: Colors.white.withOpacity(0.3),
                          ),
                      const SizedBox(height: 24),
                      Text(
                        'Welcome to Influfinder!',
                        style: AppTypography.h3,
                        textAlign: TextAlign.center,
                      ).animate().fadeIn(delay: 300.ms, duration: 500.ms),
                      const SizedBox(height: 8),
                      Text(
                        'Your creator profile is ready',
                        style: AppTypography.body.copyWith(
                          color: AppColors.textSecondary,
                        ),
                        textAlign: TextAlign.center,
                      ).animate().fadeIn(delay: 400.ms, duration: 500.ms),
                    ],
                  ),
                ).animate().fadeIn(duration: 500.ms).slideY(begin: 0.2, end: 0),
                const SizedBox(height: 32),
                // Tier card
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        AppColors.surface,
                        AppColors.surfaceLight.withOpacity(0.5),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.surfaceLight),
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: const Color(0xFF9CA3AF).withOpacity(0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(
                              LucideIcons.sprout,
                              color: Color(0xFF9CA3AF),
                              size: 24,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Tier 0',
                                  style: AppTypography.labelSmall.copyWith(
                                    color: AppColors.textSecondary,
                                  ),
                                ),
                                Text(
                                  'Newbie',
                                  style: AppTypography.h4,
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.cyan.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              'Just started',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.cyan,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // Progress bar
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '0 / 3 collabs to Tier 1',
                                style: AppTypography.caption,
                              ),
                              Text(
                                '0%',
                                style: AppTypography.caption.copyWith(
                                  color: AppColors.cyan,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Container(
                            height: 6,
                            decoration: BoxDecoration(
                              color: AppColors.surfaceLight,
                              borderRadius: BorderRadius.circular(3),
                            ),
                            child: FractionallySizedBox(
                              alignment: Alignment.centerLeft,
                              widthFactor: 0,
                              child: Container(
                                decoration: BoxDecoration(
                                  color: AppColors.cyan,
                                  borderRadius: BorderRadius.circular(3),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                )
                    .animate()
                    .fadeIn(delay: 500.ms, duration: 500.ms)
                    .slideY(begin: 0.2, end: 0),
                const SizedBox(height: 24),
                // Stats
                Row(
                  children: [
                    Expanded(
                      child: _StatCard(
                        value: '0',
                        label: 'Collabs',
                        icon: LucideIcons.users,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _StatCard(
                        value: '0',
                        label: 'Karma',
                        icon: LucideIcons.star,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _StatCard(
                        value: '0',
                        label: 'Exchanges',
                        icon: LucideIcons.repeat,
                      ),
                    ),
                  ],
                )
                    .animate()
                    .fadeIn(delay: 600.ms, duration: 500.ms)
                    .slideY(begin: 0.2, end: 0),
                const Spacer(),
                // CTA buttons
                GradientButton(
                  text: 'Explore Opportunities',
                  onPressed: () => context.go('/home'),
                ).animate().fadeIn(delay: 700.ms, duration: 500.ms),
                const SizedBox(height: 12),
                OutlinedButton(
                  onPressed: () => context.go('/profile'),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.surfaceLight),
                  ),
                  child: Text(
                    'View My Profile',
                    style: AppTypography.button.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ).animate().fadeIn(delay: 800.ms, duration: 500.ms),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String value;
  final String label;
  final IconData icon;

  const _StatCard({
    required this.value,
    required this.label,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceLight),
      ),
      child: Column(
        children: [
          Icon(
            icon,
            color: AppColors.textMuted,
            size: 20,
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: AppTypography.h4,
          ),
          Text(
            label,
            style: AppTypography.caption,
          ),
        ],
      ),
    );
  }
}
