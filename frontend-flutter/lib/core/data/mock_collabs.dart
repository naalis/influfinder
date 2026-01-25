enum CollabStatus {
  invited,
  applied,
  accepted,
  scheduled,
  visited,
  inReview,
  completed,
  declined,
}

enum CollabTab {
  invitations,
  applied,
  active,
  inReview,
  completed,
  declined,
}

class Collaboration {
  final String id;
  final String offerId;
  final String businessName;
  final String businessLogo;
  final String title;
  final CollabStatus status;
  final String appliedDate;
  final String whatYouGet;
  final String contentRequired;
  final String? scheduledDate;
  final String? visitedDate;
  final String? submittedDate;
  final String? completedDate;
  final String? declinedDate;
  final String? declineReason;
  final String? deadline;
  final String imageUrl;
  final String? nextAction;

  const Collaboration({
    required this.id,
    required this.offerId,
    required this.businessName,
    required this.businessLogo,
    required this.title,
    required this.status,
    required this.appliedDate,
    required this.whatYouGet,
    required this.contentRequired,
    this.scheduledDate,
    this.visitedDate,
    this.submittedDate,
    this.completedDate,
    this.declinedDate,
    this.declineReason,
    this.deadline,
    required this.imageUrl,
    this.nextAction,
  });

  CollabTab get tab {
    switch (status) {
      case CollabStatus.invited:
        return CollabTab.invitations;
      case CollabStatus.applied:
        return CollabTab.applied;
      case CollabStatus.accepted:
      case CollabStatus.scheduled:
      case CollabStatus.visited:
        return CollabTab.active;
      case CollabStatus.inReview:
        return CollabTab.inReview;
      case CollabStatus.completed:
        return CollabTab.completed;
      case CollabStatus.declined:
        return CollabTab.declined;
    }
  }
}

final List<Collaboration> mockCollabs = [
  // INVITATIONS
  Collaboration(
    id: 'c1',
    offerId: '5',
    businessName: 'Paradise Beach Resort',
    businessLogo: 'travel',
    title: 'Luxury Weekend Getaway',
    status: CollabStatus.invited,
    appliedDate: '2026-01-22',
    whatYouGet: '2-night stay + all meals + spa',
    contentRequired: '3 Reels + 4 Posts + 10 Stories',
    deadline: '2026-01-28',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
    nextAction: 'Accept or decline by Jan 28',
  ),
  Collaboration(
    id: 'c2',
    offerId: '4',
    businessName: 'Urban Threads Boutique',
    businessLogo: 'fashion',
    title: 'Spring Collection VIP Preview',
    status: CollabStatus.invited,
    appliedDate: '2026-01-20',
    whatYouGet: '5 outfits + professional photoshoot',
    contentRequired: '2 Reels + 3 Posts + 8 Stories',
    deadline: '2026-01-25',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
    nextAction: 'Accept or decline by Jan 25',
  ),

  // APPLIED
  Collaboration(
    id: 'c3',
    offerId: '2',
    businessName: 'FitZone Gym',
    businessLogo: 'fitness',
    title: '3-Month Premium Membership',
    status: CollabStatus.applied,
    appliedDate: '2026-01-20',
    whatYouGet: '3-month gym membership + PT session',
    contentRequired: '2 Reels + 4 Stories',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
    nextAction: 'Waiting for business approval',
  ),
  Collaboration(
    id: 'c4',
    offerId: '3',
    businessName: 'Sunset Spa & Wellness',
    businessLogo: 'wellness',
    title: 'Luxury Spa Day Package',
    status: CollabStatus.applied,
    appliedDate: '2026-01-18',
    whatYouGet: 'Full spa day (massage + facial + lunch)',
    contentRequired: '1 Reel + 5 Stories + 1 Post',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80',
    nextAction: 'Under review by business',
  ),

  // ACTIVE (Accepted)
  Collaboration(
    id: 'c5',
    offerId: '6',
    businessName: 'Glow Beauty Bar',
    businessLogo: 'beauty',
    title: 'Complete Makeover Experience',
    status: CollabStatus.accepted,
    appliedDate: '2026-01-10',
    whatYouGet: 'Makeover + skincare products',
    contentRequired: '1 Reel + 4 Stories + 1 Review',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
    nextAction: 'Schedule your visit',
  ),

  // ACTIVE (Scheduled)
  Collaboration(
    id: 'c6',
    offerId: '1',
    businessName: 'Bella Vita Restaurant',
    businessLogo: 'dining',
    title: 'Italian Dining Experience',
    status: CollabStatus.scheduled,
    appliedDate: '2026-01-15',
    scheduledDate: '2026-01-28',
    whatYouGet: 'Free dinner for 2 (tasting menu)',
    contentRequired: '3 Stories + 1 Post',
    deadline: '2026-02-15',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
    nextAction: 'Visit scheduled for Jan 28',
  ),

  // ACTIVE (Visited)
  Collaboration(
    id: 'c7',
    offerId: '7',
    businessName: 'TechHub Store',
    businessLogo: 'tech',
    title: 'Latest Gadgets Review',
    status: CollabStatus.visited,
    appliedDate: '2026-01-10',
    scheduledDate: '2026-01-20',
    visitedDate: '2026-01-20',
    whatYouGet: '2 tech gadgets to keep',
    contentRequired: '1 Video + 2 Reels + 1 Review',
    deadline: '2026-02-05',
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=80',
    nextAction: 'Create and upload your content',
  ),

  // IN REVIEW
  Collaboration(
    id: 'c8',
    offerId: '8',
    businessName: 'Home Haven Decor',
    businessLogo: 'home',
    title: 'Room Makeover Collaboration',
    status: CollabStatus.inReview,
    appliedDate: '2025-12-15',
    scheduledDate: '2026-01-05',
    visitedDate: '2026-01-05',
    submittedDate: '2026-01-15',
    whatYouGet: 'Furniture & decor for one room',
    contentRequired: '2 Reels + 3 Posts + 8 Stories',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80',
    nextAction: 'Content under verification',
  ),

  // COMPLETED
  Collaboration(
    id: 'c9',
    offerId: '9',
    businessName: 'Café Deluxe',
    businessLogo: 'dining',
    title: 'Brunch Experience',
    status: CollabStatus.completed,
    appliedDate: '2025-11-20',
    scheduledDate: '2025-12-01',
    visitedDate: '2025-12-01',
    submittedDate: '2025-12-10',
    completedDate: '2025-12-15',
    whatYouGet: 'Brunch for 4 people',
    contentRequired: '2 Stories + 1 Post',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
  ),
  Collaboration(
    id: 'c10',
    offerId: '10',
    businessName: 'Yoga Studio Zen',
    businessLogo: 'wellness',
    title: 'Monthly Unlimited Pass',
    status: CollabStatus.completed,
    appliedDate: '2025-10-15',
    scheduledDate: '2025-11-01',
    visitedDate: '2025-11-01',
    submittedDate: '2025-11-20',
    completedDate: '2025-11-25',
    whatYouGet: '1-month unlimited yoga classes',
    contentRequired: '1 Reel + 3 Stories',
    imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&q=80',
  ),

  // DECLINED
  Collaboration(
    id: 'c11',
    offerId: '11',
    businessName: 'Elite Watches',
    businessLogo: 'fashion',
    title: 'Luxury Watch Feature',
    status: CollabStatus.declined,
    appliedDate: '2026-01-05',
    declinedDate: '2026-01-10',
    declineReason: 'Looking for accounts with 50K+ followers',
    whatYouGet: 'Watch loan for 1 week',
    contentRequired: '2 Reels + 2 Posts',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  ),
];
