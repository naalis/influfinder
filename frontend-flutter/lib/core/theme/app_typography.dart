import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTypography {
  AppTypography._();

  // Space Grotesk for body text (similar to Codec Pro)
  static TextStyle get _baseStyle => GoogleFonts.spaceGrotesk(
        color: AppColors.textPrimary,
      );

  // Libre Caslon for display/accent text
  static TextStyle get _displayStyle => GoogleFonts.libreCaslonText(
        color: AppColors.textPrimary,
      );

  // Headings
  static TextStyle get h1 => _baseStyle.copyWith(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        height: 1.2,
      );

  static TextStyle get h2 => _baseStyle.copyWith(
        fontSize: 28,
        fontWeight: FontWeight.bold,
        height: 1.25,
      );

  static TextStyle get h3 => _baseStyle.copyWith(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        height: 1.3,
      );

  static TextStyle get h4 => _baseStyle.copyWith(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        height: 1.35,
      );

  // Body
  static TextStyle get bodyLarge => _baseStyle.copyWith(
        fontSize: 18,
        fontWeight: FontWeight.normal,
        height: 1.5,
      );

  static TextStyle get body => _baseStyle.copyWith(
        fontSize: 16,
        fontWeight: FontWeight.normal,
        height: 1.5,
      );

  static TextStyle get bodySmall => _baseStyle.copyWith(
        fontSize: 14,
        fontWeight: FontWeight.normal,
        height: 1.5,
      );

  // Labels
  static TextStyle get label => _baseStyle.copyWith(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        height: 1.4,
      );

  static TextStyle get labelSmall => _baseStyle.copyWith(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        height: 1.4,
      );

  // Button
  static TextStyle get button => _baseStyle.copyWith(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        height: 1.25,
      );

  static TextStyle get buttonText => _baseStyle.copyWith(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        height: 1.25,
        letterSpacing: 0.5,
      );

  // Display (for branding elements)
  static TextStyle get display => _displayStyle.copyWith(
        fontSize: 36,
        fontWeight: FontWeight.normal,
        fontStyle: FontStyle.italic,
      );

  static TextStyle get displaySmall => _displayStyle.copyWith(
        fontSize: 24,
        fontWeight: FontWeight.normal,
        fontStyle: FontStyle.italic,
      );

  // Caption
  static TextStyle get caption => _baseStyle.copyWith(
        fontSize: 12,
        fontWeight: FontWeight.normal,
        height: 1.4,
        color: AppColors.textSecondary,
      );
}
