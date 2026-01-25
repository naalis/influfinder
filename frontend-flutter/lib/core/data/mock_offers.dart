class ContentRequirement {
  final String type; // story, post, reel, review, video
  final int quantity;

  const ContentRequirement({required this.type, required this.quantity});
}

class Offer {
  final String id;
  final String businessName;
  final String businessLogo;
  final String title;
  final String description;
  final String category;
  final String whatYouGet;
  final List<ContentRequirement> contentRequired;
  final String contentSummary;
  final String? location;
  final String imageUrl;
  final int minFollowers;
  final int tierRequired;
  final String offerType; // invitation, application, both
  final String status;
  final int applicants;
  final String? deadline;
  final String postedDate;
  final int estimatedValue;
  final bool isNew;

  const Offer({
    required this.id,
    required this.businessName,
    required this.businessLogo,
    required this.title,
    required this.description,
    required this.category,
    required this.whatYouGet,
    required this.contentRequired,
    required this.contentSummary,
    this.location,
    required this.imageUrl,
    required this.minFollowers,
    required this.tierRequired,
    required this.offerType,
    required this.status,
    required this.applicants,
    this.deadline,
    this.postedDate = '2026-01-20',
    this.estimatedValue = 100,
    this.isNew = false,
  });
}

final List<Offer> mockOffers = [
  Offer(
    id: '1',
    businessName: 'Bella Vita Restaurant',
    businessLogo: 'dining',
    title: 'Authentic Italian Dining Experience',
    description: 'Share your experience at our new location. Full tasting menu for 2 people.',
    category: 'Food & Dining',
    whatYouGet: 'Free dinner for 2 (tasting menu)',
    contentRequired: [
      ContentRequirement(type: 'story', quantity: 3),
      ContentRequirement(type: 'post', quantity: 1),
    ],
    contentSummary: '3 Stories + 1 Post',
    location: 'Downtown Miami',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    minFollowers: 2000,
    tierRequired: 1,
    offerType: 'both',
    status: 'active',
    applicants: 12,
    deadline: '2026-02-15',
    postedDate: '2026-01-24',
    estimatedValue: 150,
    isNew: true,
  ),
  Offer(
    id: '2',
    businessName: 'FitZone Gym',
    businessLogo: 'fitness',
    title: '3-Month Premium Membership',
    description: 'Get fit with our state-of-the-art equipment. Share your fitness journey with us.',
    category: 'Fitness',
    whatYouGet: '3-month gym membership + PT session',
    contentRequired: [
      ContentRequirement(type: 'reel', quantity: 2),
      ContentRequirement(type: 'story', quantity: 4),
    ],
    contentSummary: '2 Reels + 4 Stories',
    location: 'Brickell, Miami',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    minFollowers: 5000,
    tierRequired: 2,
    offerType: 'both',
    status: 'active',
    applicants: 24,
    deadline: '2026-02-10',
    postedDate: '2026-01-22',
    estimatedValue: 300,
    isNew: true,
  ),
  Offer(
    id: '3',
    businessName: 'Sunset Spa & Wellness',
    businessLogo: 'wellness',
    title: 'Luxury Spa Day Package',
    description: 'Full day spa experience with massage, facial, and more. Perfect for wellness content.',
    category: 'Wellness',
    whatYouGet: 'Full spa day (massage + facial + lunch)',
    contentRequired: [
      ContentRequirement(type: 'reel', quantity: 1),
      ContentRequirement(type: 'story', quantity: 5),
      ContentRequirement(type: 'post', quantity: 1),
    ],
    contentSummary: '1 Reel + 5 Stories + 1 Post',
    location: 'South Beach',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
    minFollowers: 8000,
    tierRequired: 2,
    offerType: 'both',
    status: 'active',
    applicants: 8,
    deadline: '2026-02-20',
    postedDate: '2026-01-18',
    estimatedValue: 250,
    isNew: false,
  ),
  Offer(
    id: '4',
    businessName: 'Urban Threads Boutique',
    businessLogo: 'fashion',
    title: 'Spring Collection Feature',
    description: 'Style our new spring collection. Choose your favorite outfits to keep.',
    category: 'Fashion',
    whatYouGet: '3 outfits of your choice + photoshoot',
    contentRequired: [
      ContentRequirement(type: 'reel', quantity: 2),
      ContentRequirement(type: 'post', quantity: 3),
      ContentRequirement(type: 'story', quantity: 6),
    ],
    contentSummary: '2 Reels + 3 Posts + 6 Stories',
    location: 'Design District',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    minFollowers: 15000,
    tierRequired: 3,
    offerType: 'invitation',
    status: 'active',
    applicants: 45,
    deadline: '2026-02-08',
    postedDate: '2026-01-15',
    estimatedValue: 500,
    isNew: false,
  ),
  Offer(
    id: '5',
    businessName: 'Paradise Beach Resort',
    businessLogo: 'travel',
    title: 'Weekend Getaway Experience',
    description: '2-night stay at our luxury beachfront resort. All meals included.',
    category: 'Travel',
    whatYouGet: '2-night stay + all meals included',
    contentRequired: [
      ContentRequirement(type: 'reel', quantity: 3),
      ContentRequirement(type: 'post', quantity: 4),
      ContentRequirement(type: 'story', quantity: 10),
    ],
    contentSummary: '3 Reels + 4 Posts + 10 Stories',
    location: 'Key West, FL',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    minFollowers: 25000,
    tierRequired: 3,
    offerType: 'invitation',
    status: 'active',
    applicants: 67,
    deadline: '2026-02-05',
    postedDate: '2026-01-10',
    estimatedValue: 800,
    isNew: false,
  ),
  Offer(
    id: '6',
    businessName: 'Glow Beauty Bar',
    businessLogo: 'beauty',
    title: 'Complete Makeover Experience',
    description: 'Professional makeup session + skincare products to take home.',
    category: 'Beauty',
    whatYouGet: 'Makeover + skincare products',
    contentRequired: [
      ContentRequirement(type: 'reel', quantity: 1),
      ContentRequirement(type: 'story', quantity: 4),
    ],
    contentSummary: '1 Reel + 4 Stories + 1 Review',
    location: 'Coral Gables',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
    minFollowers: 5000,
    tierRequired: 2,
    offerType: 'both',
    status: 'active',
    applicants: 31,
    deadline: '2026-02-12',
    postedDate: '2026-01-23',
    estimatedValue: 200,
    isNew: true,
  ),
  Offer(
    id: '7',
    businessName: 'TechHub Store',
    businessLogo: 'tech',
    title: 'Latest Gadgets Review',
    description: 'Try and review our newest tech products. Keep 2 items of your choice.',
    category: 'Tech',
    whatYouGet: '2 tech gadgets to keep',
    contentRequired: [
      ContentRequirement(type: 'video', quantity: 1),
      ContentRequirement(type: 'reel', quantity: 2),
    ],
    contentSummary: '1 Video + 2 Reels + 1 Review',
    location: 'Online + Pickup',
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
    minFollowers: 12000,
    tierRequired: 2,
    offerType: 'both',
    status: 'active',
    applicants: 52,
    deadline: '2026-02-18',
    postedDate: '2026-01-20',
    estimatedValue: 400,
    isNew: false,
  ),
];

class Category {
  final String id;
  final String label;

  const Category({required this.id, required this.label});
}

final List<Category> categories = [
  Category(id: 'all', label: 'All'),
  Category(id: 'food', label: 'Food'),
  Category(id: 'fitness', label: 'Fitness'),
  Category(id: 'wellness', label: 'Wellness'),
  Category(id: 'fashion', label: 'Fashion'),
  Category(id: 'travel', label: 'Travel'),
  Category(id: 'beauty', label: 'Beauty'),
  Category(id: 'tech', label: 'Tech'),
];
