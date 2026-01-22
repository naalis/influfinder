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
    businessLogo: "🍝",
    title: "Italian Dining Experience",
    status: "active",
    appliedDate: "2026-01-15",
    value: 120,
    deadline: "2026-02-15",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
    nextAction: "Schedule your visit",
  },
  {
    id: "c2",
    offerId: "2",
    businessName: "FitZone Gym",
    businessLogo: "💪",
    title: "3-Month Premium Membership",
    status: "pending",
    appliedDate: "2026-01-20",
    value: 299,
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
    nextAction: "Waiting for approval",
  },
  {
    id: "c3",
    offerId: "6",
    businessName: "Glow Beauty Bar",
    businessLogo: "💄",
    title: "Complete Makeover Experience",
    status: "completed",
    appliedDate: "2025-12-10",
    value: 200,
    completedDate: "2026-01-05",
    imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80",
  },
  {
    id: "c4",
    offerId: "3",
    businessName: "Sunset Spa & Wellness",
    businessLogo: "🧘",
    title: "Luxury Spa Day Package",
    status: "pending",
    appliedDate: "2026-01-18",
    value: 350,
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80",
    nextAction: "Under review",
  },
  {
    id: "c5",
    offerId: "4",
    businessName: "Urban Threads Boutique",
    businessLogo: "👗",
    title: "Spring Collection Feature",
    status: "completed",
    appliedDate: "2025-11-20",
    value: 500,
    completedDate: "2025-12-15",
    imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea28c58c?w=400&q=80",
  },
  {
    id: "c6",
    offerId: "7",
    businessName: "TechHub Store",
    businessLogo: "📱",
    title: "Latest Gadgets Review",
    status: "active",
    appliedDate: "2026-01-10",
    value: 600,
    deadline: "2026-02-18",
    imageUrl: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80",
    nextAction: "Upload content by Feb 15",
  },
];
