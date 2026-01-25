import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

class InflufinderLogo extends StatelessWidget {
  final double size;
  final bool showText;
  final bool animated;

  const InflufinderLogo({
    super.key,
    this.size = 80,
    this.showText = false,
    this.animated = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Isotipo (icon)
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: AppColors.magenta.withOpacity(0.4),
                blurRadius: 30,
                spreadRadius: 5,
              ),
              BoxShadow(
                color: AppColors.cyan.withOpacity(0.3),
                blurRadius: 40,
                spreadRadius: 10,
              ),
            ],
          ),
          child: Image.asset(
            'assets/images/logo_color.png',
            width: size,
            height: size,
            fit: BoxFit.contain,
          ),
        ),
        if (showText) ...[
          const SizedBox(height: 16),
          // Logo text
          RichText(
            text: TextSpan(
              children: [
                TextSpan(
                  text: 'iNFLU',
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: size * 0.35,
                    fontWeight: FontWeight.bold,
                    color: AppColors.blue,
                  ),
                ),
                TextSpan(
                  text: 'finder',
                  style: GoogleFonts.libreCaslonText(
                    fontSize: size * 0.35,
                    fontStyle: FontStyle.italic,
                    color: AppColors.magenta,
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }
}

class InflufinderIsotipo extends StatelessWidget {
  final double size;

  const InflufinderIsotipo({
    super.key,
    this.size = 60,
  });

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size(size, size),
      painter: _IsotipoPainter(),
    );
  }
}

class _IsotipoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final gradient = const LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [
        AppColors.magenta,
        AppColors.purple,
        AppColors.blue,
        AppColors.cyan,
      ],
    );

    final rect = Rect.fromLTWH(0, 0, size.width, size.height);
    final paint = Paint()
      ..shader = gradient.createShader(rect)
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 0.08;

    final center = Offset(size.width / 2, size.height * 0.35);
    final radius = size.width * 0.35;

    // Outer ring
    canvas.drawCircle(center, radius, paint);

    // Inner circle (filled)
    final innerPaint = Paint()
      ..shader = gradient.createShader(rect)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(center, radius * 0.35, innerPaint);

    // Arrow/pointer at bottom
    final arrowPath = Path();
    final arrowTop = center.dy + radius + size.height * 0.05;
    final arrowBottom = size.height * 0.95;
    final arrowWidth = size.width * 0.25;

    arrowPath.moveTo(size.width / 2, arrowTop);
    arrowPath.lineTo(size.width / 2 - arrowWidth, arrowBottom);
    arrowPath.lineTo(size.width / 2, arrowBottom - size.height * 0.12);
    arrowPath.lineTo(size.width / 2 + arrowWidth, arrowBottom);
    arrowPath.close();

    canvas.drawPath(arrowPath, innerPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
