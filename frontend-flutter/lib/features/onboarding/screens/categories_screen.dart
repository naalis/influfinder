import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/widgets.dart';

class CategoriesScreen extends StatefulWidget {
  const CategoriesScreen({super.key});

  @override
  State<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends State<CategoriesScreen> {
  final Set<String> _selectedCategories = {};
  bool _isLoading = false;

  static const List<Map<String, dynamic>> _categories = [
    {'id': 'fashion', 'name': 'Fashion', 'icon': LucideIcons.shirt},
    {'id': 'beauty', 'name': 'Beauty', 'icon': LucideIcons.sparkles},
    {'id': 'lifestyle', 'name': 'Lifestyle', 'icon': LucideIcons.heart},
    {'id': 'travel', 'name': 'Travel', 'icon': LucideIcons.plane},
    {'id': 'food', 'name': 'Food', 'icon': LucideIcons.utensils},
    {'id': 'fitness', 'name': 'Fitness', 'icon': LucideIcons.dumbbell},
    {'id': 'tech', 'name': 'Technology', 'icon': LucideIcons.smartphone},
    {'id': 'gaming', 'name': 'Gaming', 'icon': LucideIcons.gamepad2},
    {'id': 'music', 'name': 'Music', 'icon': LucideIcons.music},
    {'id': 'art', 'name': 'Art', 'icon': LucideIcons.palette},
  ];

  void _toggleCategory(String id) {
    setState(() {
      if (_selectedCategories.contains(id)) {
        _selectedCategories.remove(id);
      } else {
        _selectedCategories.add(id);
      }
    });
  }

  void _continue() async {
    if (_selectedCategories.length < 3) return;

    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 1));
    setState(() => _isLoading = false);

    if (mounted) {
      context.go('/onboarding/success');
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
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        IconButton(
                          onPressed: () =>
                              context.go('/onboarding/connect-instagram'),
                          icon: const Icon(
                            LucideIcons.arrowLeft,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const Spacer(),
                        _ProgressDots(current: 2, total: 3),
                        const Spacer(),
                        const SizedBox(width: 48),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'What content do you create?',
                      style: AppTypography.h2,
                    ).animate().fadeIn(duration: 500.ms),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Text(
                          'Select at least 3 categories',
                          style: AppTypography.body.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: _selectedCategories.length >= 3
                                ? AppColors.cyan.withOpacity(0.2)
                                : AppColors.surface,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: _selectedCategories.length >= 3
                                  ? AppColors.cyan
                                  : AppColors.surfaceLight,
                            ),
                          ),
                          child: Text(
                            '${_selectedCategories.length} / 3',
                            style: AppTypography.labelSmall.copyWith(
                              color: _selectedCategories.length >= 3
                                  ? AppColors.cyan
                                  : AppColors.textSecondary,
                            ),
                          ),
                        ),
                      ],
                    ).animate().fadeIn(delay: 100.ms, duration: 500.ms),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              // Categories grid
              Expanded(
                child: GridView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 1.4,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: _categories.length,
                  itemBuilder: (context, index) {
                    final category = _categories[index];
                    final isSelected =
                        _selectedCategories.contains(category['id']);
                    final accentColor =
                        index % 2 == 0 ? AppColors.cyan : AppColors.magenta;

                    return _CategoryCard(
                      name: category['name'],
                      icon: category['icon'],
                      isSelected: isSelected,
                      accentColor: accentColor,
                      onTap: () => _toggleCategory(category['id']),
                    )
                        .animate()
                        .fadeIn(
                          delay: Duration(milliseconds: 200 + (index * 50)),
                          duration: 400.ms,
                        )
                        .scale(
                          begin: const Offset(0.9, 0.9),
                          end: const Offset(1, 1),
                          delay: Duration(milliseconds: 200 + (index * 50)),
                          duration: 400.ms,
                        );
                  },
                ),
              ),
              // Bottom button
              Padding(
                padding: const EdgeInsets.all(24),
                child: GradientButton(
                  text: 'Continue',
                  onPressed: _selectedCategories.length >= 3 ? _continue : null,
                  isLoading: _isLoading,
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

class _CategoryCard extends StatelessWidget {
  final String name;
  final IconData icon;
  final bool isSelected;
  final Color accentColor;
  final VoidCallback onTap;

  const _CategoryCard({
    required this.name,
    required this.icon,
    required this.isSelected,
    required this.accentColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          color: isSelected ? accentColor.withOpacity(0.1) : AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? accentColor : AppColors.surfaceLight,
            width: isSelected ? 2 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: accentColor.withOpacity(0.2),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Stack(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    icon,
                    color: isSelected ? accentColor : AppColors.textSecondary,
                    size: 28,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    name,
                    style: AppTypography.label.copyWith(
                      color: isSelected ? accentColor : AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
            if (isSelected)
              Positioned(
                top: 12,
                right: 12,
                child: Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: accentColor,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    LucideIcons.check,
                    color: AppColors.background,
                    size: 14,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
