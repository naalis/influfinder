import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/widgets.dart';
import '../../../core/services/auth_service.dart';
import '../../../core/models/social_account_model.dart';

class OAuthConnectScreen extends StatefulWidget {
  final SocialPlatform platform;
  final VoidCallback? onSuccess;
  final VoidCallback? onCancel;

  const OAuthConnectScreen({
    super.key,
    required this.platform,
    this.onSuccess,
    this.onCancel,
  });

  @override
  State<OAuthConnectScreen> createState() => _OAuthConnectScreenState();
}

class _OAuthConnectScreenState extends State<OAuthConnectScreen> {
  bool _isConnecting = false;
  bool _isSuccess = false;

  String get _platformName {
    switch (widget.platform) {
      case SocialPlatform.instagram:
        return 'Instagram';
      case SocialPlatform.tiktok:
        return 'TikTok';
      case SocialPlatform.youtube:
        return 'YouTube';
    }
  }

  Color get _platformColor {
    switch (widget.platform) {
      case SocialPlatform.instagram:
        return const Color(0xFFE4405F);
      case SocialPlatform.tiktok:
        return const Color(0xFF00F2EA);
      case SocialPlatform.youtube:
        return const Color(0xFFFF0000);
    }
  }

  IconData get _platformIcon {
    switch (widget.platform) {
      case SocialPlatform.instagram:
        return LucideIcons.instagram;
      case SocialPlatform.tiktok:
        return LucideIcons.music2; // TikTok doesn't have a lucide icon
      case SocialPlatform.youtube:
        return LucideIcons.youtube;
    }
  }

  List<String> get _permissions {
    switch (widget.platform) {
      case SocialPlatform.instagram:
        return [
          'Access your profile information',
          'View your followers and following',
          'Read your posts and stories',
        ];
      case SocialPlatform.tiktok:
        return [
          'Access your basic profile',
          'View your follower count',
          'Read your video analytics',
        ];
      case SocialPlatform.youtube:
        return [
          'Access your channel information',
          'View your subscriber count',
          'Read your video statistics',
        ];
    }
  }

  List<Map<String, String>> get _benefits {
    return [
      {
        'icon': 'target',
        'title': 'Better Matches',
        'description': 'Get offers tailored to your audience',
      },
      {
        'icon': 'trending-up',
        'title': 'Track Your Growth',
        'description': 'See your stats and tier progress',
      },
      {
        'icon': 'shield-check',
        'title': 'Build Trust',
        'description': 'Verified accounts get priority access',
      },
    ];
  }

  Future<void> _handleConnect() async {
    setState(() => _isConnecting = true);

    final authService = context.read<AuthService>();
    final success = await authService.connectSocialAccount(widget.platform);

    if (success && mounted) {
      setState(() {
        _isConnecting = false;
        _isSuccess = true;
      });

      await Future.delayed(const Duration(milliseconds: 800));

      if (mounted) {
        widget.onSuccess?.call();
        Navigator.of(context).pop(true);
      }
    } else if (mounted) {
      setState(() => _isConnecting = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to connect $_platformName'),
          backgroundColor: Colors.red,
        ),
      );
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
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () {
                        widget.onCancel?.call();
                        Navigator.of(context).pop(false);
                      },
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          LucideIcons.x,
                          size: 20,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ),
                    const Spacer(),
                    Text(
                      'Connect $_platformName',
                      style: AppTypography.h3,
                    ),
                    const Spacer(),
                    const SizedBox(width: 40),
                  ],
                ),
              ),

              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      const SizedBox(height: 20),

                      // Platform Icon
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: widget.platform == SocialPlatform.instagram
                                ? [
                                    const Color(0xFFFEDA77),
                                    const Color(0xFFF58529),
                                    const Color(0xFFDD2A7B),
                                    const Color(0xFF8134AF),
                                    const Color(0xFF515BD4),
                                  ]
                                : [
                                    _platformColor.withValues(alpha: 0.8),
                                    _platformColor,
                                  ],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(24),
                          boxShadow: [
                            BoxShadow(
                              color: _platformColor.withValues(alpha: 0.4),
                              blurRadius: 20,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        child: widget.platform == SocialPlatform.tiktok
                            ? CustomPaint(
                                painter: _TikTokLogoPainter(),
                                child: const SizedBox(width: 50, height: 50),
                              )
                            : Icon(
                                _platformIcon,
                                size: 50,
                                color: Colors.white,
                              ),
                      ),

                      const SizedBox(height: 32),

                      // Title
                      Text(
                        'Connect your $_platformName account',
                        style: AppTypography.h2,
                        textAlign: TextAlign.center,
                      ),

                      const SizedBox(height: 12),

                      Text(
                        'Link your account to unlock better opportunities and track your growth',
                        style: AppTypography.body.copyWith(
                          color: AppColors.textSecondary,
                        ),
                        textAlign: TextAlign.center,
                      ),

                      const SizedBox(height: 40),

                      // Benefits
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: _platformColor.withValues(alpha: 0.2),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Why connect?',
                              style: AppTypography.label.copyWith(
                                color: _platformColor,
                              ),
                            ),
                            const SizedBox(height: 16),
                            ..._benefits.map((benefit) => Padding(
                                  padding: const EdgeInsets.only(bottom: 16),
                                  child: Row(
                                    children: [
                                      Container(
                                        width: 40,
                                        height: 40,
                                        decoration: BoxDecoration(
                                          color: _platformColor.withValues(alpha: 0.15),
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: Icon(
                                          _getIconData(benefit['icon']!),
                                          size: 20,
                                          color: _platformColor,
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              benefit['title']!,
                                              style: AppTypography.label,
                                            ),
                                            Text(
                                              benefit['description']!,
                                              style: AppTypography.caption,
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                )),
                          ],
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Permissions
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Permissions requested',
                              style: AppTypography.label.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                            const SizedBox(height: 12),
                            ..._permissions.map((permission) => Padding(
                                  padding: const EdgeInsets.only(bottom: 8),
                                  child: Row(
                                    children: [
                                      Icon(
                                        LucideIcons.check,
                                        size: 16,
                                        color: AppColors.cyan,
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Text(
                                          permission,
                                          style: AppTypography.bodySmall,
                                        ),
                                      ),
                                    ],
                                  ),
                                )),
                          ],
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Privacy note
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            LucideIcons.lock,
                            size: 14,
                            color: AppColors.textMuted,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Your data is secure and never shared',
                            style: AppTypography.caption,
                          ),
                        ],
                      ),

                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),

              // Bottom button
              Padding(
                padding: const EdgeInsets.all(24),
                child: _isSuccess
                    ? Container(
                        height: 56,
                        decoration: BoxDecoration(
                          color: AppColors.cyan.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.cyan),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              LucideIcons.checkCircle,
                              color: AppColors.cyan,
                            ),
                            const SizedBox(width: 12),
                            Text(
                              'Connected successfully!',
                              style: AppTypography.label.copyWith(
                                color: AppColors.cyan,
                              ),
                            ),
                          ],
                        ),
                      )
                    : GradientButton(
                        onPressed: _isConnecting ? null : _handleConnect,
                        text: _isConnecting
                            ? 'Connecting...'
                            : 'Connect $_platformName',
                        isLoading: _isConnecting,
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getIconData(String name) {
    switch (name) {
      case 'target':
        return LucideIcons.target;
      case 'trending-up':
        return LucideIcons.trendingUp;
      case 'shield-check':
        return LucideIcons.shieldCheck;
      default:
        return LucideIcons.circle;
    }
  }
}

class _TikTokLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    const scale = 0.4;

    // TikTok logo shape - simplified
    final path = Path();

    // Note shape
    path.addRRect(RRect.fromRectAndRadius(
      Rect.fromCenter(center: center, width: 30 * scale, height: 50 * scale),
      Radius.circular(4 * scale),
    ));

    // Cyan shadow
    final cyanPaint = Paint()
      ..color = const Color(0xFF25F4EE)
      ..style = PaintingStyle.fill;
    canvas.save();
    canvas.translate(-3, 2);
    canvas.drawPath(path, cyanPaint);
    canvas.restore();

    // Red shadow
    final redPaint = Paint()
      ..color = const Color(0xFFFE2C55)
      ..style = PaintingStyle.fill;
    canvas.save();
    canvas.translate(3, -2);
    canvas.drawPath(path, redPaint);
    canvas.restore();

    // White main shape
    final whitePaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;
    canvas.drawPath(path, whitePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
