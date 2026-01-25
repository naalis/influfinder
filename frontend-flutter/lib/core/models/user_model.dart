import 'social_account_model.dart';

enum UserType {
  vipInfluencer,
  regularInfluencer,
  normalUser,
}

class UserProfile {
  final String id;
  final String name;
  final String username;
  final String email;
  final String? location;
  final String? bio;
  final int collabs;
  final int karma;
  final int reach;
  final double rating;
  final List<String> photos;
  final List<SocialAccount> socialAccounts;
  final List<String> categories;
  final UserType userType;
  final DateTime createdAt;

  const UserProfile({
    required this.id,
    required this.name,
    required this.username,
    required this.email,
    this.location,
    this.bio,
    this.collabs = 0,
    this.karma = 0,
    this.reach = 0,
    this.rating = 0.0,
    this.photos = const [],
    this.socialAccounts = const [],
    this.categories = const [],
    this.userType = UserType.normalUser,
    required this.createdAt,
  });

  bool get isVip => userType == UserType.vipInfluencer;

  UserProfile copyWith({
    String? id,
    String? name,
    String? username,
    String? email,
    String? location,
    String? bio,
    int? collabs,
    int? karma,
    int? reach,
    double? rating,
    List<String>? photos,
    List<SocialAccount>? socialAccounts,
    List<String>? categories,
    UserType? userType,
    DateTime? createdAt,
  }) {
    return UserProfile(
      id: id ?? this.id,
      name: name ?? this.name,
      username: username ?? this.username,
      email: email ?? this.email,
      location: location ?? this.location,
      bio: bio ?? this.bio,
      collabs: collabs ?? this.collabs,
      karma: karma ?? this.karma,
      reach: reach ?? this.reach,
      rating: rating ?? this.rating,
      photos: photos ?? this.photos,
      socialAccounts: socialAccounts ?? this.socialAccounts,
      categories: categories ?? this.categories,
      userType: userType ?? this.userType,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}

// Mock user data
final mockUserProfile = UserProfile(
  id: 'user_1',
  name: 'Sofia Martinez',
  username: '@sofiacreates',
  email: 'sofia@example.com',
  location: 'Miami, FL',
  bio: 'Content creator | Food & Travel lover | Sharing authentic experiences',
  collabs: 7,
  karma: 850,
  reach: 25400,
  rating: 4.8,
  photos: [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80',
  ],
  socialAccounts: [
    SocialAccount(
      platform: SocialPlatform.instagram,
      username: 'sofiacreates',
      followers: 15200,
      engagementRate: 4.2,
      verified: false,
      connected: true,
      profileUrl: 'https://instagram.com/sofiacreates',
    ),
    SocialAccount(
      platform: SocialPlatform.tiktok,
      username: 'sofiacreates',
      followers: 8500,
      engagementRate: 6.8,
      verified: false,
      connected: true,
      profileUrl: 'https://tiktok.com/@sofiacreates',
    ),
    SocialAccount(
      platform: SocialPlatform.youtube,
      connected: false,
    ),
  ],
  categories: ['food', 'travel', 'lifestyle', 'fashion'],
  userType: UserType.regularInfluencer,
  createdAt: DateTime(2025, 6, 15),
);
