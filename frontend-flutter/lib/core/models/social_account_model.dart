enum SocialPlatform {
  instagram,
  tiktok,
  youtube,
}

class SocialAccount {
  final SocialPlatform platform;
  final String? username;
  final int? followers;
  final double? engagementRate;
  final bool verified;
  final bool connected;
  final String? profileUrl;
  final String? accessToken;
  final DateTime? connectedAt;
  final DateTime? lastSyncedAt;

  const SocialAccount({
    required this.platform,
    this.username,
    this.followers,
    this.engagementRate,
    this.verified = false,
    this.connected = false,
    this.profileUrl,
    this.accessToken,
    this.connectedAt,
    this.lastSyncedAt,
  });

  String get platformName {
    switch (platform) {
      case SocialPlatform.instagram:
        return 'Instagram';
      case SocialPlatform.tiktok:
        return 'TikTok';
      case SocialPlatform.youtube:
        return 'YouTube';
    }
  }

  String get formattedFollowers {
    if (followers == null) return '0';
    if (followers! >= 1000000) {
      return '${(followers! / 1000000).toStringAsFixed(1)}M';
    } else if (followers! >= 1000) {
      return '${(followers! / 1000).toStringAsFixed(1)}K';
    }
    return followers.toString();
  }

  String get formattedEngagement {
    if (engagementRate == null) return '0%';
    return '${engagementRate!.toStringAsFixed(1)}%';
  }

  SocialAccount copyWith({
    SocialPlatform? platform,
    String? username,
    int? followers,
    double? engagementRate,
    bool? verified,
    bool? connected,
    String? profileUrl,
    String? accessToken,
    DateTime? connectedAt,
    DateTime? lastSyncedAt,
  }) {
    return SocialAccount(
      platform: platform ?? this.platform,
      username: username ?? this.username,
      followers: followers ?? this.followers,
      engagementRate: engagementRate ?? this.engagementRate,
      verified: verified ?? this.verified,
      connected: connected ?? this.connected,
      profileUrl: profileUrl ?? this.profileUrl,
      accessToken: accessToken ?? this.accessToken,
      connectedAt: connectedAt ?? this.connectedAt,
      lastSyncedAt: lastSyncedAt ?? this.lastSyncedAt,
    );
  }
}
