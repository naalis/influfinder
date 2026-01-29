import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/widgets.dart';

class BusinessOnboardingScreen extends StatefulWidget {
  const BusinessOnboardingScreen({super.key});

  @override
  State<BusinessOnboardingScreen> createState() =>
      _BusinessOnboardingScreenState();
}

class _BusinessOnboardingScreenState extends State<BusinessOnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (_currentPage < 2) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      context.push('/onboarding/location?type=business');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: Column(
            children: [
              // Header with back button
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Row(
                  children: [
                    IconButton(
                      onPressed: () {
                        if (_currentPage == 0) {
                          context.pop();
                        } else {
                          _pageController.previousPage(
                            duration: const Duration(milliseconds: 300),
                            curve: Curves.easeInOut,
                          );
                        }
                      },
                      icon: const Icon(
                        LucideIcons.arrowLeft,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
              ),
              // PageView
              Expanded(
                child: PageView(
                  controller: _pageController,
                  onPageChanged: (page) => setState(() => _currentPage = page),
                  children: const [
                    _OrganizationPage(),
                    _EstablishmentsPage(),
                    _ChecklistPage(),
                  ],
                ),
              ),
              // Bottom button
              Padding(
                padding: const EdgeInsets.all(24),
                child: GradientButton(
                  text: _currentPage == 2 ? 'Get Started' : 'Next',
                  onPressed: _nextPage,
                  gradient: const LinearGradient(
                    colors: [AppColors.magenta, AppColors.purple],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Page 1: Organization & Brands
class _OrganizationPage extends StatelessWidget {
  const _OrganizationPage();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 16),
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'How it works?',
                      style: AppTypography.body.copyWith(
                        color: AppColors.textMuted,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Create Organization\n& Brands inside of it',
                      style: AppTypography.h2,
                    ),
                  ],
                ),
              ),
              Text(
                '1/3',
                style: AppTypography.body.copyWith(
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ).animate().fadeIn(duration: 500.ms),
          const SizedBox(height: 32),
          // Illustration
          Center(
            child: Container(
              width: 160,
              height: 160,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppColors.magenta.withValues(alpha: 0.2),
                    AppColors.purple.withValues(alpha: 0.2),
                  ],
                ),
                borderRadius: BorderRadius.circular(32),
              ),
              child: const Icon(
                LucideIcons.building2,
                size: 80,
                color: AppColors.magenta,
              ),
            ),
          ).animate().fadeIn(delay: 200.ms, duration: 500.ms).scale(
                begin: const Offset(0.8, 0.8),
                end: const Offset(1, 1),
              ),
          const SizedBox(height: 32),
          // Diagram
          const _OrganizationDiagram()
              .animate()
              .fadeIn(delay: 400.ms, duration: 500.ms),
        ],
      ),
    );
  }
}

// Page 2: Establishments within Brands
class _EstablishmentsPage extends StatelessWidget {
  const _EstablishmentsPage();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 16),
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'How it works?',
                      style: AppTypography.body.copyWith(
                        color: AppColors.textMuted,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Add establishments\nwithin each brand',
                      style: AppTypography.h2,
                    ),
                  ],
                ),
              ),
              Text(
                '2/3',
                style: AppTypography.body.copyWith(
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ).animate().fadeIn(duration: 500.ms),
          const SizedBox(height: 32),
          // Illustration
          Center(
            child: Container(
              width: 160,
              height: 160,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppColors.cyan.withValues(alpha: 0.2),
                    AppColors.magenta.withValues(alpha: 0.2),
                  ],
                ),
                borderRadius: BorderRadius.circular(32),
              ),
              child: const Icon(
                LucideIcons.store,
                size: 80,
                color: AppColors.cyan,
              ),
            ),
          ).animate().fadeIn(delay: 200.ms, duration: 500.ms).scale(
                begin: const Offset(0.8, 0.8),
                end: const Offset(1, 1),
              ),
          const SizedBox(height: 32),
          // Diagram
          const _BrandDiagram()
              .animate()
              .fadeIn(delay: 400.ms, duration: 500.ms),
        ],
      ),
    );
  }
}

// Page 3: Checklist
class _ChecklistPage extends StatelessWidget {
  const _ChecklistPage();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 16),
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'How it works?',
                      style: AppTypography.body.copyWith(
                        color: AppColors.textMuted,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Add establishments\nwithin each brand',
                      style: AppTypography.h2,
                    ),
                  ],
                ),
              ),
              Text(
                '3/3',
                style: AppTypography.body.copyWith(
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ).animate().fadeIn(duration: 500.ms),
          const SizedBox(height: 32),
          // Illustration
          Center(
            child: Container(
              width: 160,
              height: 160,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Colors.green.withValues(alpha: 0.2),
                    AppColors.cyan.withValues(alpha: 0.2),
                  ],
                ),
                borderRadius: BorderRadius.circular(32),
              ),
              child: const Icon(
                LucideIcons.fileCheck,
                size: 80,
                color: Colors.green,
              ),
            ),
          ).animate().fadeIn(delay: 200.ms, duration: 500.ms).scale(
                begin: const Offset(0.8, 0.8),
                end: const Offset(1, 1),
              ),
          const SizedBox(height: 32),
          // Checklist
          const _ChecklistCard()
              .animate()
              .fadeIn(delay: 400.ms, duration: 500.ms),
        ],
      ),
    );
  }
}

// Organization Diagram: Circle -> 3 Brand pills
class _OrganizationDiagram extends StatelessWidget {
  const _OrganizationDiagram();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          // Organization circle
          Container(
            width: 100,
            height: 100,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [AppColors.magenta, AppColors.purple],
              ),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                'Organization',
                style: AppTypography.bodySmall.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          // Dashed lines (simplified with CustomPaint)
          CustomPaint(
            size: const Size(250, 30),
            painter: _DashedLinesPainter(
              color: AppColors.surfaceLight,
              nodeCount: 3,
            ),
          ),
          const SizedBox(height: 16),
          // Brand pills
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _BrandPill(label: 'Brand 1'),
              _BrandPill(label: 'Brand 2'),
              _BrandPill(label: 'Brand 3'),
            ],
          ),
        ],
      ),
    );
  }
}

// Brand Diagram: Brand pill -> 3 Establishment pills
class _BrandDiagram extends StatelessWidget {
  const _BrandDiagram();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          // Brand pill (filled)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppColors.magenta, AppColors.purple],
              ),
              borderRadius: BorderRadius.circular(25),
            ),
            child: Text(
              'Brand 1',
              style: AppTypography.body.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(height: 16),
          // Dashed lines
          CustomPaint(
            size: const Size(250, 30),
            painter: _DashedLinesPainter(
              color: AppColors.surfaceLight,
              nodeCount: 3,
            ),
          ),
          const SizedBox(height: 16),
          // Establishment pills (two rows for better layout)
          Column(
            children: [
              _EstablishmentPill(label: 'Establishment 2'),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _EstablishmentPill(label: 'Establishment 1'),
                  _EstablishmentPill(label: 'Establishment 3'),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// Checklist Card
class _ChecklistCard extends StatelessWidget {
  const _ChecklistCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          _ChecklistItem(label: 'Establishment details', delay: 0),
          const SizedBox(height: 20),
          _ChecklistItem(label: 'Address Details', delay: 100),
          const SizedBox(height: 20),
          _ChecklistItem(label: 'Photo', delay: 200),
        ],
      ),
    );
  }
}

// Brand Pill (outlined)
class _BrandPill extends StatelessWidget {
  final String label;

  const _BrandPill({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.magenta, width: 1.5),
      ),
      child: Text(
        label,
        style: AppTypography.bodySmall.copyWith(
          color: AppColors.textPrimary,
        ),
      ),
    );
  }
}

// Establishment Pill (outlined)
class _EstablishmentPill extends StatelessWidget {
  final String label;

  const _EstablishmentPill({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.magenta, width: 1.5),
      ),
      child: Text(
        label,
        style: AppTypography.bodySmall.copyWith(
          color: AppColors.textPrimary,
        ),
      ),
    );
  }
}

// Checklist Item
class _ChecklistItem extends StatelessWidget {
  final String label;
  final int delay;

  const _ChecklistItem({required this.label, required this.delay});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
            color: Colors.green.withValues(alpha: 0.2),
            shape: BoxShape.circle,
          ),
          child: const Icon(
            LucideIcons.check,
            size: 16,
            color: Colors.green,
          ),
        ),
        const SizedBox(width: 16),
        Text(
          label,
          style: AppTypography.body,
        ),
      ],
    ).animate().fadeIn(delay: Duration(milliseconds: 400 + delay), duration: 300.ms);
  }
}

// Custom painter for dashed lines connecting nodes
class _DashedLinesPainter extends CustomPainter {
  final Color color;
  final int nodeCount;

  _DashedLinesPainter({required this.color, required this.nodeCount});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;

    final dashWidth = 5.0;
    final dashSpace = 3.0;

    // Calculate positions
    final centerX = size.width / 2;
    final topY = 0.0;
    final bottomY = size.height;

    // Draw center vertical line
    _drawDashedLine(
      canvas,
      Offset(centerX, topY),
      Offset(centerX, bottomY * 0.5),
      paint,
      dashWidth,
      dashSpace,
    );

    // Draw horizontal line
    final leftX = size.width * 0.15;
    final rightX = size.width * 0.85;
    _drawDashedLine(
      canvas,
      Offset(leftX, bottomY * 0.5),
      Offset(rightX, bottomY * 0.5),
      paint,
      dashWidth,
      dashSpace,
    );

    // Draw vertical lines down to each node
    final nodeSpacing = (rightX - leftX) / (nodeCount - 1);
    for (int i = 0; i < nodeCount; i++) {
      final x = leftX + (i * nodeSpacing);
      _drawDashedLine(
        canvas,
        Offset(x, bottomY * 0.5),
        Offset(x, bottomY),
        paint,
        dashWidth,
        dashSpace,
      );
    }
  }

  void _drawDashedLine(
    Canvas canvas,
    Offset start,
    Offset end,
    Paint paint,
    double dashWidth,
    double dashSpace,
  ) {
    final dx = end.dx - start.dx;
    final dy = end.dy - start.dy;
    final distance = (dx * dx + dy * dy).abs();
    final length = distance > 0 ? distance.toDouble() : 0.0;
    final sqrtLength = length > 0 ? length * 0.5 : 0.0;
    final totalLength = sqrtLength > 0 ? (dx.abs() + dy.abs()) : 0.0;

    if (totalLength == 0) return;

    final unitX = dx / totalLength;
    final unitY = dy / totalLength;

    var currentLength = 0.0;
    var drawing = true;

    while (currentLength < totalLength) {
      final segmentLength = drawing ? dashWidth : dashSpace;
      final nextLength = (currentLength + segmentLength).clamp(0.0, totalLength);

      if (drawing) {
        canvas.drawLine(
          Offset(
            start.dx + unitX * currentLength,
            start.dy + unitY * currentLength,
          ),
          Offset(
            start.dx + unitX * nextLength,
            start.dy + unitY * nextLength,
          ),
          paint,
        );
      }

      currentLength = nextLength;
      drawing = !drawing;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
