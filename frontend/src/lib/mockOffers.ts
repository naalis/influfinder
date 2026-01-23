export interface ContentRequirement {
  type: "story" | "post" | "reel" | "review" | "video";
  quantity: number;
}

export interface Offer {
  id: string;
  businessName: string;
  businessLogo: string;
  title: string;
  description: string;
  category: string;
  // What the business offers (barter/exchange)
  whatYouGet: string;
  // Content required in exchange
  contentRequired: ContentRequirement[];
  contentSummary: string; // e.g., "2 Stories + 1 Post"
  location?: string;
  imageUrl: string;
  // Requirements for verified influencers (more flexible)
  influencerRequirements: {
    minFollowers: number;
    tierRequired: number;
  };
  // Requirements for regular users (stricter)
  userRequirements: {
    minFollowers: number;
    minEngagement: number;
    tierRequired: number;
  };
  // Offer type: invitation (for verified) or application (for regular users)
  offerType: "invitation" | "application" | "both";
  status: "active" | "pending" | "completed";
  applicants: number;
  deadline?: string;
}

export const mockOffers: Offer[] = [
  {
    id: "1",
    businessName: "Bella Vita Restaurant",
    businessLogo: "dining",
    title: "Authentic Italian Dining Experience",
    description: "Share your experience at our new location. Full tasting menu for 2 people.",
    category: "Food & Dining",
    whatYouGet: "Free dinner for 2 (tasting menu)",
    contentRequired: [
      { type: "story", quantity: 3 },
      { type: "post", quantity: 1 },
    ],
    contentSummary: "3 Stories + 1 Post",
    location: "Downtown Miami",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    influencerRequirements: {
      minFollowers: 500,
      tierRequired: 0,
    },
    userRequirements: {
      minFollowers: 2000,
      minEngagement: 3,
      tierRequired: 1,
    },
    offerType: "both",
    status: "active",
    applicants: 12,
    deadline: "2026-02-15",
  },
  {
    id: "2",
    businessName: "FitZone Gym",
    businessLogo: "fitness",
    title: "3-Month Premium Membership",
    description: "Get fit with our state-of-the-art equipment. Share your fitness journey with us.",
    category: "Fitness",
    whatYouGet: "3-month gym membership + PT session",
    contentRequired: [
      { type: "reel", quantity: 2 },
      { type: "story", quantity: 4 },
    ],
    contentSummary: "2 Reels + 4 Stories",
    location: "Brickell, Miami",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    influencerRequirements: {
      minFollowers: 1000,
      tierRequired: 1,
    },
    userRequirements: {
      minFollowers: 5000,
      minEngagement: 4,
      tierRequired: 2,
    },
    offerType: "both",
    status: "active",
    applicants: 24,
    deadline: "2026-02-10",
  },
  {
    id: "3",
    businessName: "Sunset Spa & Wellness",
    businessLogo: "wellness",
    title: "Luxury Spa Day Package",
    description: "Full day spa experience with massage, facial, and more. Perfect for wellness content.",
    category: "Wellness",
    whatYouGet: "Full spa day (massage + facial + lunch)",
    contentRequired: [
      { type: "reel", quantity: 1 },
      { type: "story", quantity: 5 },
      { type: "post", quantity: 1 },
    ],
    contentSummary: "1 Reel + 5 Stories + 1 Post",
    location: "South Beach",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    influencerRequirements: {
      minFollowers: 2500,
      tierRequired: 1,
    },
    userRequirements: {
      minFollowers: 8000,
      minEngagement: 5,
      tierRequired: 2,
    },
    offerType: "both",
    status: "active",
    applicants: 8,
    deadline: "2026-02-20",
  },
  {
    id: "4",
    businessName: "Urban Threads Boutique",
    businessLogo: "fashion",
    title: "Spring Collection Feature",
    description: "Style our new spring collection. Choose your favorite outfits to keep.",
    category: "Fashion",
    whatYouGet: "3 outfits of your choice + photoshoot",
    contentRequired: [
      { type: "reel", quantity: 2 },
      { type: "post", quantity: 3 },
      { type: "story", quantity: 6 },
    ],
    contentSummary: "2 Reels + 3 Posts + 6 Stories",
    location: "Design District",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    influencerRequirements: {
      minFollowers: 5000,
      tierRequired: 2,
    },
    userRequirements: {
      minFollowers: 15000,
      minEngagement: 4,
      tierRequired: 3,
    },
    offerType: "invitation",
    status: "active",
    applicants: 45,
    deadline: "2026-02-08",
  },
  {
    id: "5",
    businessName: "Paradise Beach Resort",
    businessLogo: "travel",
    title: "Weekend Getaway Experience",
    description: "2-night stay at our luxury beachfront resort. All meals included.",
    category: "Travel",
    whatYouGet: "2-night stay + all meals included",
    contentRequired: [
      { type: "reel", quantity: 3 },
      { type: "post", quantity: 4 },
      { type: "story", quantity: 10 },
    ],
    contentSummary: "3 Reels + 4 Posts + 10 Stories",
    location: "Key West, FL",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    influencerRequirements: {
      minFollowers: 10000,
      tierRequired: 2,
    },
    userRequirements: {
      minFollowers: 25000,
      minEngagement: 5,
      tierRequired: 3,
    },
    offerType: "invitation",
    status: "active",
    applicants: 67,
    deadline: "2026-02-05",
  },
  {
    id: "6",
    businessName: "Glow Beauty Bar",
    businessLogo: "beauty",
    title: "Complete Makeover Experience",
    description: "Professional makeup session + skincare products to take home.",
    category: "Beauty",
    whatYouGet: "Makeover + skincare products",
    contentRequired: [
      { type: "reel", quantity: 1 },
      { type: "story", quantity: 4 },
      { type: "review", quantity: 1 },
    ],
    contentSummary: "1 Reel + 4 Stories + 1 Review",
    location: "Coral Gables",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    influencerRequirements: {
      minFollowers: 1500,
      tierRequired: 1,
    },
    userRequirements: {
      minFollowers: 5000,
      minEngagement: 4,
      tierRequired: 2,
    },
    offerType: "both",
    status: "active",
    applicants: 31,
    deadline: "2026-02-12",
  },
  {
    id: "7",
    businessName: "TechHub Store",
    businessLogo: "tech",
    title: "Latest Gadgets Review",
    description: "Try and review our newest tech products. Keep 2 items of your choice.",
    category: "Tech",
    whatYouGet: "2 tech gadgets to keep",
    contentRequired: [
      { type: "video", quantity: 1 },
      { type: "reel", quantity: 2 },
      { type: "review", quantity: 1 },
    ],
    contentSummary: "1 Video + 2 Reels + 1 Review",
    location: "Online + Pickup",
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
    influencerRequirements: {
      minFollowers: 5000,
      tierRequired: 2,
    },
    userRequirements: {
      minFollowers: 12000,
      minEngagement: 3,
      tierRequired: 2,
    },
    offerType: "both",
    status: "active",
    applicants: 52,
    deadline: "2026-02-18",
  },
  {
    id: "8",
    businessName: "Home Haven Decor",
    businessLogo: "home",
    title: "Room Makeover Collaboration",
    description: "Transform your space with our furniture and decor items.",
    category: "Home & Decor",
    whatYouGet: "Furniture & decor for one room",
    contentRequired: [
      { type: "reel", quantity: 2 },
      { type: "post", quantity: 3 },
      { type: "story", quantity: 8 },
      { type: "video", quantity: 1 },
    ],
    contentSummary: "2 Reels + 3 Posts + 8 Stories + 1 Video",
    location: "Nationwide Shipping",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    influencerRequirements: {
      minFollowers: 15000,
      tierRequired: 3,
    },
    userRequirements: {
      minFollowers: 30000,
      minEngagement: 4,
      tierRequired: 4,
    },
    offerType: "invitation",
    status: "active",
    applicants: 89,
    deadline: "2026-02-25",
  },
];

export const categories = [
  { id: "all", label: "All", icon: "all" },
  { id: "food", label: "Food", icon: "dining" },
  { id: "fitness", label: "Fitness", icon: "fitness" },
  { id: "wellness", label: "Wellness", icon: "wellness" },
  { id: "fashion", label: "Fashion", icon: "fashion" },
  { id: "travel", label: "Travel", icon: "travel" },
  { id: "beauty", label: "Beauty", icon: "beauty" },
  { id: "tech", label: "Tech", icon: "tech" },
  { id: "home", label: "Home", icon: "home" },
];
