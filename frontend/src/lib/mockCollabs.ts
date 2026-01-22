export interface Collaboration {
  id: string;
  offerId: string;
  businessName: string;
  businessLogo: string;
  title: string;
  status: "pending" | "active" | "completed";
  appliedDate: string;
  value: number;
  deadline?: string;
  completedDate?: string;
  imageUrl: string;
  nextAction?: string;
}

export const mockCollabs: Collaboration[] = [
  {
    id: "c1",
    offerId: "1",
    businessName: "Bella Vita Restaurant",
    businessLogo: "dining",
    title: "Italian Dining Experience",
    status: "active",
    appliedDate: "2026-01-15",
    value: 120,
    deadline: "2026-02-15",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    nextAction: "Schedule your visit",
  },
  {
    id: "c2",
    offerId: "2",
    businessName: "FitZone Gym",
    businessLogo: "fitness",
    title: "3-Month Premium Membership",
    status: "pending",
    appliedDate: "2026-01-20",
    value: 299,
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
    nextAction: "Waiting for approval",
  },
  {
    id: "c3",
    offerId: "6",
    businessName: "Glow Beauty Bar",
    businessLogo: "beauty",
    title: "Complete Makeover Experience",
    status: "completed",
    appliedDate: "2025-12-10",
    value: 200,
    completedDate: "2026-01-05",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
  },
  {
    id: "c4",
    offerId: "3",
    businessName: "Sunset Spa & Wellness",
    businessLogo: "wellness",
    title: "Luxury Spa Day Package",
    status: "pending",
    appliedDate: "2026-01-18",
    value: 350,
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80",
    nextAction: "Under review",
  },
  {
    id: "c5",
    offerId: "4",
    businessName: "Urban Threads Boutique",
    businessLogo: "fashion",
    title: "Spring Collection Feature",
    status: "completed",
    appliedDate: "2025-11-20",
    value: 500,
    completedDate: "2025-12-15",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
  },
  {
    id: "c6",
    offerId: "7",
    businessName: "TechHub Store",
    businessLogo: "tech",
    title: "Latest Gadgets Review",
    status: "active",
    appliedDate: "2026-01-10",
    value: 600,
    deadline: "2026-02-18",
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=80",
    nextAction: "Upload content by Feb 15",
  },
];
