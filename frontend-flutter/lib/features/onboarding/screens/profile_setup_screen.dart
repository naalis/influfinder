import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/widgets.dart';
import '../../../core/constants/countries.dart';

class ProfileSetupScreen extends StatefulWidget {
  const ProfileSetupScreen({super.key});

  @override
  State<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends State<ProfileSetupScreen> {
  final _nameController = TextEditingController();
  final _usernameController = TextEditingController();
  final _phoneController = TextEditingController();
  String _selectedCountry = 'Peru';
  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _usernameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _continue() async {
    if (_usernameController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Username is required')),
      );
      return;
    }

    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 1));
    setState(() => _isLoading = false);

    if (mounted) {
      context.go('/onboarding/connect-instagram');
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
                          onPressed: () => context.go('/onboarding/login'),
                          icon: const Icon(
                            LucideIcons.arrowLeft,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const Spacer(),
                        _ProgressIndicator(current: 0, total: 4),
                        const Spacer(),
                        TextButton(
                          onPressed: () =>
                              context.go('/onboarding/connect-instagram'),
                          child: Text(
                            'Skip',
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              // Content
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 24),
                      Text(
                        'Set up your profile',
                        style: AppTypography.h2,
                      ).animate().fadeIn(duration: 500.ms),
                      const SizedBox(height: 8),
                      Text(
                        'Tell us a bit about yourself',
                        style: AppTypography.body.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ).animate().fadeIn(delay: 100.ms, duration: 500.ms),
                      const SizedBox(height: 32),
                      // Full name
                      _buildTextField(
                        controller: _nameController,
                        label: 'Full Name',
                        hint: 'Enter your name',
                        icon: LucideIcons.user,
                        optional: true,
                      ).animate().fadeIn(delay: 200.ms, duration: 500.ms),
                      const SizedBox(height: 20),
                      // Username
                      _buildTextField(
                        controller: _usernameController,
                        label: 'Username',
                        hint: 'Choose a username',
                        icon: LucideIcons.atSign,
                        prefix: '@',
                        inputFormatters: [
                          FilteringTextInputFormatter.allow(
                            RegExp(r'[a-zA-Z0-9_]'),
                          ),
                        ],
                      ).animate().fadeIn(delay: 300.ms, duration: 500.ms),
                      const SizedBox(height: 20),
                      // Country
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Country',
                            style: AppTypography.label.copyWith(
                              color: AppColors.textSecondary,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.surfaceLight),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _selectedCountry,
                                isExpanded: true,
                                icon: const Padding(
                                  padding: EdgeInsets.only(right: 16),
                                  child: Icon(
                                    LucideIcons.chevronDown,
                                    color: AppColors.cyan,
                                  ),
                                ),
                                dropdownColor: AppColors.surface,
                                borderRadius: BorderRadius.circular(12),
                                selectedItemBuilder: (context) {
                                  return Countries.list.map((country) {
                                    return Padding(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 16),
                                      child: Align(
                                        alignment: Alignment.centerLeft,
                                        child: Text(
                                          '${country['flag']} ${country['name']}',
                                          style: AppTypography.body,
                                        ),
                                      ),
                                    );
                                  }).toList();
                                },
                                items: Countries.list.map((country) {
                                  return DropdownMenuItem(
                                    value: country['name'],
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 16),
                                      child: Row(
                                        children: [
                                          Text(
                                            country['flag']!,
                                            style:
                                                const TextStyle(fontSize: 20),
                                          ),
                                          const SizedBox(width: 12),
                                          Text(
                                            country['name']!,
                                            style: AppTypography.body,
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                }).toList(),
                                onChanged: (value) {
                                  if (value != null) {
                                    setState(() => _selectedCountry = value);
                                  }
                                },
                              ),
                            ),
                          ),
                        ],
                      ).animate().fadeIn(delay: 400.ms, duration: 500.ms),
                      const SizedBox(height: 20),
                      // Phone
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                'Phone',
                                style: AppTypography.label.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                '(Optional)',
                                style: AppTypography.caption.copyWith(
                                  color: AppColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 16,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.surface,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                      color: AppColors.surfaceLight),
                                ),
                                child: Text(
                                  '${Countries.getFlag(_selectedCountry) ?? ''} ${Countries.getPhoneCode(_selectedCountry) ?? '+1'}',
                                  style: AppTypography.body,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: TextField(
                                  controller: _phoneController,
                                  keyboardType: TextInputType.phone,
                                  style: AppTypography.body,
                                  inputFormatters: [
                                    FilteringTextInputFormatter.digitsOnly,
                                  ],
                                  decoration: const InputDecoration(
                                    hintText: 'Phone number',
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ).animate().fadeIn(delay: 500.ms, duration: 500.ms),
                    ],
                  ),
                ),
              ),
              // Bottom button
              Padding(
                padding: const EdgeInsets.all(24),
                child: GradientButton(
                  text: 'Continue',
                  onPressed: _continue,
                  isLoading: _isLoading,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    String? prefix,
    bool optional = false,
    List<TextInputFormatter>? inputFormatters,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              label,
              style: AppTypography.label.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            if (optional) ...[
              const SizedBox(width: 8),
              Text(
                '(Optional)',
                style: AppTypography.caption.copyWith(
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ],
        ),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          style: AppTypography.body,
          inputFormatters: inputFormatters,
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: prefix != null
                ? Padding(
                    padding: const EdgeInsets.only(left: 16, right: 4),
                    child: Text(
                      prefix,
                      style: AppTypography.body.copyWith(
                        color: AppColors.cyan,
                      ),
                    ),
                  )
                : Icon(icon, color: AppColors.textMuted, size: 20),
            prefixIconConstraints: prefix != null
                ? const BoxConstraints(minWidth: 0, minHeight: 0)
                : null,
          ),
        ),
      ],
    );
  }
}

class _ProgressIndicator extends StatelessWidget {
  final int current;
  final int total;

  const _ProgressIndicator({
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
