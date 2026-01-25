import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/widgets.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _showEmailForm = false;
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _isLoading = false;
  String? _emailError;
  String? _passwordError;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _loginWithSocial(String provider) async {
    setState(() => _isLoading = true);

    // Simulate social login
    await Future.delayed(const Duration(milliseconds: 1500));

    setState(() => _isLoading = false);

    if (mounted) {
      context.go('/onboarding/profile-setup');
    }
  }

  void _validateAndSubmit() async {
    setState(() {
      _emailError = null;
      _passwordError = null;
    });

    final email = _emailController.text.trim();
    final password = _passwordController.text;
    final confirmPassword = _confirmPasswordController.text;

    // Validate email
    if (email.isEmpty || !email.contains('@')) {
      setState(() => _emailError = 'Please enter a valid email');
      return;
    }

    // Validate password
    if (password.length < 8) {
      setState(() => _passwordError = 'Password must be at least 8 characters');
      return;
    }

    if (password != confirmPassword) {
      setState(() => _passwordError = 'Passwords do not match');
      return;
    }

    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 2));
    setState(() => _isLoading = false);

    if (mounted) {
      context.go('/onboarding/profile-setup');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: Stack(
          children: [
            SafeArea(
              child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 16),
                  // Back button
                  IconButton(
                    onPressed: () {
                      if (_showEmailForm) {
                        setState(() => _showEmailForm = false);
                      } else {
                        context.go('/onboarding/location?type=creator');
                      }
                    },
                    icon: const Icon(
                      LucideIcons.arrowLeft,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 32),
                  // Title
                  Text(
                    _showEmailForm ? 'Create your account' : 'Let\'s get started',
                    style: AppTypography.h2,
                  ).animate().fadeIn(duration: 500.ms),
                  const SizedBox(height: 8),
                  Text(
                    _showEmailForm
                        ? 'Enter your details to create an account'
                        : 'Choose how you\'d like to sign up',
                    style: AppTypography.body.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ).animate().fadeIn(delay: 100.ms, duration: 500.ms),
                  const SizedBox(height: 48),
                  if (!_showEmailForm) ...[
                    // Social login buttons
                    _SocialButton(
                      icon: LucideIcons.instagram,
                      text: 'Continue with Instagram',
                      gradient: const LinearGradient(
                        colors: [
                          Color(0xFFF58529),
                          Color(0xFFDD2A7B),
                          Color(0xFF8134AF),
                          Color(0xFF515BD4),
                        ],
                      ),
                      onTap: () => _loginWithSocial('instagram'),
                    ).animate().fadeIn(delay: 200.ms, duration: 500.ms),
                    const SizedBox(height: 12),
                    _TikTokButton(
                      onTap: () => _loginWithSocial('tiktok'),
                    ).animate().fadeIn(delay: 300.ms, duration: 500.ms),
                    const SizedBox(height: 12),
                    _SocialButton(
                      icon: Icons.g_mobiledata,
                      text: 'Continue with Google',
                      backgroundColor: AppColors.surface,
                      onTap: () => _loginWithSocial('google'),
                    ).animate().fadeIn(delay: 400.ms, duration: 500.ms),
                    const SizedBox(height: 12),
                    _SocialButton(
                      icon: Icons.apple,
                      text: 'Continue with Apple',
                      backgroundColor: AppColors.textPrimary,
                      textColor: AppColors.background,
                      onTap: () => _loginWithSocial('apple'),
                    ).animate().fadeIn(delay: 500.ms, duration: 500.ms),
                    const SizedBox(height: 24),
                    // Divider
                    Row(
                      children: [
                        Expanded(
                          child: Container(
                            height: 1,
                            color: AppColors.surfaceLight,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Text(
                            'or',
                            style: AppTypography.caption,
                          ),
                        ),
                        Expanded(
                          child: Container(
                            height: 1,
                            color: AppColors.surfaceLight,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    _SocialButton(
                      icon: LucideIcons.mail,
                      text: 'Continue with Email',
                      backgroundColor: AppColors.surface,
                      onTap: () => setState(() => _showEmailForm = true),
                    ).animate().fadeIn(delay: 600.ms, duration: 500.ms),
                  ] else ...[
                    // Email form
                    _buildTextField(
                      controller: _emailController,
                      label: 'Email',
                      hint: 'Enter your email',
                      icon: LucideIcons.mail,
                      error: _emailError,
                      keyboardType: TextInputType.emailAddress,
                    ).animate().fadeIn(delay: 200.ms, duration: 500.ms),
                    const SizedBox(height: 16),
                    _buildTextField(
                      controller: _passwordController,
                      label: 'Password',
                      hint: 'Create a password',
                      icon: LucideIcons.lock,
                      error: _passwordError,
                      obscureText: _obscurePassword,
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword ? LucideIcons.eyeOff : LucideIcons.eye,
                          color: AppColors.textMuted,
                          size: 20,
                        ),
                        onPressed: () =>
                            setState(() => _obscurePassword = !_obscurePassword),
                      ),
                    ).animate().fadeIn(delay: 300.ms, duration: 500.ms),
                    const SizedBox(height: 16),
                    _buildTextField(
                      controller: _confirmPasswordController,
                      label: 'Confirm Password',
                      hint: 'Confirm your password',
                      icon: LucideIcons.lock,
                      obscureText: _obscureConfirmPassword,
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscureConfirmPassword
                              ? LucideIcons.eyeOff
                              : LucideIcons.eye,
                          color: AppColors.textMuted,
                          size: 20,
                        ),
                        onPressed: () => setState(
                            () => _obscureConfirmPassword = !_obscureConfirmPassword),
                      ),
                    ).animate().fadeIn(delay: 400.ms, duration: 500.ms),
                    const SizedBox(height: 8),
                    Text(
                      'Must be at least 8 characters',
                      style: AppTypography.caption,
                    ).animate().fadeIn(delay: 500.ms, duration: 500.ms),
                    const SizedBox(height: 32),
                    GradientButton(
                      text: 'Create Account',
                      onPressed: _validateAndSubmit,
                      isLoading: _isLoading,
                    ).animate().fadeIn(delay: 600.ms, duration: 500.ms),
                  ],
                  const SizedBox(height: 24),
                  // Terms
                  Text(
                    'By continuing, you agree to our Terms of Service and Privacy Policy',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.textMuted,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ),
        // Loading overlay
        if (_isLoading && !_showEmailForm)
          Container(
            color: AppColors.background.withValues(alpha: 0.8),
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const CircularProgressIndicator(
                    color: AppColors.cyan,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Signing in...',
                    style: AppTypography.body.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    String? error,
    bool obscureText = false,
    Widget? suffixIcon,
    TextInputType? keyboardType,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: AppTypography.label.copyWith(color: AppColors.textSecondary),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          style: AppTypography.body,
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: Icon(icon, color: AppColors.textMuted, size: 20),
            suffixIcon: suffixIcon,
            errorText: error,
          ),
        ),
      ],
    );
  }
}

class _SocialButton extends StatelessWidget {
  final IconData icon;
  final String text;
  final Gradient? gradient;
  final Color? backgroundColor;
  final Color textColor;
  final VoidCallback onTap;

  const _SocialButton({
    required this.icon,
    required this.text,
    this.gradient,
    this.backgroundColor,
    this.textColor = AppColors.textPrimary,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56,
      decoration: BoxDecoration(
        gradient: gradient,
        color: gradient == null ? backgroundColor : null,
        borderRadius: BorderRadius.circular(16),
        border: backgroundColor == AppColors.surface
            ? Border.all(color: AppColors.surfaceLight)
            : null,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: textColor, size: 24),
              const SizedBox(width: 12),
              Text(
                text,
                style: AppTypography.button.copyWith(color: textColor),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TikTokButton extends StatelessWidget {
  final VoidCallback onTap;

  const _TikTokButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceLight),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // TikTok logo
              SizedBox(
                width: 24,
                height: 24,
                child: CustomPaint(
                  painter: _TikTokLogoPainter(),
                ),
              ),
              const SizedBox(width: 12),
              Text(
                'Continue with TikTok',
                style: AppTypography.button,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TikTokLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;

    // Cyan/teal shadow (left)
    final cyanPaint = Paint()
      ..color = const Color(0xFF25F4EE)
      ..style = PaintingStyle.fill;

    // Red/pink shadow (right)
    final redPaint = Paint()
      ..color = const Color(0xFFFE2C55)
      ..style = PaintingStyle.fill;

    // White main shape
    final whitePaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    // Draw the musical note shape
    final path = Path();

    // Main vertical bar
    double barLeft = w * 0.35;
    double barWidth = w * 0.22;
    double barTop = h * 0.15;
    double barBottom = h * 0.85;

    // Cyan offset (left/down)
    canvas.save();
    canvas.translate(-w * 0.06, h * 0.03);
    _drawTikTokNote(canvas, path, barLeft, barWidth, barTop, barBottom, w, h, cyanPaint);
    canvas.restore();

    // Red offset (right/up)
    canvas.save();
    canvas.translate(w * 0.06, -h * 0.03);
    _drawTikTokNote(canvas, Path(), barLeft, barWidth, barTop, barBottom, w, h, redPaint);
    canvas.restore();

    // White main
    _drawTikTokNote(canvas, Path(), barLeft, barWidth, barTop, barBottom, w, h, whitePaint);
  }

  void _drawTikTokNote(Canvas canvas, Path path, double barLeft, double barWidth,
      double barTop, double barBottom, double w, double h, Paint paint) {
    final notePath = Path();

    // Vertical bar
    notePath.addRRect(RRect.fromRectAndRadius(
      Rect.fromLTWH(barLeft, barTop, barWidth, barBottom - barTop),
      Radius.circular(barWidth / 2),
    ));

    // Bottom circle (note head)
    double circleRadius = w * 0.18;
    notePath.addOval(Rect.fromCircle(
      center: Offset(barLeft - circleRadius * 0.3, barBottom - circleRadius),
      radius: circleRadius,
    ));

    // Top curved part (like a flag)
    final flagPath = Path();
    flagPath.moveTo(barLeft + barWidth, barTop + h * 0.05);
    flagPath.quadraticBezierTo(
      w * 0.85, barTop + h * 0.1,
      w * 0.85, barTop + h * 0.25,
    );
    flagPath.quadraticBezierTo(
      w * 0.7, barTop + h * 0.2,
      barLeft + barWidth, barTop + h * 0.25,
    );
    flagPath.close();

    canvas.drawPath(notePath, paint);
    canvas.drawPath(flagPath, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
