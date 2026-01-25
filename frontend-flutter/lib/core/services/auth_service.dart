import 'package:flutter/foundation.dart';
import '../models/models.dart';

enum AuthStatus {
  initial,
  loading,
  authenticated,
  unauthenticated,
  error,
}

enum OAuthStatus {
  idle,
  connecting,
  success,
  error,
}

class AuthService extends ChangeNotifier {
  AuthStatus _status = AuthStatus.initial;
  OAuthStatus _oauthStatus = OAuthStatus.idle;
  UserProfile? _user;
  String? _errorMessage;
  SocialPlatform? _connectingPlatform;

  AuthStatus get status => _status;
  OAuthStatus get oauthStatus => _oauthStatus;
  UserProfile? get user => _user;
  String? get errorMessage => _errorMessage;
  SocialPlatform? get connectingPlatform => _connectingPlatform;
  bool get isAuthenticated => _status == AuthStatus.authenticated;
  bool get isVip => _user?.isVip ?? false;

  // Initialize with mock user for testing
  AuthService() {
    _initializeAuth();
  }

  Future<void> _initializeAuth() async {
    _status = AuthStatus.loading;
    notifyListeners();

    // Simulate loading delay
    await Future.delayed(const Duration(milliseconds: 500));

    // For now, start unauthenticated (onboarding flow)
    _status = AuthStatus.unauthenticated;
    notifyListeners();
  }

  // Login with email/password (mock)
  Future<bool> login(String email, String password) async {
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();

    await Future.delayed(const Duration(seconds: 1));

    // Mock validation
    if (email.isNotEmpty && password.length >= 6) {
      _user = mockUserProfile;
      _status = AuthStatus.authenticated;
      notifyListeners();
      return true;
    } else {
      _errorMessage = 'Invalid email or password';
      _status = AuthStatus.error;
      notifyListeners();
      return false;
    }
  }

  // Social login (Instagram, TikTok, etc.)
  Future<bool> loginWithSocial(SocialPlatform platform) async {
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();

    await Future.delayed(const Duration(seconds: 2));

    // Mock social login success
    _user = mockUserProfile;
    _status = AuthStatus.authenticated;
    notifyListeners();
    return true;
  }

  // Connect social account (OAuth flow)
  Future<bool> connectSocialAccount(SocialPlatform platform) async {
    _oauthStatus = OAuthStatus.connecting;
    _connectingPlatform = platform;
    _errorMessage = null;
    notifyListeners();

    // Simulate OAuth redirect and callback
    await Future.delayed(const Duration(seconds: 2));

    // Mock successful connection
    if (_user != null) {
      final updatedAccounts = _user!.socialAccounts.map((account) {
        if (account.platform == platform) {
          return SocialAccount(
            platform: platform,
            username: _getMockUsername(platform),
            followers: _getMockFollowers(platform),
            engagementRate: _getMockEngagement(platform),
            verified: false,
            connected: true,
            profileUrl: _getMockProfileUrl(platform),
            connectedAt: DateTime.now(),
            lastSyncedAt: DateTime.now(),
          );
        }
        return account;
      }).toList();

      // If platform wasn't in the list, add it
      if (!updatedAccounts.any((a) => a.platform == platform)) {
        updatedAccounts.add(SocialAccount(
          platform: platform,
          username: _getMockUsername(platform),
          followers: _getMockFollowers(platform),
          engagementRate: _getMockEngagement(platform),
          verified: false,
          connected: true,
          profileUrl: _getMockProfileUrl(platform),
          connectedAt: DateTime.now(),
          lastSyncedAt: DateTime.now(),
        ));
      }

      _user = _user!.copyWith(socialAccounts: updatedAccounts);
    }

    _oauthStatus = OAuthStatus.success;
    _connectingPlatform = null;
    notifyListeners();

    // Reset after a short delay
    await Future.delayed(const Duration(milliseconds: 500));
    _oauthStatus = OAuthStatus.idle;
    notifyListeners();

    return true;
  }

  // Disconnect social account
  Future<void> disconnectSocialAccount(SocialPlatform platform) async {
    if (_user == null) return;

    final updatedAccounts = _user!.socialAccounts.map((account) {
      if (account.platform == platform) {
        return SocialAccount(
          platform: platform,
          connected: false,
        );
      }
      return account;
    }).toList();

    _user = _user!.copyWith(socialAccounts: updatedAccounts);
    notifyListeners();
  }

  // Complete onboarding and set user as authenticated
  Future<void> completeOnboarding({
    required String name,
    required String email,
    required List<String> categories,
    required String location,
  }) async {
    _status = AuthStatus.loading;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 500));

    _user = UserProfile(
      id: 'new_user_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      username: '@${name.toLowerCase().replaceAll(' ', '')}',
      email: email,
      location: location,
      categories: categories,
      photos: [],
      socialAccounts: [
        const SocialAccount(platform: SocialPlatform.instagram, connected: false),
        const SocialAccount(platform: SocialPlatform.tiktok, connected: false),
        const SocialAccount(platform: SocialPlatform.youtube, connected: false),
      ],
      createdAt: DateTime.now(),
    );

    _status = AuthStatus.authenticated;
    notifyListeners();
  }

  // Update user profile
  Future<void> updateProfile({
    String? name,
    String? bio,
    String? location,
    List<String>? categories,
    List<String>? photos,
  }) async {
    if (_user == null) return;

    _user = _user!.copyWith(
      name: name ?? _user!.name,
      bio: bio ?? _user!.bio,
      location: location ?? _user!.location,
      categories: categories ?? _user!.categories,
      photos: photos ?? _user!.photos,
    );
    notifyListeners();
  }

  // Logout
  Future<void> logout() async {
    _status = AuthStatus.loading;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 300));

    _user = null;
    _status = AuthStatus.unauthenticated;
    notifyListeners();
  }

  // Skip auth for testing (go directly to home)
  void skipToHome() {
    _user = mockUserProfile;
    _status = AuthStatus.authenticated;
    notifyListeners();
  }

  // Helper methods for mock data
  String _getMockUsername(SocialPlatform platform) {
    switch (platform) {
      case SocialPlatform.instagram:
        return 'sofiacreates';
      case SocialPlatform.tiktok:
        return 'sofiacreates';
      case SocialPlatform.youtube:
        return 'Sofia Creates';
    }
  }

  int _getMockFollowers(SocialPlatform platform) {
    switch (platform) {
      case SocialPlatform.instagram:
        return 15200;
      case SocialPlatform.tiktok:
        return 8500;
      case SocialPlatform.youtube:
        return 3200;
    }
  }

  double _getMockEngagement(SocialPlatform platform) {
    switch (platform) {
      case SocialPlatform.instagram:
        return 4.2;
      case SocialPlatform.tiktok:
        return 6.8;
      case SocialPlatform.youtube:
        return 3.5;
    }
  }

  String _getMockProfileUrl(SocialPlatform platform) {
    switch (platform) {
      case SocialPlatform.instagram:
        return 'https://instagram.com/sofiacreates';
      case SocialPlatform.tiktok:
        return 'https://tiktok.com/@sofiacreates';
      case SocialPlatform.youtube:
        return 'https://youtube.com/@sofiacreates';
    }
  }
}
