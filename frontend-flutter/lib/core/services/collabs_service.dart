import 'package:flutter/foundation.dart';
import '../data/mock_collabs.dart';

class CollabsService extends ChangeNotifier {
  List<Collaboration> _collabs = [];
  bool _isLoading = false;
  String? _errorMessage;
  CollabTab _selectedTab = CollabTab.active;
  bool _isVipUser = true; // Will be set from auth service

  List<Collaboration> get collabs => _collabs;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  CollabTab get selectedTab => _selectedTab;
  bool get isVipUser => _isVipUser;

  CollabsService() {
    _loadCollabs();
  }

  Future<void> _loadCollabs() async {
    _isLoading = true;
    notifyListeners();

    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 500));

    _collabs = List.from(mockCollabs);
    _isLoading = false;
    notifyListeners();
  }

  Future<void> refreshCollabs() async {
    await _loadCollabs();
  }

  void setSelectedTab(CollabTab tab) {
    _selectedTab = tab;
    notifyListeners();
  }

  void setVipStatus(bool isVip) {
    _isVipUser = isVip;
    notifyListeners();
  }

  // Get collabs by tab
  List<Collaboration> getCollabsByTab(CollabTab tab) {
    return _collabs.where((c) => c.tab == tab).toList();
  }

  List<Collaboration> get currentTabCollabs {
    return getCollabsByTab(_selectedTab);
  }

  // Get available tabs based on VIP status
  List<CollabTab> get availableTabs {
    if (_isVipUser) {
      return [
        CollabTab.invitations,
        CollabTab.applied,
        CollabTab.active,
        CollabTab.inReview,
        CollabTab.completed,
      ];
    } else {
      return [
        CollabTab.applied,
        CollabTab.active,
        CollabTab.inReview,
        CollabTab.completed,
      ];
    }
  }

  // Tab counts
  Map<CollabTab, int> get tabCounts {
    return {
      CollabTab.invitations: getCollabsByTab(CollabTab.invitations).length,
      CollabTab.applied: getCollabsByTab(CollabTab.applied).length,
      CollabTab.active: getCollabsByTab(CollabTab.active).length,
      CollabTab.inReview: getCollabsByTab(CollabTab.inReview).length,
      CollabTab.completed: getCollabsByTab(CollabTab.completed).length,
      CollabTab.declined: getCollabsByTab(CollabTab.declined).length,
    };
  }

  // Declined collabs (separate section)
  List<Collaboration> get declinedCollabs {
    return getCollabsByTab(CollabTab.declined);
  }

  // Get single collab by ID
  Collaboration? getCollabById(String id) {
    try {
      return _collabs.firstWhere((c) => c.id == id);
    } catch (e) {
      return null;
    }
  }

  // Accept invitation
  Future<bool> acceptInvitation(String collabId) async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(seconds: 1));

    final index = _collabs.indexWhere((c) => c.id == collabId);
    if (index != -1) {
      // Update status to accepted
      _collabs[index] = Collaboration(
        id: _collabs[index].id,
        offerId: _collabs[index].offerId,
        businessName: _collabs[index].businessName,
        businessLogo: _collabs[index].businessLogo,
        title: _collabs[index].title,
        status: CollabStatus.accepted,
        appliedDate: _collabs[index].appliedDate,
        whatYouGet: _collabs[index].whatYouGet,
        contentRequired: _collabs[index].contentRequired,
        deadline: _collabs[index].deadline,
        imageUrl: _collabs[index].imageUrl,
        nextAction: 'Schedule your visit',
      );
    }

    _isLoading = false;
    notifyListeners();
    return true;
  }

  // Decline invitation
  Future<bool> declineInvitation(String collabId, String reason) async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(seconds: 1));

    final index = _collabs.indexWhere((c) => c.id == collabId);
    if (index != -1) {
      _collabs[index] = Collaboration(
        id: _collabs[index].id,
        offerId: _collabs[index].offerId,
        businessName: _collabs[index].businessName,
        businessLogo: _collabs[index].businessLogo,
        title: _collabs[index].title,
        status: CollabStatus.declined,
        appliedDate: _collabs[index].appliedDate,
        whatYouGet: _collabs[index].whatYouGet,
        contentRequired: _collabs[index].contentRequired,
        declinedDate: DateTime.now().toIso8601String().split('T')[0],
        declineReason: reason,
        imageUrl: _collabs[index].imageUrl,
      );
    }

    _isLoading = false;
    notifyListeners();
    return true;
  }

  // Schedule visit
  Future<bool> scheduleVisit(String collabId, String date) async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(seconds: 1));

    final index = _collabs.indexWhere((c) => c.id == collabId);
    if (index != -1) {
      _collabs[index] = Collaboration(
        id: _collabs[index].id,
        offerId: _collabs[index].offerId,
        businessName: _collabs[index].businessName,
        businessLogo: _collabs[index].businessLogo,
        title: _collabs[index].title,
        status: CollabStatus.scheduled,
        appliedDate: _collabs[index].appliedDate,
        scheduledDate: date,
        whatYouGet: _collabs[index].whatYouGet,
        contentRequired: _collabs[index].contentRequired,
        deadline: _collabs[index].deadline,
        imageUrl: _collabs[index].imageUrl,
        nextAction: 'Visit scheduled for $date',
      );
    }

    _isLoading = false;
    notifyListeners();
    return true;
  }

  // Mark as visited
  Future<bool> markAsVisited(String collabId) async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(seconds: 1));

    final index = _collabs.indexWhere((c) => c.id == collabId);
    if (index != -1) {
      final today = DateTime.now().toIso8601String().split('T')[0];
      _collabs[index] = Collaboration(
        id: _collabs[index].id,
        offerId: _collabs[index].offerId,
        businessName: _collabs[index].businessName,
        businessLogo: _collabs[index].businessLogo,
        title: _collabs[index].title,
        status: CollabStatus.visited,
        appliedDate: _collabs[index].appliedDate,
        scheduledDate: _collabs[index].scheduledDate,
        visitedDate: today,
        whatYouGet: _collabs[index].whatYouGet,
        contentRequired: _collabs[index].contentRequired,
        deadline: _collabs[index].deadline,
        imageUrl: _collabs[index].imageUrl,
        nextAction: 'Create and upload your content',
      );
    }

    _isLoading = false;
    notifyListeners();
    return true;
  }

  // Submit content
  Future<bool> submitContent(String collabId) async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(seconds: 1));

    final index = _collabs.indexWhere((c) => c.id == collabId);
    if (index != -1) {
      final today = DateTime.now().toIso8601String().split('T')[0];
      _collabs[index] = Collaboration(
        id: _collabs[index].id,
        offerId: _collabs[index].offerId,
        businessName: _collabs[index].businessName,
        businessLogo: _collabs[index].businessLogo,
        title: _collabs[index].title,
        status: CollabStatus.inReview,
        appliedDate: _collabs[index].appliedDate,
        scheduledDate: _collabs[index].scheduledDate,
        visitedDate: _collabs[index].visitedDate,
        submittedDate: today,
        whatYouGet: _collabs[index].whatYouGet,
        contentRequired: _collabs[index].contentRequired,
        imageUrl: _collabs[index].imageUrl,
        nextAction: 'Content under verification',
      );
    }

    _isLoading = false;
    notifyListeners();
    return true;
  }

  // Stats
  int get totalActiveCollabs {
    return _collabs.where((c) =>
        c.status != CollabStatus.declined &&
        c.status != CollabStatus.completed).length;
  }

  int get totalCompletedCollabs {
    return _collabs.where((c) => c.status == CollabStatus.completed).length;
  }
}
