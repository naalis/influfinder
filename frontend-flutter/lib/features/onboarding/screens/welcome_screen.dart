import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/widgets.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              children: [
                const Spacer(flex: 2),
                // Logo with animation
                const InflufinderIsotipo(size: 120)
                    .animate()
                    .fadeIn(duration: 800.ms)
                    .scale(
                      begin: const Offset(0.8, 0.8),
                      end: const Offset(1, 1),
                      duration: 800.ms,
                      curve: Curves.easeOutBack,
                    ),
                const SizedBox(height: 32),
                // Brand name
                RichText(
                  textAlign: TextAlign.center,
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: 'iNFLU',
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 42,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      TextSpan(
                        text: 'finder',
                        style: GoogleFonts.libreCaslonText(
                          fontSize: 42,
                          fontStyle: FontStyle.italic,
                          color: AppColors.magenta,
                        ),
                      ),
                    ],
                  ),
                )
                    .animate()
                    .fadeIn(delay: 300.ms, duration: 600.ms)
                    .slideY(begin: 0.3, end: 0, delay: 300.ms, duration: 600.ms),
                const SizedBox(height: 16),
                // Tagline
                Text(
                  'Connect. Collaborate. Create.',
                  style: AppTypography.body.copyWith(
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                )
                    .animate()
                    .fadeIn(delay: 500.ms, duration: 600.ms),
                const Spacer(flex: 3),
                // Get Started button
                GradientButton(
                  text: 'Get Started',
                  onPressed: () => context.go('/onboarding/select-type'),
                )
                    .animate()
                    .fadeIn(delay: 700.ms, duration: 600.ms)
                    .slideY(begin: 0.5, end: 0, delay: 700.ms, duration: 600.ms),
                const SizedBox(height: 16),
                // Login link
                TextButton(
                  onPressed: () => context.go('/onboarding/login'),
                  child: Text(
                    'Already have an account? Log in',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                )
                    .animate()
                    .fadeIn(delay: 900.ms, duration: 600.ms),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
