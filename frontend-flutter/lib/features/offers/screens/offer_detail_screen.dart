import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/data/mock_offers.dart';
import '../../../core/services/offers_service.dart';
import '../../../core/services/collabs_service.dart';
import '../../../core/models/tier_model.dart';

class OfferDetailScreen extends StatefulWidget {
  final String offerId;

  const OfferDetailScreen({super.key, required this.offerId});

  @override
  State<OfferDetailScreen> createState() => _OfferDetailScreenState();
}

class _OfferDetailScreenState extends State<OfferDetailScreen> {
  bool _isApplying = false;

  @override
  Widget build(BuildContext context) {
    final offersService = context.watch<OffersService>();
    final offer = offersService.getOfferById(widget.offerId);

    if (offer == null) {
      return Scaffold(
        backgroundColor: AppColors.background,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                LucideIcons.alertCircle,
                size: 64,
                color: AppColors.textMuted,
              ),
              const SizedBox(height: 16),
              Text(
                'Offer not found',
                style: AppTypography.h3,
              ),
              const SizedBox(height: 24),
              TextButton(
                onPressed: () => context.go('/home'),
                child: Text(
                  'Go back to Home',
                  style: AppTypography.label.copyWith(color: AppColors.cyan),
                ),
              ),
            ],
          ),
        ),
      );
    }

    final isSaved = offersService.isOfferSaved(offer.id);
    final isInviteOnly = offer.offerType == 'invitation';
    final tierInfo = TierService.getTierInfo(
        TierLevel.values[offer.tierRequired.clamp(0, 5)]);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // Image Header
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            backgroundColor: AppColors.background,
            leading: GestureDetector(
              onTap: () => Navigator.of(context).pop(),
              child: Container(
                margin: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.5),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  LucideIcons.arrowLeft,
                  color: Colors.white,
                ),
              ),
            ),
            actions: [
              GestureDetector(
                onTap: () => offersService.toggleSaveOffer(offer.id),
                child: Container(
                  margin: const EdgeInsets.all(8),
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.5),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    isSaved ? LucideIcons.heartOff : LucideIcons.heart,
                    color: isSaved ? AppColors.magenta : Colors.white,
                    size: 20,
                  ),
                ),
              ),
              GestureDetector(
                onTap: () {
                  // Share functionality
                },
                child: Container(
                  margin: const EdgeInsets.only(right: 8, top: 8, bottom: 8),
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.5),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    LucideIcons.share2,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    offer.imageUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        color: AppColors.surface,
                        child: Icon(
                          LucideIcons.image,
                          size: 64,
                          color: AppColors.textMuted,
                        ),
                      );
                    },
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withValues(alpha: 0.7),
                        ],
                      ),
                    ),
                  ),
                  // Category badge
                  Positioned(
                    top: 100,
                    left: 16,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.surface.withValues(alpha: 0.9),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            _getCategoryIcon(offer.category),
                            size: 14,
                            color: AppColors.cyan,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            offer.category,
                            style: AppTypography.caption.copyWith(
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  // Invite only badge
                  if (isInviteOnly)
                    Positioned(
                      top: 100,
                      right: 16,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              AppColors.magenta,
                              AppColors.purple,
                            ],
                          ),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              LucideIcons.crown,
                              size: 14,
                              color: Colors.white,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              'Invite Only',
                              style: AppTypography.caption.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),

          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Business info
                  Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          _getBusinessIcon(offer.businessLogo),
                          color: AppColors.cyan,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              offer.businessName,
                              style: AppTypography.label,
                            ),
                            if (offer.location != null)
                              Row(
                                children: [
                                  Icon(
                                    LucideIcons.mapPin,
                                    size: 12,
                                    color: AppColors.textMuted,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    offer.location!,
                                    style: AppTypography.caption,
                                  ),
                                ],
                              ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Title
                  Text(
                    offer.title,
                    style: AppTypography.h2,
                  ),

                  const SizedBox(height: 12),

                  // Description
                  Text(
                    offer.description,
                    style: AppTypography.body.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),

                  const SizedBox(height: 24),

                  // What you get
                  _buildSection(
                    icon: LucideIcons.gift,
                    iconColor: AppColors.cyan,
                    title: 'What You Get',
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.cyan.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: AppColors.cyan.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Text(
                        offer.whatYouGet,
                        style: AppTypography.body.copyWith(
                          color: AppColors.cyan,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Content Required
                  _buildSection(
                    icon: LucideIcons.camera,
                    iconColor: AppColors.magenta,
                    title: 'Content Required',
                    child: Column(
                      children: offer.contentRequired.map((content) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Row(
                            children: [
                              Container(
                                width: 32,
                                height: 32,
                                decoration: BoxDecoration(
                                  color:
                                      AppColors.magenta.withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Center(
                                  child: Text(
                                    '${content.quantity}',
                                    style: AppTypography.label.copyWith(
                                      color: AppColors.magenta,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Text(
                                _formatContentType(content.type),
                                style: AppTypography.body,
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Requirements
                  _buildSection(
                    icon: LucideIcons.userCheck,
                    iconColor: AppColors.purple,
                    title: 'Requirements',
                    child: Column(
                      children: [
                        _buildRequirementRow(
                          'Minimum Followers',
                          _formatFollowers(offer.minFollowers),
                        ),
                        _buildRequirementRow(
                          'Tier Required',
                          tierInfo.displayName,
                          color: tierInfo.color,
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Stats
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: _buildStat(
                            '${offer.applicants}',
                            'Applicants',
                            LucideIcons.users,
                          ),
                        ),
                        Container(
                          width: 1,
                          height: 40,
                          color: AppColors.surfaceLight,
                        ),
                        Expanded(
                          child: _buildStat(
                            offer.deadline != null
                                ? _formatDeadline(offer.deadline!)
                                : 'Open',
                            'Deadline',
                            LucideIcons.clock,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border(
            top: BorderSide(color: AppColors.surfaceLight),
          ),
        ),
        child: SafeArea(
          child: Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: _isApplying
                      ? null
                      : () async {
                          setState(() => _isApplying = true);
                          final success =
                              await offersService.applyToOffer(offer.id);
                          if (success && mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: const Text('Application submitted!'),
                                backgroundColor: AppColors.cyan,
                              ),
                            );
                            context.go('/collabs');
                          }
                          if (mounted) {
                            setState(() => _isApplying = false);
                          }
                        },
                  child: Container(
                    height: 56,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: isInviteOnly
                            ? [AppColors.magenta, AppColors.purple]
                            : [AppColors.cyan, AppColors.blue],
                      ),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: (isInviteOnly
                                  ? AppColors.magenta
                                  : AppColors.cyan)
                              .withValues(alpha: 0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Center(
                      child: _isApplying
                          ? const SizedBox(
                              width: 24,
                              height: 24,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2,
                              ),
                            )
                          : Text(
                              isInviteOnly ? 'View Invite' : 'Apply Now',
                              style: AppTypography.buttonText.copyWith(
                                color: Colors.white,
                              ),
                            ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSection({
    required IconData icon,
    required Color iconColor,
    required String title,
    required Widget child,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 18, color: iconColor),
            const SizedBox(width: 8),
            Text(
              title,
              style: AppTypography.label.copyWith(color: iconColor),
            ),
          ],
        ),
        const SizedBox(height: 12),
        child,
      ],
    );
  }

  Widget _buildRequirementRow(String label, String value, {Color? color}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: AppTypography.body.copyWith(color: AppColors.textSecondary),
          ),
          Text(
            value,
            style: AppTypography.label.copyWith(color: color),
          ),
        ],
      ),
    );
  }

  Widget _buildStat(String value, String label, IconData icon) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 16, color: AppColors.textMuted),
            const SizedBox(width: 6),
            Text(value, style: AppTypography.h3),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: AppTypography.caption,
        ),
      ],
    );
  }

  String _formatFollowers(int followers) {
    if (followers >= 1000000) {
      return '${(followers / 1000000).toStringAsFixed(1)}M+';
    } else if (followers >= 1000) {
      return '${(followers / 1000).toStringAsFixed(0)}K+';
    }
    return '$followers+';
  }

  String _formatContentType(String type) {
    switch (type) {
      case 'story':
        return 'Instagram Stories';
      case 'post':
        return 'Feed Posts';
      case 'reel':
        return 'Reels / Short Videos';
      case 'video':
        return 'Long-form Video';
      case 'review':
        return 'Written Review';
      default:
        return type;
    }
  }

  String _formatDeadline(String deadline) {
    try {
      final date = DateTime.parse(deadline);
      final now = DateTime.now();
      final diff = date.difference(now).inDays;
      if (diff < 0) return 'Expired';
      if (diff == 0) return 'Today';
      if (diff == 1) return 'Tomorrow';
      if (diff <= 7) return '$diff days';
      return '${date.month}/${date.day}';
    } catch (e) {
      return deadline;
    }
  }

  IconData _getCategoryIcon(String category) {
    final lower = category.toLowerCase();
    if (lower.contains('food') || lower.contains('dining')) {
      return LucideIcons.utensils;
    } else if (lower.contains('fitness')) {
      return LucideIcons.dumbbell;
    } else if (lower.contains('wellness') || lower.contains('spa')) {
      return LucideIcons.heart;
    } else if (lower.contains('fashion')) {
      return LucideIcons.shirt;
    } else if (lower.contains('travel')) {
      return LucideIcons.plane;
    } else if (lower.contains('beauty')) {
      return LucideIcons.sparkles;
    } else if (lower.contains('tech')) {
      return LucideIcons.smartphone;
    }
    return LucideIcons.tag;
  }

  IconData _getBusinessIcon(String logo) {
    switch (logo) {
      case 'dining':
        return LucideIcons.utensils;
      case 'fitness':
        return LucideIcons.dumbbell;
      case 'wellness':
        return LucideIcons.heart;
      case 'fashion':
        return LucideIcons.shirt;
      case 'travel':
        return LucideIcons.plane;
      case 'beauty':
        return LucideIcons.sparkles;
      case 'tech':
        return LucideIcons.smartphone;
      case 'home':
        return LucideIcons.home;
      default:
        return LucideIcons.building;
    }
  }
}
