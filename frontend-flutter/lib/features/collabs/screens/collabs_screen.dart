import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/data/mock_collabs.dart';
import '../../../core/widgets/widgets.dart';
import '../../../core/services/collabs_service.dart';

class CollabsScreen extends StatefulWidget {
  const CollabsScreen({super.key});

  @override
  State<CollabsScreen> createState() => _CollabsScreenState();
}

class _CollabsScreenState extends State<CollabsScreen> {
  bool _showDeclined = false;

  final List<_TabInfo> _tabs = [
    _TabInfo(CollabTab.invitations, 'Invitations', LucideIcons.mail, AppColors.magenta),
    _TabInfo(CollabTab.applied, 'Applied', LucideIcons.send, const Color(0xFFFACC15)),
    _TabInfo(CollabTab.active, 'Active', LucideIcons.sparkles, const Color(0xFF60A5FA)),
    _TabInfo(CollabTab.inReview, 'In Review', LucideIcons.eye, const Color(0xFFFB923C)),
    _TabInfo(CollabTab.completed, 'Completed', LucideIcons.checkCircle, const Color(0xFF4ADE80)),
  ];

  @override
  Widget build(BuildContext context) {
    return Consumer<CollabsService>(
      builder: (context, collabsService, child) {
        final selectedTab = collabsService.selectedTab;
        final filteredCollabs = collabsService.currentTabCollabs;
        final declinedCollabs = collabsService.declinedCollabs;
        final tabCounts = collabsService.tabCounts;

        return Scaffold(
          body: GradientBackground(
            child: SafeArea(
              child: Column(
                children: [
                  // Header
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('My Collaborations', style: AppTypography.h2),
                        const SizedBox(height: 4),
                        Text(
                          'Track your exchange journey',
                          style: AppTypography.body.copyWith(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                  // Tabs
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      children: _tabs.map((tab) {
                        final isSelected = selectedTab == tab.tab;
                        final count = tabCounts[tab.tab] ?? 0;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: GestureDetector(
                            onTap: () => collabsService.setSelectedTab(tab.tab),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              decoration: BoxDecoration(
                                color: isSelected ? tab.color : AppColors.surface,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: isSelected ? tab.color : AppColors.surfaceLight,
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    tab.icon,
                                    size: 16,
                                    color: isSelected ? AppColors.background : AppColors.textSecondary,
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    tab.label,
                                    style: AppTypography.labelSmall.copyWith(
                                      color: isSelected ? AppColors.background : AppColors.textSecondary,
                                    ),
                                  ),
                                  if (count > 0) ...[
                                    const SizedBox(width: 6),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: isSelected
                                            ? AppColors.background.withValues(alpha: 0.2)
                                            : AppColors.surfaceLight,
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: Text(
                                        '$count',
                                        style: AppTypography.caption.copyWith(
                                          color: isSelected ? AppColors.background : AppColors.textMuted,
                                          fontSize: 10,
                                        ),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Stats Summary
                  _buildStatsBar(tabCounts),
                  // Loading indicator
                  if (collabsService.isLoading)
                    const Padding(
                      padding: EdgeInsets.all(16),
                      child: Center(child: CircularProgressIndicator(color: AppColors.cyan)),
                    ),
                  // Content
                  Expanded(
                    child: filteredCollabs.isNotEmpty
                        ? RefreshIndicator(
                            onRefresh: collabsService.refreshCollabs,
                            color: AppColors.cyan,
                            child: ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: filteredCollabs.length + (declinedCollabs.isNotEmpty && selectedTab == CollabTab.invitations ? 1 : 0),
                              itemBuilder: (context, index) {
                                if (index == filteredCollabs.length && declinedCollabs.isNotEmpty) {
                                  return _buildDeclinedSection(declinedCollabs);
                                }
                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 16),
                                  child: _CollabCard(
                                    collab: filteredCollabs[index],
                                    onAccept: selectedTab == CollabTab.invitations
                                        ? () => _handleAcceptInvitation(context, filteredCollabs[index])
                                        : null,
                                    onDecline: selectedTab == CollabTab.invitations
                                        ? () => _showDeclineDialog(context, filteredCollabs[index])
                                        : null,
                                    onSchedule: selectedTab == CollabTab.active && filteredCollabs[index].status == CollabStatus.accepted
                                        ? () => _showScheduleDialog(context, filteredCollabs[index])
                                        : null,
                                    onMarkVisited: selectedTab == CollabTab.active && filteredCollabs[index].status == CollabStatus.scheduled
                                        ? () => _handleMarkVisited(context, filteredCollabs[index])
                                        : null,
                                    onSubmitContent: selectedTab == CollabTab.active && filteredCollabs[index].status == CollabStatus.visited
                                        ? () => _handleSubmitContent(context, filteredCollabs[index])
                                        : null,
                                  ),
                                );
                              },
                            ),
                          )
                        : _buildEmptyState(selectedTab),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatsBar(Map<CollabTab, int> tabCounts) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceLight),
      ),
      child: Row(
        children: [
          _StatItem(
            icon: LucideIcons.mail,
            value: '${tabCounts[CollabTab.invitations]}',
            label: 'Invites',
            color: AppColors.magenta,
          ),
          _StatItem(
            icon: LucideIcons.send,
            value: '${tabCounts[CollabTab.applied]}',
            label: 'Applied',
            color: const Color(0xFFFACC15),
          ),
          _StatItem(
            icon: LucideIcons.sparkles,
            value: '${tabCounts[CollabTab.active]}',
            label: 'Active',
            color: const Color(0xFF60A5FA),
          ),
          _StatItem(
            icon: LucideIcons.checkCircle,
            value: '${tabCounts[CollabTab.completed]}',
            label: 'Done',
            color: const Color(0xFF4ADE80),
          ),
        ],
      ),
    );
  }

  Widget _buildDeclinedSection(List<Collaboration> declinedCollabs) {
    return Column(
      children: [
        const SizedBox(height: 16),
        GestureDetector(
          onTap: () => setState(() => _showDeclined = !_showDeclined),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.surfaceLight),
            ),
            child: Row(
              children: [
                Icon(LucideIcons.xCircle, size: 16, color: Colors.red.shade400),
                const SizedBox(width: 8),
                Text(
                  'Declined (${declinedCollabs.length})',
                  style: AppTypography.label.copyWith(color: AppColors.textSecondary),
                ),
                const Spacer(),
                Icon(
                  _showDeclined ? LucideIcons.chevronUp : LucideIcons.chevronDown,
                  size: 16,
                  color: AppColors.textMuted,
                ),
              ],
            ),
          ),
        ),
        if (_showDeclined) ...[
          const SizedBox(height: 16),
          ...declinedCollabs.map((collab) => Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Opacity(
                  opacity: 0.6,
                  child: _CollabCard(collab: collab),
                ),
              )),
        ],
      ],
    );
  }

  Widget _buildEmptyState(CollabTab selectedTab) {
    final tab = _tabs.firstWhere((t) => t.tab == selectedTab);
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(tab.icon, size: 64, color: tab.color.withValues(alpha: 0.3)),
          const SizedBox(height: 24),
          Text(
            'No ${tab.label.toLowerCase()} collaborations',
            style: AppTypography.h4,
          ),
          const SizedBox(height: 8),
          Text(
            _getEmptyMessage(selectedTab),
            style: AppTypography.body.copyWith(color: AppColors.textSecondary),
            textAlign: TextAlign.center,
          ),
          if (selectedTab == CollabTab.applied || selectedTab == CollabTab.invitations) ...[
            const SizedBox(height: 24),
            GestureDetector(
              onTap: () => context.go('/home'),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppColors.cyan, AppColors.magenta],
                  ),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Text(
                  'Browse Offers',
                  style: AppTypography.button.copyWith(color: Colors.white),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  String _getEmptyMessage(CollabTab tab) {
    switch (tab) {
      case CollabTab.invitations:
        return 'No pending invitations from businesses';
      case CollabTab.applied:
        return 'No applications waiting for response';
      case CollabTab.active:
        return 'No active collaborations right now';
      case CollabTab.inReview:
        return 'No content waiting for review';
      case CollabTab.completed:
        return 'Complete your first collaboration!';
      case CollabTab.declined:
        return 'No declined collaborations';
    }
  }

  void _handleAcceptInvitation(BuildContext context, Collaboration collab) async {
    final collabsService = context.read<CollabsService>();
    final success = await collabsService.acceptInvitation(collab.id);
    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Invitation accepted! Schedule your visit.'),
          backgroundColor: const Color(0xFF4ADE80),
        ),
      );
      collabsService.setSelectedTab(CollabTab.active);
    }
  }

  void _showDeclineDialog(BuildContext context, Collaboration collab) {
    String? selectedReason;
    final reasons = [
      'Not interested in this category',
      'Schedule conflict',
      'Location too far',
      'Compensation doesn\'t match expectations',
      'Other',
    ];

    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Decline Invitation', style: AppTypography.h4),
              const SizedBox(height: 8),
              Text(
                'Please tell us why you\'re declining',
                style: AppTypography.body.copyWith(color: AppColors.textSecondary),
              ),
              const SizedBox(height: 20),
              ...reasons.map((reason) => GestureDetector(
                onTap: () => setModalState(() => selectedReason = reason),
                child: Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: selectedReason == reason
                        ? Colors.red.shade400.withValues(alpha: 0.1)
                        : AppColors.surfaceLight,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: selectedReason == reason
                          ? Colors.red.shade400
                          : AppColors.surfaceLight,
                    ),
                  ),
                  child: Text(
                    reason,
                    style: AppTypography.body.copyWith(
                      color: selectedReason == reason
                          ? Colors.red.shade400
                          : AppColors.textPrimary,
                    ),
                  ),
                ),
              )),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceLight,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        alignment: Alignment.center,
                        child: Text('Cancel', style: AppTypography.button),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: GestureDetector(
                      onTap: selectedReason != null
                          ? () async {
                              Navigator.pop(context);
                              final collabsService = context.read<CollabsService>();
                              await collabsService.declineInvitation(collab.id, selectedReason!);
                              if (mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: const Text('Invitation declined'),
                                    backgroundColor: Colors.red.shade400,
                                  ),
                                );
                              }
                            }
                          : null,
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          color: selectedReason != null
                              ? Colors.red.shade400
                              : Colors.red.shade400.withValues(alpha: 0.3),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          'Decline',
                          style: AppTypography.button.copyWith(color: Colors.white),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: MediaQuery.of(context).padding.bottom),
            ],
          ),
        ),
      ),
    );
  }

  void _showScheduleDialog(BuildContext context, Collaboration collab) {
    DateTime selectedDate = DateTime.now().add(const Duration(days: 1));

    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Schedule Visit', style: AppTypography.h4),
              const SizedBox(height: 8),
              Text(
                'Choose a date for your visit to ${collab.businessName}',
                style: AppTypography.body.copyWith(color: AppColors.textSecondary),
              ),
              const SizedBox(height: 20),
              GestureDetector(
                onTap: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate: selectedDate,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 60)),
                    builder: (context, child) => Theme(
                      data: ThemeData.dark().copyWith(
                        colorScheme: const ColorScheme.dark(
                          primary: AppColors.cyan,
                          surface: AppColors.surface,
                        ),
                      ),
                      child: child!,
                    ),
                  );
                  if (date != null) {
                    setModalState(() => selectedDate = date);
                  }
                },
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceLight,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.cyan),
                  ),
                  child: Row(
                    children: [
                      const Icon(LucideIcons.calendar, color: AppColors.cyan),
                      const SizedBox(width: 12),
                      Text(
                        '${selectedDate.day}/${selectedDate.month}/${selectedDate.year}',
                        style: AppTypography.body,
                      ),
                      const Spacer(),
                      const Icon(LucideIcons.chevronDown, color: AppColors.textMuted, size: 20),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceLight,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        alignment: Alignment.center,
                        child: Text('Cancel', style: AppTypography.button),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: GestureDetector(
                      onTap: () async {
                        Navigator.pop(context);
                        final dateStr = '${selectedDate.year}-${selectedDate.month.toString().padLeft(2, '0')}-${selectedDate.day.toString().padLeft(2, '0')}';
                        final collabsService = context.read<CollabsService>();
                        await collabsService.scheduleVisit(collab.id, dateStr);
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Visit scheduled for ${selectedDate.day}/${selectedDate.month}'),
                              backgroundColor: const Color(0xFF60A5FA),
                            ),
                          );
                        }
                      },
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
                          'Confirm',
                          style: AppTypography.button.copyWith(color: Colors.white),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: MediaQuery.of(context).padding.bottom),
            ],
          ),
        ),
      ),
    );
  }

  void _handleMarkVisited(BuildContext context, Collaboration collab) async {
    final collabsService = context.read<CollabsService>();
    final success = await collabsService.markAsVisited(collab.id);
    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Visit confirmed! Now create your content.'),
          backgroundColor: Color(0xFF60A5FA),
        ),
      );
    }
  }

  void _handleSubmitContent(BuildContext context, Collaboration collab) async {
    final collabsService = context.read<CollabsService>();
    final success = await collabsService.submitContent(collab.id);
    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Content submitted for review!'),
          backgroundColor: Color(0xFFFB923C),
        ),
      );
      collabsService.setSelectedTab(CollabTab.inReview);
    }
  }
}

class _TabInfo {
  final CollabTab tab;
  final String label;
  final IconData icon;
  final Color color;

  const _TabInfo(this.tab, this.label, this.icon, this.color);
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;

  const _StatItem({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 14, color: color),
              const SizedBox(width: 4),
              Text(value, style: AppTypography.h4.copyWith(color: color)),
            ],
          ),
          const SizedBox(height: 4),
          Text(label, style: AppTypography.caption.copyWith(fontSize: 10)),
        ],
      ),
    );
  }
}

class _CollabCard extends StatelessWidget {
  final Collaboration collab;
  final VoidCallback? onAccept;
  final VoidCallback? onDecline;
  final VoidCallback? onSchedule;
  final VoidCallback? onMarkVisited;
  final VoidCallback? onSubmitContent;

  const _CollabCard({
    required this.collab,
    this.onAccept,
    this.onDecline,
    this.onSchedule,
    this.onMarkVisited,
    this.onSubmitContent,
  });

  Color get _statusColor {
    switch (collab.status) {
      case CollabStatus.invited:
        return AppColors.magenta;
      case CollabStatus.applied:
        return const Color(0xFFFACC15);
      case CollabStatus.accepted:
      case CollabStatus.scheduled:
      case CollabStatus.visited:
        return const Color(0xFF60A5FA);
      case CollabStatus.inReview:
        return const Color(0xFFFB923C);
      case CollabStatus.completed:
        return const Color(0xFF4ADE80);
      case CollabStatus.declined:
        return Colors.red.shade400;
    }
  }

  String get _statusLabel {
    switch (collab.status) {
      case CollabStatus.invited:
        return 'Invited';
      case CollabStatus.applied:
        return 'Applied';
      case CollabStatus.accepted:
        return 'Accepted';
      case CollabStatus.scheduled:
        return 'Scheduled';
      case CollabStatus.visited:
        return 'Visited';
      case CollabStatus.inReview:
        return 'In Review';
      case CollabStatus.completed:
        return 'Completed';
      case CollabStatus.declined:
        return 'Declined';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image and status
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                child: Container(
                  height: 120,
                  width: double.infinity,
                  color: AppColors.surfaceLight,
                  child: Image.network(
                    collab.imageUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => const Center(
                      child: Icon(LucideIcons.image, color: AppColors.textMuted),
                    ),
                  ),
                ),
              ),
              Positioned(
                top: 12,
                right: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: _statusColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _statusLabel,
                    style: AppTypography.labelSmall.copyWith(
                      color: collab.status == CollabStatus.applied
                          ? AppColors.background
                          : Colors.white,
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
                Text(
                  collab.businessName,
                  style: AppTypography.caption.copyWith(color: AppColors.cyan),
                ),
                const SizedBox(height: 4),
                Text(collab.title, style: AppTypography.label),
                const SizedBox(height: 12),
                // What you get
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.cyan.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      const Icon(LucideIcons.gift, size: 14, color: AppColors.cyan),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          collab.whatYouGet,
                          style: AppTypography.caption.copyWith(color: AppColors.cyan),
                        ),
                      ),
                    ],
                  ),
                ),
                if (collab.nextAction != null) ...[
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(LucideIcons.clock, size: 14, color: _statusColor),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          collab.nextAction!,
                          style: AppTypography.caption.copyWith(color: _statusColor),
                        ),
                      ),
                    ],
                  ),
                ],
                // Action buttons
                if (onAccept != null || onDecline != null) ...[
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      if (onDecline != null)
                        Expanded(
                          child: GestureDetector(
                            onTap: onDecline,
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                color: Colors.red.shade400.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.red.shade400),
                              ),
                              alignment: Alignment.center,
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(LucideIcons.x, size: 16, color: Colors.red.shade400),
                                  const SizedBox(width: 6),
                                  Text(
                                    'Decline',
                                    style: AppTypography.labelSmall.copyWith(color: Colors.red.shade400),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      if (onAccept != null && onDecline != null)
                        const SizedBox(width: 12),
                      if (onAccept != null)
                        Expanded(
                          child: GestureDetector(
                            onTap: onAccept,
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [AppColors.cyan, AppColors.magenta],
                                ),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              alignment: Alignment.center,
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(LucideIcons.check, size: 16, color: Colors.white),
                                  const SizedBox(width: 6),
                                  Text(
                                    'Accept',
                                    style: AppTypography.labelSmall.copyWith(color: Colors.white),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
                // Schedule button for accepted collabs
                if (onSchedule != null) ...[
                  const SizedBox(height: 16),
                  GestureDetector(
                    onTap: onSchedule,
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [AppColors.cyan, AppColors.magenta],
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      alignment: Alignment.center,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(LucideIcons.calendar, size: 16, color: Colors.white),
                          const SizedBox(width: 8),
                          Text(
                            'Schedule Visit',
                            style: AppTypography.labelSmall.copyWith(color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
                // Mark visited button
                if (onMarkVisited != null) ...[
                  const SizedBox(height: 16),
                  GestureDetector(
                    onTap: onMarkVisited,
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF60A5FA),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      alignment: Alignment.center,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(LucideIcons.checkCircle, size: 16, color: Colors.white),
                          const SizedBox(width: 8),
                          Text(
                            'I\'ve Visited',
                            style: AppTypography.labelSmall.copyWith(color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
                // Submit content button
                if (onSubmitContent != null) ...[
                  const SizedBox(height: 16),
                  GestureDetector(
                    onTap: onSubmitContent,
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [AppColors.cyan, AppColors.magenta],
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      alignment: Alignment.center,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(LucideIcons.upload, size: 16, color: Colors.white),
                          const SizedBox(width: 8),
                          Text(
                            'Submit Content',
                            style: AppTypography.labelSmall.copyWith(color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
