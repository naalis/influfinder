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
    businessLogo: "🍝",
    title: "Authentic Italian Dining Experience",
    description: "Share your experience at our new location. Full tasting menu for 2 people.",
    category: "Food & Dining",
    estimatedValue: 120,
    location: "Downtown Miami",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
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
    businessLogo: "💪",
    title: "3-Month Premium Membership",
    description: "Get fit with our state-of-the-art equipment. Share your fitness journey.",
    category: "Fitness",
    estimatedValue: 299,
    location: "Brickell, Miami",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
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
    businessLogo: "🧘",
    title: "Luxury Spa Day Package",
    description: "Full day spa experience with massage, facial, and more. Perfect for wellness content.",
    category: "Wellness",
    estimatedValue: 350,
    location: "South Beach",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
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
    businessLogo: "👗",
    title: "Spring Collection Feature",
    description: "Style our new spring collection. $500 wardrobe + photoshoot.",
    category: "Fashion",
    estimatedValue: 500,
    location: "Design District",
    imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea28c58c?w=800&q=80",
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
    businessLogo: "✈️",
    title: "Weekend Getaway Experience",
    description: "2-night stay at our luxury beachfront resort. All meals included.",
    category: "Travel",
    estimatedValue: 800,
    location: "Key West, FL",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
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
    businessLogo: "💄",
    title: "Complete Makeover Experience",
    description: "Professional makeup session + skincare products worth $200.",
    category: "Beauty",
    estimatedValue: 200,
    location: "Coral Gables",
    imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
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
    businessLogo: "📱",
    title: "Latest Gadgets Review",
    description: "Try and review our newest tech products. Keep 2 items of your choice.",
    category: "Tech",
    estimatedValue: 600,
    location: "Online + Pickup",
    imageUrl: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80",
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
    businessLogo: "🏠",
    title: "Room Makeover Collaboration",
    description: "Transform your space with our furniture. $1000 credit for home decor.",
    category: "Home & Decor",
    estimatedValue: 1000,
    location: "Nationwide Shipping",
    imageUrl: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80",
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
  { id: "all", label: "All", emoji: "✨" },
  { id: "food", label: "Food", emoji: "🍽️" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
  { id: "wellness", label: "Wellness", emoji: "🧘" },
  { id: "fashion", label: "Fashion", emoji: "👗" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "beauty", label: "Beauty", emoji: "💄" },
  { id: "tech", label: "Tech", emoji: "📱" },
  { id: "home", label: "Home", emoji: "🏠" },
];
