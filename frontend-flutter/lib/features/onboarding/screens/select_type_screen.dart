import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/widgets.dart';

enum UserType { creator, business }

class SelectTypeScreen extends StatefulWidget {
  const SelectTypeScreen({super.key});

  @override
  State<SelectTypeScreen> createState() => _SelectTypeScreenState();
}

class _SelectTypeScreenState extends State<SelectTypeScreen> {
  UserType? _selectedType;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16),
                // Back button
                IconButton(
                  onPressed: () => context.pop(),
                  icon: const Icon(
                    LucideIcons.arrowLeft,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 32),
                // Title
                Text(
                  'Who are you?',
                  style: AppTypography.h1,
                ).animate().fadeIn(duration: 500.ms).slideX(begin: -0.1, end: 0),
                const SizedBox(height: 8),
                Text(
                  'Select the option that best describes you',
                  style: AppTypography.body.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ).animate().fadeIn(delay: 100.ms, duration: 500.ms),
                const SizedBox(height: 48),
                // Creator option
                _TypeCard(
                  title: 'Creator',
                  description: 'I create content and want to collaborate with brands',
                  icon: LucideIcons.sparkles,
                  accentColor: AppColors.cyan,
                  isSelected: _selectedType == UserType.creator,
                  onTap: () => setState(() => _selectedType = UserType.creator),
                )
                    .animate()
                    .fadeIn(delay: 200.ms, duration: 500.ms)
                    .slideY(begin: 0.2, end: 0),
                const SizedBox(height: 16),
                // Business option
                _TypeCard(
                  title: 'Business',
                  description: 'I want to find creators for my brand campaigns',
                  icon: LucideIcons.building2,
                  accentColor: AppColors.magenta,
                  isSelected: _selectedType == UserType.business,
                  onTap: () => setState(() => _selectedType = UserType.business),
                )
                    .animate()
                    .fadeIn(delay: 300.ms, duration: 500.ms)
                    .slideY(begin: 0.2, end: 0),
                const Spacer(),
                // Continue button
                GradientButton(
                  text: 'Continue',
                  onPressed: _selectedType != null
                      ? () {
                          if (_selectedType == UserType.creator) {
                            context.push('/onboarding/location?type=creator');
                          } else {
                            context.push('/onboarding/business');
                          }
                        }
                      : null,
                  gradient: _selectedType == UserType.business
                      ? const LinearGradient(
                          colors: [AppColors.magenta, AppColors.purple],
                        )
                      : null,
                ).animate().fadeIn(delay: 400.ms, duration: 500.ms),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _TypeCard extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final Color accentColor;
  final bool isSelected;
  final VoidCallback onTap;

  const _TypeCard({
    required this.title,
    required this.description,
    required this.icon,
    required this.accentColor,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isSelected
              ? accentColor.withOpacity(0.1)
              : AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? accentColor : AppColors.surfaceLight,
            width: isSelected ? 2 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: accentColor.withOpacity(0.2),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ]
              : null,
        ),
        child: Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: isSelected
                    ? accentColor.withOpacity(0.2)
                    : AppColors.surfaceLight,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                icon,
                color: isSelected ? accentColor : AppColors.textSecondary,
                size: 28,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: AppTypography.h4.copyWith(
                      color: isSelected ? accentColor : AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isSelected ? accentColor : Colors.transparent,
                border: Border.all(
                  color: isSelected ? accentColor : AppColors.surfaceLight,
                  width: 2,
                ),
              ),
              child: isSelected
                  ? const Icon(
                      LucideIcons.check,
                      size: 14,
                      color: AppColors.background,
                    )
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}
