export interface Offer {
  id: string;
  businessName: string;
  businessLogo: string;
  title: string;
  description: string;
  category: string;
  estimatedValue: number;
  location?: string;
  imageUrl: string;
  requirements: {
    minFollowers: number;
    minEngagement?: number;
    tierRequired: number;
  };
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
    estimatedValue: 120,
    location: "Downtown Miami",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    requirements: {
      minFollowers: 1000,
      minEngagement: 3,
      tierRequired: 0,
    },
    status: "active",
    applicants: 12,
    deadline: "2026-02-15",
  },
  {
    id: "2",
    businessName: "FitZone Gym",
    businessLogo: "fitness",
    title: "3-Month Premium Membership",
    description: "Get fit with our state-of-the-art equipment. Share your fitness journey.",
    category: "Fitness",
    estimatedValue: 299,
    location: "Brickell, Miami",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    requirements: {
      minFollowers: 2500,
      minEngagement: 4,
      tierRequired: 1,
    },
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
    estimatedValue: 350,
    location: "South Beach",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    requirements: {
      minFollowers: 5000,
      minEngagement: 5,
      tierRequired: 2,
    },
    status: "active",
    applicants: 8,
    deadline: "2026-02-20",
  },
  {
    id: "4",
    businessName: "Urban Threads Boutique",
    businessLogo: "fashion",
    title: "Spring Collection Feature",
    description: "Style our new spring collection. $500 wardrobe + photoshoot.",
    category: "Fashion",
    estimatedValue: 500,
    location: "Design District",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    requirements: {
      minFollowers: 10000,
      minEngagement: 4,
      tierRequired: 2,
    },
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
    estimatedValue: 800,
    location: "Key West, FL",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    requirements: {
      minFollowers: 15000,
      minEngagement: 5,
      tierRequired: 3,
    },
    status: "active",
    applicants: 67,
    deadline: "2026-02-05",
  },
  {
    id: "6",
    businessName: "Glow Beauty Bar",
    businessLogo: "beauty",
    title: "Complete Makeover Experience",
    description: "Professional makeup session + skincare products worth $200.",
    category: "Beauty",
    estimatedValue: 200,
    location: "Coral Gables",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    requirements: {
      minFollowers: 3000,
      minEngagement: 4,
      tierRequired: 1,
    },
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
    estimatedValue: 600,
    location: "Online + Pickup",
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
    requirements: {
      minFollowers: 8000,
      minEngagement: 3,
      tierRequired: 2,
    },
    status: "active",
    applicants: 52,
    deadline: "2026-02-18",
  },
  {
    id: "8",
    businessName: "Home Haven Decor",
    businessLogo: "home",
    title: "Room Makeover Collaboration",
    description: "Transform your space with our furniture. $1000 credit for home decor.",
    category: "Home & Decor",
    estimatedValue: 1000,
    location: "Nationwide Shipping",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    requirements: {
      minFollowers: 20000,
      minEngagement: 4,
      tierRequired: 3,
    },
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
