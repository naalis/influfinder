import 'package:flutter/foundation.dart';
import '../data/mock_offers.dart';

class OffersService extends ChangeNotifier {
  List<Offer> _offers = [];
  List<String> _savedOfferIds = [];
  bool _isLoading = false;
  String? _errorMessage;
  String _selectedCategory = 'all';
  String _searchQuery = '';

  List<Offer> get offers => _offers;
  List<Offer> get filteredOffers => _getFilteredOffers();
  List<String> get savedOfferIds => _savedOfferIds;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  String get selectedCategory => _selectedCategory;
  String get searchQuery => _searchQuery;

  OffersService() {
    _loadOffers();
  }

  Future<void> _loadOffers() async {
    _isLoading = true;
    notifyListeners();

    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 500));

    _offers = List.from(mockOffers);
    _isLoading = false;
    notifyListeners();
  }

  Future<void> refreshOffers() async {
    await _loadOffers();
  }

  List<Offer> _getFilteredOffers() {
    return _offers.where((offer) {
      // Category filter
      if (_selectedCategory != 'all') {
        final categoryLower = offer.category.toLowerCase();
        if (!categoryLower.contains(_selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // Search filter
      if (_searchQuery.isNotEmpty) {
        final searchLower = _searchQuery.toLowerCase();
        final titleMatch = offer.title.toLowerCase().contains(searchLower);
        final businessMatch = offer.businessName.toLowerCase().contains(searchLower);
        final descMatch = offer.description.toLowerCase().contains(searchLower);
        if (!titleMatch && !businessMatch && !descMatch) {
          return false;
        }
      }

      return true;
    }).toList();
  }

  void setCategory(String category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void clearFilters() {
    _selectedCategory = 'all';
    _searchQuery = '';
    notifyListeners();
  }

  Offer? getOfferById(String id) {
    try {
      return _offers.firstWhere((o) => o.id == id);
    } catch (e) {
      return null;
    }
  }

  bool isOfferSaved(String offerId) {
    return _savedOfferIds.contains(offerId);
  }

  void toggleSaveOffer(String offerId) {
    if (_savedOfferIds.contains(offerId)) {
      _savedOfferIds.remove(offerId);
    } else {
      _savedOfferIds.add(offerId);
    }
    notifyListeners();
  }

  List<Offer> get savedOffers {
    return _offers.where((o) => _savedOfferIds.contains(o.id)).toList();
  }

  // Stats
  int get availableCount => filteredOffers.length;

  int get inviteOnlyCount => filteredOffers
      .where((o) => o.offerType == 'invitation')
      .length;

  int get interestedCount => _savedOfferIds.length;

  // Apply to offer
  Future<bool> applyToOffer(String offerId) async {
    _isLoading = true;
    notifyListeners();

    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));

    _isLoading = false;
    notifyListeners();
    return true;
  }
}
