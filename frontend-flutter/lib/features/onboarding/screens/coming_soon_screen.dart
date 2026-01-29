import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/widgets.dart';
import '../../../core/services/api_client.dart';

class ComingSoonScreen extends StatefulWidget {
  final String detectedCountry;

  const ComingSoonScreen({
    super.key,
    required this.detectedCountry,
  });

  @override
  State<ComingSoonScreen> createState() => _ComingSoonScreenState();
}

class _ComingSoonScreenState extends State<ComingSoonScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _apiClient = ApiClient();
  bool _isLoading = false;
  bool _isSubmitted = false;
  String? _nameError;
  String? _emailError;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _apiClient.dispose();
    super.dispose();
  }

  Future<void> _submitWaitlist() async {
    setState(() {
      _nameError = null;
      _emailError = null;
    });

    final name = _nameController.text.trim();
    final email = _emailController.text.trim();

    if (name.isEmpty) {
      setState(() => _nameError = 'Please enter your name');
      return;
    }

    if (email.isEmpty || !email.contains('@')) {
      setState(() => _emailError = 'Please enter a valid email');
      return;
    }

    setState(() => _isLoading = true);

    try {
      await _apiClient.post('/waitlist', body: {
        'name': name,
        'email': email,
        'country': widget.detectedCountry,
      });

      if (mounted) {
        setState(() {
          _isLoading = false;
          _isSubmitted = true;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to submit. Please try again.'),
            backgroundColor: Colors.red,
          ),
        );
      }
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
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(height: 16),
                  // Back button
                  Align(
                    alignment: Alignment.centerLeft,
                    child: IconButton(
                      onPressed: () => context.go('/onboarding'),
                      icon: const Icon(
                        LucideIcons.arrowLeft,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),

                  if (_isSubmitted) ...[
                    // Success state
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        color: AppColors.cyan.withValues(alpha: 0.15),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        LucideIcons.checkCircle,
                        size: 50,
                        color: AppColors.cyan,
                      ),
                    ).animate().scale(duration: 500.ms, curve: Curves.elasticOut),
                    const SizedBox(height: 32),
                    Text(
                      "You're on the list!",
                      style: AppTypography.h2,
                      textAlign: TextAlign.center,
                    ).animate().fadeIn(delay: 200.ms, duration: 500.ms),
                    const SizedBox(height: 16),
                    Text(
                      "We'll notify you when Influfinder launches in ${widget.detectedCountry}",
                      style: AppTypography.body.copyWith(
                        color: AppColors.textSecondary,
                      ),
                      textAlign: TextAlign.center,
                    ).animate().fadeIn(delay: 300.ms, duration: 500.ms),
                    const SizedBox(height: 48),
                    GradientButton(
                      text: 'Back to Home',
                      onPressed: () => context.go('/onboarding'),
                    ).animate().fadeIn(delay: 400.ms, duration: 500.ms),
                  ] else ...[
                    // Form state
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        color: AppColors.magenta.withValues(alpha: 0.15),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        LucideIcons.mapPin,
                        size: 50,
                        color: AppColors.magenta,
                      ),
                    ).animate().fadeIn(duration: 500.ms).scale(
                      begin: const Offset(0.8, 0.8),
                      end: const Offset(1, 1),
                      duration: 500.ms,
                    ),
                    const SizedBox(height: 32),
                    Text(
                      "We're not in your country yet!",
                      style: AppTypography.h2,
                      textAlign: TextAlign.center,
                    ).animate().fadeIn(delay: 100.ms, duration: 500.ms),
                    const SizedBox(height: 16),
                    Text(
                      "Influfinder is currently available in Peru, UAE, and Italy. Join the waitlist and we'll let you know when we launch in ${widget.detectedCountry}.",
                      style: AppTypography.body.copyWith(
                        color: AppColors.textSecondary,
                      ),
                      textAlign: TextAlign.center,
                    ).animate().fadeIn(delay: 200.ms, duration: 500.ms),
                    const SizedBox(height: 40),
                    // Name field
                    _buildTextField(
                      controller: _nameController,
                      label: 'Name',
                      hint: 'Enter your name',
                      icon: LucideIcons.user,
                      error: _nameError,
                    ).animate().fadeIn(delay: 300.ms, duration: 500.ms),
                    const SizedBox(height: 16),
                    // Email field
                    _buildTextField(
                      controller: _emailController,
                      label: 'Email',
                      hint: 'Enter your email',
                      icon: LucideIcons.mail,
                      error: _emailError,
                      keyboardType: TextInputType.emailAddress,
                    ).animate().fadeIn(delay: 400.ms, duration: 500.ms),
                    const SizedBox(height: 16),
                    // Country field (readonly)
                    _buildTextField(
                      label: 'Country',
                      hint: widget.detectedCountry,
                      icon: LucideIcons.globe,
                      enabled: false,
                    ).animate().fadeIn(delay: 500.ms, duration: 500.ms),
                    const SizedBox(height: 32),
                    // Submit button
                    GradientButton(
                      text: 'Notify me when available',
                      onPressed: _submitWaitlist,
                      isLoading: _isLoading,
                      gradient: const LinearGradient(
                        colors: [AppColors.magenta, AppColors.purple],
                      ),
                    ).animate().fadeIn(delay: 600.ms, duration: 500.ms),
                  ],
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    TextEditingController? controller,
    required String label,
    required String hint,
    required IconData icon,
    String? error,
    bool enabled = true,
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
          enabled: enabled,
          keyboardType: keyboardType,
          style: AppTypography.body.copyWith(
            color: enabled ? AppColors.textPrimary : AppColors.textMuted,
          ),
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: Icon(icon, color: AppColors.textMuted, size: 20),
            errorText: error,
            filled: !enabled,
            fillColor: enabled ? null : AppColors.surface,
          ),
        ),
      ],
    );
  }
}
