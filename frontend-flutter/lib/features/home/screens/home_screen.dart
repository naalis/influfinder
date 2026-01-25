import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/data/mock_offers.dart';
import '../../../core/widgets/widgets.dart';
import '../../../core/services/services.dart';
import '../../../core/models/models.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final offersService = context.watch<OffersService>();
    final authService = context.watch<AuthService>();
    final user = authService.user ?? mockUserProfile;
    final tierInfo = TierService.getTierInfoFromCollabs(user.collabs);

    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: CustomScrollView(
            slivers: [
              // Header
              SliverToBoxAdapter(
                child: _buildHeader(user, tierInfo),
              ),
              // Category Filters
              SliverPersistentHeader(
                pinned: true,
                delegate: _CategoryFilterDelegate(
                  categories: categories,
                  selectedCategory: offersService.selectedCategory,
                  onSelectCategory: (cat) => offersService.setCategory(cat),
                ),
              ),
              // Stats Bar
              SliverToBoxAdapter(
                child: _buildStatsBar(offersService),
              ),
              // Offers List
              offersService.filteredOffers.isNotEmpty
                  ? SliverPadding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      sliver: SliverList(
                        delegate: SliverChildBuilderDelegate(
                          (context, index) {
                            if (index == offersService.filteredOffers.length) {
                              return _buildLoadMoreButton();
                            }
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 16),
                              child: _OfferCard(
                                offer: offersService.filteredOffers[index],
                                isSaved: offersService.isOfferSaved(
                                    offersService.filteredOffers[index].id),
                                onTap: () => context.push(
                                    '/offer/${offersService.filteredOffers[index].id}'),
                                onSave: () => offersService.toggleSaveOffer(
                                    offersService.filteredOffers[index].id),
                              ),
                            );
                          },
                          childCount: offersService.filteredOffers.length + 1,
                        ),
                      ),
                    )
                  : SliverFillRemaining(
                      child: _buildEmptyState(offersService),
                    ),
              const SliverToBoxAdapter(
                child: SizedBox(height: 100),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(UserProfile user, TierInfo tierInfo) {
    final offersService = context.read<OffersService>();

    return Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top row: Logo and Tier
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const InflufinderIsotipo(size: 32),
                  const SizedBox(width: 12),
                  Text(
                    'Influfinder',
                    style: AppTypography.h4,
                  ),
                ],
              ),
              _TierBadge(tierInfo: tierInfo),
            ],
          ),
          const SizedBox(height: 16),
          // Welcome text
          Text(
            'Hey, ${user.name.split(' ').first}! 👋',
            style: AppTypography.h3,
          ),
          const SizedBox(height: 4),
          Text(
            'Find your next collaboration',
            style: AppTypography.body.copyWith(color: AppColors.textSecondary),
          ),
          const SizedBox(height: 16),
          // Search Bar
          Row(
            children: [
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.surfaceLight),
                  ),
                  child: TextField(
                    controller: _searchController,
                    onChanged: (value) => offersService.setSearchQuery(value),
                    style: AppTypography.body,
                    decoration: InputDecoration(
                      hintText: 'Search offers...',
                      hintStyle:
                          AppTypography.body.copyWith(color: AppColors.textMuted),
                      prefixIcon: const Icon(LucideIcons.search,
                          color: AppColors.textMuted, size: 20),
                      suffixIcon: offersService.searchQuery.isNotEmpty
                          ? IconButton(
                              icon: const Icon(LucideIcons.x,
                                  color: AppColors.textMuted, size: 18),
                              onPressed: () {
                                _searchController.clear();
                                offersService.setSearchQuery('');
                              },
                            )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 14),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              GestureDetector(
                onTap: () {
                  // Open filters bottom sheet
                  _showFiltersSheet(context);
                },
                child: Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.surfaceLight),
                  ),
                  child: const Icon(LucideIcons.slidersHorizontal,
                      color: AppColors.textMuted, size: 20),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showFiltersSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Filters', style: AppTypography.h3),
                  IconButton(
                    icon: const Icon(LucideIcons.x, color: AppColors.textMuted),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text('Sort by', style: AppTypography.label),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                children: [
                  _FilterChip(label: 'Newest', isSelected: true),
                  _FilterChip(label: 'Most Popular'),
                  _FilterChip(label: 'Ending Soon'),
                ],
              ),
              const SizedBox(height: 24),
              Text('Offer Type', style: AppTypography.label),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                children: [
                  _FilterChip(label: 'All', isSelected: true),
                  _FilterChip(label: 'Applications'),
                  _FilterChip(label: 'Invitations'),
                ],
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: GradientButton(
                  onPressed: () => Navigator.pop(context),
                  text: 'Apply Filters',
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        );
      },
    );
  }

  Widget _buildStatsBar(OffersService offersService) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceLight),
      ),
      child: Row(
        children: [
          Expanded(
            child: _StatItem(
              value: '${offersService.availableCount}',
              label: 'Available',
              icon: LucideIcons.sparkles,
              color: AppColors.cyan,
            ),
          ),
          Container(width: 1, height: 40, color: AppColors.surfaceLight),
          Expanded(
            child: _StatItem(
              value: '${offersService.inviteOnlyCount}',
              label: 'Invite Only',
              color: AppColors.magenta,
            ),
          ),
          Container(width: 1, height: 40, color: AppColors.surfaceLight),
          Expanded(
            child: _StatItem(
              value: '${offersService.interestedCount}',
              label: 'Saved',
              color: AppColors.purple,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoadMoreButton() {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: OutlinedButton(
        onPressed: () {},
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 16),
          side: const BorderSide(color: AppColors.surfaceLight),
        ),
        child: Text(
          'Load More Offers',
          style: AppTypography.button.copyWith(color: AppColors.textSecondary),
        ),
      ),
    );
  }

  Widget _buildEmptyState(OffersService offersService) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.surface,
              shape: BoxShape.circle,
            ),
            child: Icon(
              LucideIcons.search,
              size: 48,
              color: AppColors.cyan.withValues(alpha: 0.4),
            ),
          ),
          const SizedBox(height: 24),
          Text('No offers found', style: AppTypography.h3),
          const SizedBox(height: 8),
          Text(
            offersService.searchQuery.isNotEmpty
                ? 'No results for "${offersService.searchQuery}". Try a different search.'
                : 'Try selecting a different category',
            style: AppTypography.body.copyWith(color: AppColors.textSecondary),
            textAlign: TextAlign.center,
          ),
          if (offersService.searchQuery.isNotEmpty ||
              offersService.selectedCategory != 'all') ...[
            const SizedBox(height: 16),
            TextButton(
              onPressed: () => offersService.clearFilters(),
              child: Text(
                'Clear Filters',
                style: AppTypography.label.copyWith(color: AppColors.cyan),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;

  const _FilterChip({required this.label, this.isSelected = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.cyan : AppColors.surfaceLight,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: AppTypography.label.copyWith(
          color: isSelected ? AppColors.background : AppColors.textSecondary,
        ),
      ),
    );
  }
}

class _CategoryFilterDelegate extends SliverPersistentHeaderDelegate {
  final List<Category> categories;
  final String selectedCategory;
  final ValueChanged<String> onSelectCategory;

  _CategoryFilterDelegate({
    required this.categories,
    required this.selectedCategory,
    required this.onSelectCategory,
  });

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: AppColors.background.withValues(alpha: 0.95),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: categories.map((cat) {
            final isSelected = selectedCategory == cat.id;
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: GestureDetector(
                onTap: () => onSelectCategory(cat.id),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.cyan : AppColors.surface,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color:
                          isSelected ? AppColors.cyan : AppColors.surfaceLight,
                    ),
                  ),
                  child: Row(
                    children: [
                      if (cat.id != 'all') ...[
                        Icon(
                          _getCategoryIcon(cat.id),
                          size: 14,
                          color: isSelected
                              ? AppColors.background
                              : AppColors.textMuted,
                        ),
                        const SizedBox(width: 6),
                      ],
                      Text(
                        cat.label,
                        style: AppTypography.label.copyWith(
                          color: isSelected
                              ? AppColors.background
                              : AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  IconData _getCategoryIcon(String id) {
    switch (id) {
      case 'food':
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
      default:
        return LucideIcons.tag;
    }
  }

  @override
  double get maxExtent => 60;

  @override
  double get minExtent => 60;

  @override
  bool shouldRebuild(covariant SliverPersistentHeaderDelegate oldDelegate) =>
      true;
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;
  final IconData? icon;
  final Color color;

  const _StatItem({
    required this.value,
    required this.label,
    this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) ...[
              Icon(icon, size: 18, color: color),
              const SizedBox(width: 4),
            ],
            Text(
              value,
              style: AppTypography.h3.copyWith(color: color),
            ),
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
}

class _TierBadge extends StatelessWidget {
  final TierInfo tierInfo;

  const _TierBadge({required this.tierInfo});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [tierInfo.color, tierInfo.colorDark],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: tierInfo.color.withValues(alpha: 0.3),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(tierInfo.icon, size: 14, color: Colors.white),
          const SizedBox(width: 4),
          Text(
            tierInfo.displayName,
            style: AppTypography.labelSmall.copyWith(color: Colors.white),
          ),
        ],
      ),
    );
  }
}

class _OfferCard extends StatelessWidget {
  final Offer offer;
  final bool isSaved;
  final VoidCallback onTap;
  final VoidCallback onSave;

  const _OfferCard({
    required this.offer,
    required this.isSaved,
    required this.onTap,
    required this.onSave,
  });

  @override
  Widget build(BuildContext context) {
    final isInviteOnly = offer.offerType == 'invitation';

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.surfaceLight),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            Stack(
              children: [
                Container(
                  height: 160,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceLight,
                  ),
                  child: Image.network(
                    offer.imageUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => const Center(
                      child: Icon(LucideIcons.image, color: AppColors.textMuted),
                    ),
                  ),
                ),
                // Gradient overlay
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withValues(alpha: 0.3),
                        ],
                      ),
                    ),
                  ),
                ),
                // Category badge
                Positioned(
                  top: 12,
                  left: 12,
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.background.withValues(alpha: 0.9),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          _getCategoryIcon(offer.category),
                          size: 12,
                          color: AppColors.cyan,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          offer.category,
                          style: AppTypography.labelSmall,
                        ),
                      ],
                    ),
                  ),
                ),
                // Invite only badge
                if (isInviteOnly)
                  Positioned(
                    top: 12,
                    right: 50,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [AppColors.magenta, AppColors.purple],
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(LucideIcons.crown,
                              size: 12, color: Colors.white),
                          const SizedBox(width: 4),
                          Text(
                            'VIP',
                            style: AppTypography.labelSmall
                                .copyWith(color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                  ),
                // Save button
                Positioned(
                  top: 12,
                  right: 12,
                  child: GestureDetector(
                    onTap: onSave,
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: isSaved
                            ? AppColors.magenta
                            : AppColors.background.withValues(alpha: 0.9),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        isSaved ? LucideIcons.heart : LucideIcons.heart,
                        size: 16,
                        color: isSaved ? Colors.white : AppColors.textMuted,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            // Content
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Business name
                  Row(
                    children: [
                      Icon(
                        _getBusinessIcon(offer.businessLogo),
                        size: 14,
                        color: AppColors.cyan,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        offer.businessName,
                        style:
                            AppTypography.caption.copyWith(color: AppColors.cyan),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  // Title
                  Text(
                    offer.title,
                    style: AppTypography.h4,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  // What you get
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.cyan.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: AppColors.cyan.withValues(alpha: 0.2),
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(LucideIcons.gift, size: 16, color: AppColors.cyan),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            offer.whatYouGet,
                            style: AppTypography.bodySmall
                                .copyWith(color: AppColors.cyan),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Content required
                  Row(
                    children: [
                      const Icon(LucideIcons.camera,
                          size: 14, color: AppColors.textMuted),
                      const SizedBox(width: 6),
                      Text(
                        offer.contentSummary,
                        style: AppTypography.caption,
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  // Location & Applicants
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      if (offer.location != null)
                        Expanded(
                          child: Row(
                            children: [
                              const Icon(LucideIcons.mapPin,
                                  size: 14, color: AppColors.textMuted),
                              const SizedBox(width: 4),
                              Flexible(
                                child: Text(
                                  offer.location!,
                                  style: AppTypography.caption,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ),
                      Row(
                        children: [
                          const Icon(LucideIcons.users,
                              size: 14, color: AppColors.textMuted),
                          const SizedBox(width: 4),
                          Text(
                            '${offer.applicants} interested',
                            style: AppTypography.caption,
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Apply button
                  Container(
                    width: double.infinity,
                    height: 44,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: isInviteOnly
                            ? [AppColors.magenta, AppColors.purple]
                            : [AppColors.cyan, AppColors.blue],
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Center(
                      child: Text(
                        isInviteOnly ? 'View Invite' : 'Apply Now',
                        style:
                            AppTypography.buttonText.copyWith(color: Colors.white),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
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
