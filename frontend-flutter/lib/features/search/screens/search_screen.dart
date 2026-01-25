import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/data/mock_offers.dart';
import '../../../core/widgets/widgets.dart';
import '../../../core/services/offers_service.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _searchController = TextEditingController();
  final List<String> _selectedFilters = [];
  String _sortBy = 'newest';
  RangeValues _followersRange = const RangeValues(0, 500000);

  final List<String> _filterOptions = [
    'Food & Dining',
    'Fitness',
    'Wellness',
    'Fashion',
    'Travel',
    'Beauty',
    'Tech',
  ];

  final List<String> _sortOptions = [
    'newest',
    'popular',
    'ending_soon',
    'highest_value',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<OffersService>(
      builder: (context, offersService, child) {
        final searchQuery = offersService.searchQuery;
        final searchResults = _getSearchResults(offersService);

        return Scaffold(
          body: GradientBackground(
            child: SafeArea(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Search', style: AppTypography.h2),
                            GestureDetector(
                              onTap: () => _showAdvancedFilters(context),
                              child: Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: AppColors.surface,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: AppColors.surfaceLight),
                                ),
                                child: const Icon(LucideIcons.sliders, size: 20, color: AppColors.cyan),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Find your perfect collaboration',
                          style: AppTypography.body.copyWith(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                  // Search Bar
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
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
                          hintText: 'Search offers, brands, categories...',
                          hintStyle: AppTypography.body.copyWith(color: AppColors.textMuted),
                          prefixIcon: const Icon(LucideIcons.search, color: AppColors.textMuted, size: 20),
                          suffixIcon: searchQuery.isNotEmpty
                              ? IconButton(
                                  onPressed: () {
                                    _searchController.clear();
                                    offersService.setSearchQuery('');
                                  },
                                  icon: const Icon(LucideIcons.x, color: AppColors.textMuted, size: 18),
                                )
                              : null,
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Filter Chips
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      children: _filterOptions.map((filter) {
                        final isSelected = _selectedFilters.contains(filter);
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: FilterChip(
                            label: Text(filter),
                            selected: isSelected,
                            onSelected: (selected) {
                              setState(() {
                                if (selected) {
                                  _selectedFilters.add(filter);
                                } else {
                                  _selectedFilters.remove(filter);
                                }
                              });
                            },
                            backgroundColor: AppColors.surface,
                            selectedColor: AppColors.cyan.withValues(alpha: 0.2),
                            checkmarkColor: AppColors.cyan,
                            labelStyle: AppTypography.labelSmall.copyWith(
                              color: isSelected ? AppColors.cyan : AppColors.textSecondary,
                            ),
                            side: BorderSide(
                              color: isSelected ? AppColors.cyan : AppColors.surfaceLight,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Sort option display
                  if (searchQuery.isNotEmpty || _selectedFilters.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        children: [
                          Text(
                            '${searchResults.length} results',
                            style: AppTypography.label.copyWith(color: AppColors.textSecondary),
                          ),
                          const Spacer(),
                          GestureDetector(
                            onTap: () => _showSortOptions(context),
                            child: Row(
                              children: [
                                const Icon(LucideIcons.arrowUpDown, size: 14, color: AppColors.cyan),
                                const SizedBox(width: 4),
                                Text(
                                  _getSortLabel(_sortBy),
                                  style: AppTypography.labelSmall.copyWith(color: AppColors.cyan),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  const SizedBox(height: 8),
                  // Results
                  Expanded(
                    child: searchQuery.isEmpty && _selectedFilters.isEmpty
                        ? _buildInitialState(offersService)
                        : searchResults.isEmpty
                            ? _buildEmptyState()
                            : _buildResults(searchResults, offersService),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  List<Offer> _getSearchResults(OffersService offersService) {
    final query = offersService.searchQuery.toLowerCase();

    List<Offer> results = mockOffers.where((offer) {
      final matchesSearch = query.isEmpty ||
          offer.title.toLowerCase().contains(query) ||
          offer.businessName.toLowerCase().contains(query) ||
          offer.category.toLowerCase().contains(query) ||
          offer.description.toLowerCase().contains(query);

      final matchesFilter = _selectedFilters.isEmpty ||
          _selectedFilters.any((f) => offer.category.toLowerCase().contains(f.toLowerCase()));

      final matchesFollowers = offer.minFollowers >= _followersRange.start &&
          (offer.minFollowers <= _followersRange.end || _followersRange.end >= 500000);

      return matchesSearch && matchesFilter && matchesFollowers;
    }).toList();

    // Apply sorting
    switch (_sortBy) {
      case 'newest':
        results.sort((a, b) => b.postedDate.compareTo(a.postedDate));
        break;
      case 'popular':
        results.sort((a, b) => b.applicants.compareTo(a.applicants));
        break;
      case 'ending_soon':
        results.sort((a, b) {
          final aDeadline = a.deadline ?? '9999-12-31';
          final bDeadline = b.deadline ?? '9999-12-31';
          return aDeadline.compareTo(bDeadline);
        });
        break;
      case 'highest_value':
        results.sort((a, b) => b.estimatedValue.compareTo(a.estimatedValue));
        break;
    }

    return results;
  }

  String _getSortLabel(String sortBy) {
    switch (sortBy) {
      case 'newest':
        return 'Newest';
      case 'popular':
        return 'Most Popular';
      case 'ending_soon':
        return 'Ending Soon';
      case 'highest_value':
        return 'Highest Value';
      default:
        return 'Newest';
    }
  }

  void _showSortOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Sort By', style: AppTypography.h4),
            const SizedBox(height: 20),
            ..._sortOptions.map((option) => GestureDetector(
              onTap: () {
                setState(() => _sortBy = option);
                Navigator.pop(context);
              },
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 14),
                child: Row(
                  children: [
                    Icon(
                      _sortBy == option ? LucideIcons.checkCircle : LucideIcons.circle,
                      size: 20,
                      color: _sortBy == option ? AppColors.cyan : AppColors.textMuted,
                    ),
                    const SizedBox(width: 12),
                    Text(
                      _getSortLabel(option),
                      style: AppTypography.body.copyWith(
                        color: _sortBy == option ? AppColors.cyan : AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
              ),
            )),
            SizedBox(height: MediaQuery.of(context).padding.bottom),
          ],
        ),
      ),
    );
  }

  void _showAdvancedFilters(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => DraggableScrollableSheet(
          initialChildSize: 0.7,
          minChildSize: 0.5,
          maxChildSize: 0.9,
          expand: false,
          builder: (context, scrollController) => Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Advanced Filters', style: AppTypography.h4),
                    GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: const Icon(LucideIcons.x, color: AppColors.textMuted),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Expanded(
                  child: SingleChildScrollView(
                    controller: scrollController,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Categories
                        Text('Categories', style: AppTypography.label),
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: _filterOptions.map((filter) {
                            final isSelected = _selectedFilters.contains(filter);
                            return GestureDetector(
                              onTap: () {
                                setModalState(() {
                                  if (isSelected) {
                                    _selectedFilters.remove(filter);
                                  } else {
                                    _selectedFilters.add(filter);
                                  }
                                });
                                setState(() {});
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                                decoration: BoxDecoration(
                                  color: isSelected ? AppColors.cyan.withValues(alpha: 0.2) : AppColors.surfaceLight,
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: isSelected ? AppColors.cyan : AppColors.surfaceLight,
                                  ),
                                ),
                                child: Text(
                                  filter,
                                  style: AppTypography.labelSmall.copyWith(
                                    color: isSelected ? AppColors.cyan : AppColors.textSecondary,
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 24),
                        // Follower Range
                        Text('Minimum Followers Requirement', style: AppTypography.label),
                        const SizedBox(height: 12),
                        RangeSlider(
                          values: _followersRange,
                          min: 0,
                          max: 500000,
                          divisions: 50,
                          activeColor: AppColors.cyan,
                          inactiveColor: AppColors.surfaceLight,
                          labels: RangeLabels(
                            _formatFollowers(_followersRange.start.toInt()),
                            _followersRange.end >= 500000 ? '500K+' : _formatFollowers(_followersRange.end.toInt()),
                          ),
                          onChanged: (values) {
                            setModalState(() => _followersRange = values);
                            setState(() {});
                          },
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              _formatFollowers(_followersRange.start.toInt()),
                              style: AppTypography.caption,
                            ),
                            Text(
                              _followersRange.end >= 500000 ? '500K+' : _formatFollowers(_followersRange.end.toInt()),
                              style: AppTypography.caption,
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        // Sort By
                        Text('Sort By', style: AppTypography.label),
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: _sortOptions.map((option) {
                            final isSelected = _sortBy == option;
                            return GestureDetector(
                              onTap: () {
                                setModalState(() => _sortBy = option);
                                setState(() {});
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                                decoration: BoxDecoration(
                                  color: isSelected ? AppColors.magenta.withValues(alpha: 0.2) : AppColors.surfaceLight,
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: isSelected ? AppColors.magenta : AppColors.surfaceLight,
                                  ),
                                ),
                                child: Text(
                                  _getSortLabel(option),
                                  style: AppTypography.labelSmall.copyWith(
                                    color: isSelected ? AppColors.magenta : AppColors.textSecondary,
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setModalState(() {
                            _selectedFilters.clear();
                            _sortBy = 'newest';
                            _followersRange = const RangeValues(0, 500000);
                          });
                          setState(() {});
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceLight,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          alignment: Alignment.center,
                          child: Text('Clear All', style: AppTypography.button),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => Navigator.pop(context),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [AppColors.cyan, AppColors.magenta],
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'Apply Filters',
                            style: AppTypography.button.copyWith(color: Colors.white),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _formatFollowers(int count) {
    if (count >= 1000000) {
      return '${(count / 1000000).toStringAsFixed(1)}M';
    } else if (count >= 1000) {
      return '${(count / 1000).toStringAsFixed(0)}K';
    }
    return count.toString();
  }

  Widget _buildInitialState(OffersService offersService) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Popular Categories', style: AppTypography.h4),
          const SizedBox(height: 16),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _CategoryTile(
                icon: LucideIcons.utensils,
                label: 'Food & Dining',
                color: const Color(0xFFF97316),
                count: mockOffers.where((o) => o.category.toLowerCase().contains('food')).length,
                onTap: () {
                  setState(() => _selectedFilters.add('Food & Dining'));
                  offersService.setSearchQuery(' ');
                  offersService.setSearchQuery('');
                },
              ),
              _CategoryTile(
                icon: LucideIcons.dumbbell,
                label: 'Fitness',
                color: const Color(0xFF22C55E),
                count: mockOffers.where((o) => o.category.toLowerCase().contains('fitness')).length,
                onTap: () {
                  setState(() => _selectedFilters.add('Fitness'));
                  offersService.setSearchQuery(' ');
                  offersService.setSearchQuery('');
                },
              ),
              _CategoryTile(
                icon: LucideIcons.sparkles,
                label: 'Beauty',
                color: AppColors.magenta,
                count: mockOffers.where((o) => o.category.toLowerCase().contains('beauty')).length,
                onTap: () {
                  setState(() => _selectedFilters.add('Beauty'));
                  offersService.setSearchQuery(' ');
                  offersService.setSearchQuery('');
                },
              ),
              _CategoryTile(
                icon: LucideIcons.shirt,
                label: 'Fashion',
                color: AppColors.purple,
                count: mockOffers.where((o) => o.category.toLowerCase().contains('fashion')).length,
                onTap: () {
                  setState(() => _selectedFilters.add('Fashion'));
                  offersService.setSearchQuery(' ');
                  offersService.setSearchQuery('');
                },
              ),
              _CategoryTile(
                icon: LucideIcons.plane,
                label: 'Travel',
                color: AppColors.cyan,
                count: mockOffers.where((o) => o.category.toLowerCase().contains('travel')).length,
                onTap: () {
                  setState(() => _selectedFilters.add('Travel'));
                  offersService.setSearchQuery(' ');
                  offersService.setSearchQuery('');
                },
              ),
              _CategoryTile(
                icon: LucideIcons.smartphone,
                label: 'Tech',
                color: const Color(0xFF3B82F6),
                count: mockOffers.where((o) => o.category.toLowerCase().contains('tech')).length,
                onTap: () {
                  setState(() => _selectedFilters.add('Tech'));
                  offersService.setSearchQuery(' ');
                  offersService.setSearchQuery('');
                },
              ),
            ],
          ),
          const SizedBox(height: 32),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Recent Searches', style: AppTypography.h4),
              GestureDetector(
                onTap: () {
                  // Clear recent searches
                },
                child: Text(
                  'Clear',
                  style: AppTypography.labelSmall.copyWith(color: AppColors.textMuted),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _RecentSearchItem(
            query: 'Restaurant Miami',
            onTap: () {
              _searchController.text = 'Restaurant Miami';
              offersService.setSearchQuery('Restaurant Miami');
            },
          ),
          _RecentSearchItem(
            query: 'Spa wellness',
            onTap: () {
              _searchController.text = 'Spa wellness';
              offersService.setSearchQuery('Spa wellness');
            },
          ),
          _RecentSearchItem(
            query: 'Fashion boutique',
            onTap: () {
              _searchController.text = 'Fashion boutique';
              offersService.setSearchQuery('Fashion boutique');
            },
          ),
          const SizedBox(height: 32),
          Text('Trending Searches', style: AppTypography.h4),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _TrendingTag(
                label: 'Brunch spots',
                onTap: () {
                  _searchController.text = 'Brunch';
                  offersService.setSearchQuery('Brunch');
                },
              ),
              _TrendingTag(
                label: 'Gym memberships',
                onTap: () {
                  _searchController.text = 'Gym';
                  offersService.setSearchQuery('Gym');
                },
              ),
              _TrendingTag(
                label: 'New restaurants',
                onTap: () {
                  _searchController.text = 'Restaurant';
                  offersService.setSearchQuery('Restaurant');
                },
              ),
              _TrendingTag(
                label: 'Skincare',
                onTap: () {
                  _searchController.text = 'Skincare';
                  offersService.setSearchQuery('Skincare');
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            LucideIcons.searchX,
            size: 64,
            color: AppColors.textMuted.withValues(alpha: 0.5),
          ),
          const SizedBox(height: 24),
          Text('No results found', style: AppTypography.h4),
          const SizedBox(height: 8),
          Text(
            'Try different keywords or filters',
            style: AppTypography.body.copyWith(color: AppColors.textSecondary),
          ),
          const SizedBox(height: 24),
          GestureDetector(
            onTap: () {
              _searchController.clear();
              setState(() {
                _selectedFilters.clear();
                _sortBy = 'newest';
                _followersRange = const RangeValues(0, 500000);
              });
              context.read<OffersService>().setSearchQuery('');
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.cyan),
              ),
              child: Text(
                'Clear Filters',
                style: AppTypography.button.copyWith(color: AppColors.cyan),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResults(List<Offer> results, OffersService offersService) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: results.length,
      itemBuilder: (context, index) {
        final offer = results[index];
        final isSaved = offersService.savedOfferIds.contains(offer.id);

        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: GestureDetector(
            onTap: () => context.push('/offer/${offer.id}'),
            child: _SearchResultCard(
              offer: offer,
              isSaved: isSaved,
              onSave: () => offersService.toggleSaveOffer(offer.id),
            ),
          ),
        );
      },
    );
  }
}

class _CategoryTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final int count;
  final VoidCallback onTap;

  const _CategoryTile({
    required this.icon,
    required this.label,
    required this.color,
    required this.count,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: (MediaQuery.of(context).size.width - 44) / 2,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withValues(alpha: 0.3)),
        ),
        child: Row(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: AppTypography.label.copyWith(color: color),
                  ),
                  Text(
                    '$count offers',
                    style: AppTypography.caption.copyWith(color: color.withValues(alpha: 0.7)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RecentSearchItem extends StatelessWidget {
  final String query;
  final VoidCallback onTap;

  const _RecentSearchItem({required this.query, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12),
        child: Row(
          children: [
            const Icon(LucideIcons.clock, size: 18, color: AppColors.textMuted),
            const SizedBox(width: 12),
            Expanded(
              child: Text(query, style: AppTypography.body.copyWith(color: AppColors.textSecondary)),
            ),
            const Icon(LucideIcons.arrowUpRight, size: 16, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }
}

class _TrendingTag extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _TrendingTag({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.surfaceLight),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(LucideIcons.trendingUp, size: 14, color: AppColors.cyan),
            const SizedBox(width: 6),
            Text(
              label,
              style: AppTypography.labelSmall.copyWith(color: AppColors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}

class _SearchResultCard extends StatelessWidget {
  final Offer offer;
  final bool isSaved;
  final VoidCallback onSave;

  const _SearchResultCard({
    required this.offer,
    required this.isSaved,
    required this.onSave,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceLight),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.horizontal(left: Radius.circular(16)),
            child: Container(
              width: 110,
              height: 110,
              color: AppColors.surfaceLight,
              child: Stack(
                children: [
                  Positioned.fill(
                    child: Image.network(
                      offer.imageUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => const Center(
                        child: Icon(LucideIcons.image, color: AppColors.textMuted),
                      ),
                    ),
                  ),
                  // Save button
                  Positioned(
                    top: 8,
                    left: 8,
                    child: GestureDetector(
                      onTap: onSave,
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: AppColors.background.withValues(alpha: 0.8),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          isSaved ? LucideIcons.heart : LucideIcons.heart,
                          size: 14,
                          color: isSaved ? AppColors.magenta : AppColors.textMuted,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          offer.businessName,
                          style: AppTypography.caption.copyWith(color: AppColors.cyan),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (offer.isNew)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFF4ADE80),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            'NEW',
                            style: AppTypography.caption.copyWith(
                              color: AppColors.background,
                              fontSize: 8,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    offer.title,
                    style: AppTypography.label,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceLight,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          offer.category,
                          style: AppTypography.caption.copyWith(fontSize: 10),
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(LucideIcons.users, size: 12, color: AppColors.textMuted),
                      const SizedBox(width: 4),
                      Text(
                        '${offer.applicants}',
                        style: AppTypography.caption.copyWith(fontSize: 10),
                      ),
                      const Spacer(),
                      Text(
                        '\$${offer.estimatedValue}',
                        style: AppTypography.labelSmall.copyWith(color: AppColors.cyan),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
