import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/widgets.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key});

  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;
  String? _emailError;
  String? _passwordError;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _validateAndSubmit() async {
    setState(() {
      _emailError = null;
      _passwordError = null;
    });

    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty || !email.contains('@')) {
      setState(() => _emailError = 'Please enter a valid email');
      return;
    }

    if (password.isEmpty) {
      setState(() => _passwordError = 'Please enter your password');
      return;
    }

    setState(() => _isLoading = true);

    // TODO: Connect to backend auth endpoint
    await Future.delayed(const Duration(seconds: 2));

    setState(() => _isLoading = false);

    if (mounted) {
      context.go('/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: SingleChildScrollView(
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
                    'Welcome back',
                    style: AppTypography.h2,
                  ).animate().fadeIn(duration: 500.ms),
                  const SizedBox(height: 8),
                  Text(
                    'Sign in to your account',
                    style: AppTypography.body.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ).animate().fadeIn(delay: 100.ms, duration: 500.ms),
                  const SizedBox(height: 48),
                  // Email field
                  _buildTextField(
                    controller: _emailController,
                    label: 'Email',
                    hint: 'Enter your email',
                    icon: LucideIcons.mail,
                    error: _emailError,
                    keyboardType: TextInputType.emailAddress,
                  ).animate().fadeIn(delay: 200.ms, duration: 500.ms),
                  const SizedBox(height: 16),
                  // Password field
                  _buildTextField(
                    controller: _passwordController,
                    label: 'Password',
                    hint: 'Enter your password',
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
                  const SizedBox(height: 8),
                  // Forgot password
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () {
                        // TODO: Implement forgot password
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Forgot password coming soon'),
                          ),
                        );
                      },
                      child: Text(
                        'Forgot password?',
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.cyan,
                        ),
                      ),
                    ),
                  ).animate().fadeIn(delay: 400.ms, duration: 500.ms),
                  const SizedBox(height: 24),
                  // Sign in button
                  GradientButton(
                    text: 'Sign In',
                    onPressed: _validateAndSubmit,
                    isLoading: _isLoading,
                  ).animate().fadeIn(delay: 500.ms, duration: 500.ms),
                  const SizedBox(height: 32),
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
                          'or continue with',
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
                  ).animate().fadeIn(delay: 600.ms, duration: 500.ms),
                  const SizedBox(height: 24),
                  // Social buttons row
                  Row(
                    children: [
                      Expanded(
                        child: _SocialIconButton(
                          icon: LucideIcons.instagram,
                          gradient: const LinearGradient(
                            colors: [
                              Color(0xFFF58529),
                              Color(0xFFDD2A7B),
                            ],
                          ),
                          onTap: () => _loginWithSocial('instagram'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _SocialIconButton(
                          icon: Icons.g_mobiledata,
                          backgroundColor: AppColors.surface,
                          onTap: () => _loginWithSocial('google'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _SocialIconButton(
                          icon: Icons.apple,
                          backgroundColor: AppColors.textPrimary,
                          iconColor: AppColors.background,
                          onTap: () => _loginWithSocial('apple'),
                        ),
                      ),
                    ],
                  ).animate().fadeIn(delay: 700.ms, duration: 500.ms),
                  const SizedBox(height: 48),
                  // Sign up link
                  Center(
                    child: TextButton(
                      onPressed: () => context.push('/onboarding/login'),
                      child: RichText(
                        text: TextSpan(
                          style: AppTypography.bodySmall,
                          children: [
                            TextSpan(
                              text: "Don't have an account? ",
                              style: TextStyle(color: AppColors.textSecondary),
                            ),
                            TextSpan(
                              text: 'Sign up',
                              style: TextStyle(
                                color: AppColors.cyan,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ).animate().fadeIn(delay: 800.ms, duration: 500.ms),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _loginWithSocial(String provider) async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(milliseconds: 1500));
    setState(() => _isLoading = false);

    if (mounted) {
      context.go('/home');
    }
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

class _SocialIconButton extends StatelessWidget {
  final IconData icon;
  final Gradient? gradient;
  final Color? backgroundColor;
  final Color iconColor;
  final VoidCallback onTap;

  const _SocialIconButton({
    required this.icon,
    this.gradient,
    this.backgroundColor,
    this.iconColor = AppColors.textPrimary,
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
          child: Center(
            child: Icon(icon, color: iconColor, size: 28),
          ),
        ),
      ),
    );
  }
}
