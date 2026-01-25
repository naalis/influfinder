import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary Brand Colors
  static const Color blue = Color(0xFF1020E0);
  static const Color cyan = Color(0xFF75FBDE);
  static const Color magenta = Color(0xFFEA33E9);
  static const Color purple = Color(0xFF662D91);

  // Background Colors
  static const Color background = Color(0xFF0A0A0F);
  static const Color surface = Color(0xFF1A1A24);
  static const Color surfaceLight = Color(0xFF2A2A38);

  // Text Colors
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFFB0B0B8);
  static const Color textMuted = Color(0xFF6B6B78);

  // Status Colors
  static const Color success = Color(0xFF4ADE80);
  static const Color error = Color(0xFFEF4444);
  static const Color warning = Color(0xFFFBBF24);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [magenta, purple, blue],
  );

  static const LinearGradient cyanMagentaGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [cyan, magenta],
  );

  static const LinearGradient backgroundGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      Color(0xFF1A1A2E),
      Color(0xFF0F0F1A),
    ],
  );

  static const LinearGradient logoGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [magenta, purple, blue, cyan],
  );

  static const RadialGradient onboardingGradient = RadialGradient(
    center: Alignment.center,
    radius: 1.2,
    colors: [
      Color(0xFF662D91),
      Color(0xFF1020E0),
      Color(0xFF0A0A0F),
    ],
  );

  // Creator theme (cyan accent)
  static const Color creatorAccent = cyan;

  // Business theme (magenta accent)
  static const Color businessAccent = magenta;
}
