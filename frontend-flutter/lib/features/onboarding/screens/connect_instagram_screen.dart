import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/widgets.dart';

class ConnectInstagramScreen extends StatefulWidget {
  const ConnectInstagramScreen({super.key});

  @override
  State<ConnectInstagramScreen> createState() => _ConnectInstagramScreenState();
}

class _ConnectInstagramScreenState extends State<ConnectInstagramScreen> {
  bool _isConnecting = false;

  void _connectInstagram() async {
    setState(() => _isConnecting = true);
    await Future.delayed(const Duration(seconds: 2));
    setState(() => _isConnecting = false);

    if (mounted) {
      context.go('/onboarding/categories');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Row(
                  children: [
                    IconButton(
                      onPressed: () => context.go('/onboarding/profile-setup'),
                      icon: const Icon(
                        LucideIcons.arrowLeft,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const Spacer(),
                    _ProgressDots(current: 1, total: 3),
                    const Spacer(),
                    TextButton(
                      onPressed: () => context.go('/onboarding/categories'),
                      child: Text(
                        'Skip',
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Scrollable content
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    children: [
                      const SizedBox(height: 32),
                      // Instagram icon
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(24),
                          gradient: const LinearGradient(
                            begin: Alignment.topRight,
                            end: Alignment.bottomLeft,
                            colors: [
                              Color(0xFFF58529),
                              Color(0xFFDD2A7B),
                              Color(0xFF8134AF),
                              Color(0xFF515BD4),
                            ],
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFDD2A7B).withValues(alpha: 0.4),
                              blurRadius: 30,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        child: const Icon(
                          LucideIcons.instagram,
                          color: Colors.white,
                          size: 48,
                        ),
                      ).animate().fadeIn(duration: 500.ms).scale(
                            begin: const Offset(0.8, 0.8),
                            end: const Offset(1, 1),
                            duration: 500.ms,
                            curve: Curves.easeOutBack,
                          ),
                      const SizedBox(height: 32),
                      // Title
                      Text(
                        'Connect Instagram',
                        style: AppTypography.h2,
                        textAlign: TextAlign.center,
                      ).animate().fadeIn(delay: 200.ms, duration: 500.ms),
                      const SizedBox(height: 12),
                      Text(
                        'Link your Instagram to unlock more features and show brands your best work',
                        style: AppTypography.body.copyWith(
                          color: AppColors.textSecondary,
                        ),
                        textAlign: TextAlign.center,
                      ).animate().fadeIn(delay: 300.ms, duration: 500.ms),
                      const SizedBox(height: 32),
                      // Benefits
                      _BenefitItem(
                        icon: LucideIcons.barChart2,
                        title: 'Show your stats',
                        description: 'Display your follower count and engagement rate',
                      ).animate().fadeIn(delay: 400.ms, duration: 500.ms).slideX(begin: -0.1, end: 0),
                      const SizedBox(height: 12),
                      _BenefitItem(
                        icon: LucideIcons.image,
                        title: 'Showcase your content',
                        description: 'Let brands see your best posts and style',
                      ).animate().fadeIn(delay: 500.ms, duration: 500.ms).slideX(begin: -0.1, end: 0),
                      const SizedBox(height: 12),
                      _BenefitItem(
                        icon: LucideIcons.star,
                        title: 'Get verified',
                        description: 'Build trust with a verified creator badge',
                      ).animate().fadeIn(delay: 600.ms, duration: 500.ms).slideX(begin: -0.1, end: 0),
                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
              // Bottom buttons
              Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Container(
                      width: double.infinity,
                      height: 56,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        gradient: const LinearGradient(
                          colors: [
                            Color(0xFFF58529),
                            Color(0xFFDD2A7B),
                            Color(0xFF8134AF),
                          ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFFDD2A7B).withValues(alpha: 0.3),
                            blurRadius: 20,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: _isConnecting ? null : _connectInstagram,
                          borderRadius: BorderRadius.circular(16),
                          child: Center(
                            child: _isConnecting
                                ? const SizedBox(
                                    width: 24,
                                    height: 24,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2.5,
                                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                    ),
                                  )
                                : Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      const Icon(
                                        LucideIcons.instagram,
                                        color: Colors.white,
                                      ),
                                      const SizedBox(width: 12),
                                      Text(
                                        'Connect Instagram',
                                        style: AppTypography.button.copyWith(color: Colors.white),
                                      ),
                                    ],
                                  ),
                          ),
                        ),
                      ),
                    ).animate().fadeIn(delay: 700.ms, duration: 500.ms),
                    const SizedBox(height: 12),
                    TextButton(
                      onPressed: () => context.go('/onboarding/categories'),
                      child: Text(
                        'I\'ll do this later',
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ProgressDots extends StatelessWidget {
  final int current;
  final int total;

  const _ProgressDots({
    required this.current,
    required this.total,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(total, (index) {
        final isActive = index <= current;
        return Container(
          width: 8,
          height: 8,
          margin: const EdgeInsets.symmetric(horizontal: 4),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isActive ? AppColors.cyan : AppColors.surfaceLight,
          ),
        );
      }),
    );
  }
}

class _BenefitItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;

  const _BenefitItem({
    required this.icon,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceLight),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.cyan.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              icon,
              color: AppColors.cyan,
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: AppTypography.label,
                ),
                const SizedBox(height: 2),
                Text(
                  description,
                  style: AppTypography.caption,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
