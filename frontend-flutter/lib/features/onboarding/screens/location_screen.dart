import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/widgets.dart';
import '../../../core/constants/countries.dart';

class LocationScreen extends StatefulWidget {
  final String userType;

  const LocationScreen({
    super.key,
    required this.userType,
  });

  @override
  State<LocationScreen> createState() => _LocationScreenState();
}

class _LocationScreenState extends State<LocationScreen> {
  String? _selectedCountry;
  String? _selectedCity;
  bool _isLoadingLocation = false;

  bool get _isCreator => widget.userType == 'creator';
  Color get _accentColor => _isCreator ? AppColors.cyan : AppColors.magenta;

  List<String> get _citiesForCountry {
    if (_selectedCountry == null) return [];
    return Countries.getCities(_selectedCountry!);
  }

  List<String> get _popularCities {
    if (_selectedCountry != null) {
      final cities = Countries.getCities(_selectedCountry!);
      return cities.take(8).toList();
    }
    return [
      'Lima',
      'Dubai',
      'Rome',
      'Milan',
      'Abu Dhabi',
      'Cusco',
      'Florence',
      'Venice',
    ];
  }

  String? _getCountryForCity(String city) {
    const cityToCountry = {
      'Lima': 'Peru',
      'Arequipa': 'Peru',
      'Cusco': 'Peru',
      'Trujillo': 'Peru',
      'Dubai': 'United Arab Emirates',
      'Abu Dhabi': 'United Arab Emirates',
      'Sharjah': 'United Arab Emirates',
      'Rome': 'Italy',
      'Milan': 'Italy',
      'Florence': 'Italy',
      'Venice': 'Italy',
      'Naples': 'Italy',
    };
    return cityToCountry[city];
  }

  void _detectLocation() async {
    setState(() => _isLoadingLocation = true);
    // Simulate location detection
    await Future.delayed(const Duration(seconds: 2));
    setState(() {
      _selectedCountry = 'Peru';
      _selectedCity = 'Lima';
      _isLoadingLocation = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
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
                          onPressed: () => context.go('/onboarding/select-type'),
                          icon: const Icon(
                            LucideIcons.arrowLeft,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const Spacer(),
                        // Progress indicator
                        _ProgressDots(
                          total: 5,
                          current: 1,
                          activeColor: _accentColor,
                        ),
                        const Spacer(),
                        const SizedBox(width: 48),
                      ],
                    ),
                    const SizedBox(height: 32),
                    Text(
                      'Where are you located?',
                      style: AppTypography.h2,
                    ).animate().fadeIn(duration: 500.ms),
                    const SizedBox(height: 8),
                    Text(
                      'This helps us show you relevant opportunities nearby',
                      style: AppTypography.body.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ).animate().fadeIn(delay: 100.ms, duration: 500.ms),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              // Detect location button
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: OutlinedButton.icon(
                  onPressed: _isLoadingLocation ? null : _detectLocation,
                  icon: _isLoadingLocation
                      ? SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: _accentColor,
                          ),
                        )
                      : Icon(LucideIcons.mapPin, color: _accentColor),
                  label: Text(
                    _isLoadingLocation ? 'Detecting...' : 'Use my location',
                    style: AppTypography.button.copyWith(color: _accentColor),
                  ),
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(color: _accentColor),
                  ),
                ),
              ).animate().fadeIn(delay: 200.ms, duration: 500.ms),
              const SizedBox(height: 24),
              // Divider
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Row(
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
                        'or select manually',
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
              ),
              const SizedBox(height: 24),
              // Country dropdown
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: _DropdownField(
                  label: 'Country',
                  value: _selectedCountry,
                  items: Countries.list.map((c) => c['name']!).toList(),
                  onChanged: (value) => setState(() {
                    _selectedCountry = value;
                    _selectedCity = null;
                  }),
                  accentColor: _accentColor,
                  isCountry: true,
                ),
              ).animate().fadeIn(delay: 300.ms, duration: 500.ms),
              const SizedBox(height: 16),
              // City dropdown
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: _DropdownField(
                  label: 'City',
                  value: _selectedCity,
                  items: _citiesForCountry,
                  onChanged: (value) => setState(() => _selectedCity = value),
                  accentColor: _accentColor,
                  enabled: _selectedCountry != null,
                ),
              ).animate().fadeIn(delay: 400.ms, duration: 500.ms),
              const SizedBox(height: 24),
              // Popular cities
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Text(
                  'Popular cities',
                  style: AppTypography.label.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 40,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  itemCount: _popularCities.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    final city = _popularCities[index];
                    final isSelected = _selectedCity == city;
                    return GestureDetector(
                      onTap: () => setState(() {
                        _selectedCity = city;
                        if (_selectedCountry == null) {
                          _selectedCountry = _getCountryForCity(city);
                        }
                      }),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? _accentColor.withOpacity(0.2)
                              : AppColors.surface,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isSelected
                                ? _accentColor
                                : AppColors.surfaceLight,
                          ),
                        ),
                        child: Text(
                          city,
                          style: AppTypography.bodySmall.copyWith(
                            color: isSelected
                                ? _accentColor
                                : AppColors.textSecondary,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ).animate().fadeIn(delay: 500.ms, duration: 500.ms),
              const Spacer(),
              // Continue button
              Padding(
                padding: const EdgeInsets.all(24),
                child: GradientButton(
                  text: 'Continue',
                  onPressed: _selectedCountry != null && _selectedCity != null
                      ? () {
                          final nextRoute = widget.userType == 'creator'
                              ? '/onboarding/login'
                              : '/onboarding/business/login';
                          context.go(nextRoute);
                        }
                      : null,
                  gradient: !_isCreator
                      ? const LinearGradient(
                          colors: [AppColors.magenta, AppColors.purple],
                        )
                      : null,
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
  final int total;
  final int current;
  final Color activeColor;

  const _ProgressDots({
    required this.total,
    required this.current,
    required this.activeColor,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(total, (index) {
        final isActive = index <= current;
        return Container(
          width: isActive ? 24 : 8,
          height: 8,
          margin: const EdgeInsets.symmetric(horizontal: 2),
          decoration: BoxDecoration(
            color: isActive ? activeColor : AppColors.surfaceLight,
            borderRadius: BorderRadius.circular(4),
          ),
        );
      }),
    );
  }
}

class _DropdownField extends StatelessWidget {
  final String label;
  final String? value;
  final List<String> items;
  final ValueChanged<String?> onChanged;
  final Color accentColor;
  final bool enabled;
  final bool isCountry;

  const _DropdownField({
    required this.label,
    required this.value,
    required this.items,
    required this.onChanged,
    required this.accentColor,
    this.enabled = true,
    this.isCountry = false,
  });

  String _getDisplayText(String item) {
    if (isCountry) {
      final flag = Countries.getFlag(item);
      return flag != null ? '$flag $item' : item;
    }
    return item;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: AppTypography.label.copyWith(color: AppColors.textSecondary),
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
              value: value,
              isExpanded: true,
              hint: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  'Select $label',
                  style: AppTypography.body.copyWith(
                    color: AppColors.textMuted,
                  ),
                ),
              ),
              icon: Padding(
                padding: const EdgeInsets.only(right: 16),
                child: Icon(
                  LucideIcons.chevronDown,
                  color: enabled ? accentColor : AppColors.textMuted,
                ),
              ),
              dropdownColor: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              selectedItemBuilder: isCountry
                  ? (context) => items.map((item) {
                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              _getDisplayText(item),
                              style: AppTypography.body,
                            ),
                          ),
                        );
                      }).toList()
                  : null,
              items: items.map((item) {
                return DropdownMenuItem(
                  value: item,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Text(
                      _getDisplayText(item),
                      style: AppTypography.body,
                    ),
                  ),
                );
              }).toList(),
              onChanged: enabled ? onChanged : null,
            ),
          ),
        ),
      ],
    );
  }
}
