// Status flow for regular users: applied → accepted → scheduled → visited → content_submitted → completed
// Status flow for influencers: invited → accepted → scheduled → visited → content_submitted → completed

export type CollabStatus =
  | "applied"           // User applied, waiting for business response
  | "invited"           // Influencer received invitation
  | "accepted"          // Business accepted / Influencer accepted invite
  | "scheduled"         // Visit date scheduled
  | "visited"           // User visited the business
  | "content_submitted" // Content uploaded, waiting for review
  | "completed"         // All done, content approved
  | "rejected";         // Application rejected

export type CollabCategory = "pending" | "active" | "in_review" | "completed";

export interface Collaboration {
  id: string;
  offerId: string;
  businessName: string;
  businessLogo: string;
  title: string;
  status: CollabStatus;
  isInfluencer: boolean; // true = invited, false = applied
  appliedDate: string;
  whatYouGet: string;
  contentRequired: string;
  scheduledDate?: string;
  visitedDate?: string;
  submittedDate?: string;
  completedDate?: string;
  deadline?: string;
  imageUrl: string;
  nextAction?: string;
}

// Helper to categorize status into tabs
export function getCollabCategory(status: CollabStatus): CollabCategory {
  switch (status) {
    case "applied":
    case "invited":
      return "pending";
    case "accepted":
    case "scheduled":
    case "visited":
      return "active";
    case "content_submitted":
      return "in_review";
    case "completed":
    case "rejected":
      return "completed";
    default:
      return "pending";
  }
}

export const mockCollabs: Collaboration[] = [
  // PENDING - Applied (regular user)
  {
    id: "c1",
    offerId: "2",
    businessName: "FitZone Gym",
    businessLogo: "fitness",
    title: "3-Month Premium Membership",
    status: "applied",
    isInfluencer: false,
    appliedDate: "2026-01-20",
    whatYouGet: "3-month gym membership + PT session",
    contentRequired: "2 Reels + 4 Stories",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
    nextAction: "Waiting for business approval",
  },
  // PENDING - Invited (influencer)
  {
    id: "c2",
    offerId: "5",
    businessName: "Paradise Beach Resort",
    businessLogo: "travel",
    title: "Weekend Getaway Experience",
    status: "invited",
    isInfluencer: true,
    appliedDate: "2026-01-22",
    whatYouGet: "2-night stay + all meals included",
    contentRequired: "3 Reels + 4 Posts + 10 Stories",
    deadline: "2026-01-25",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    nextAction: "Accept or decline invitation",
  },
  // ACTIVE - Accepted
  {
    id: "c3",
    offerId: "3",
    businessName: "Sunset Spa & Wellness",
    businessLogo: "wellness",
    title: "Luxury Spa Day Package",
    status: "accepted",
    isInfluencer: false,
    appliedDate: "2026-01-18",
    whatYouGet: "Full spa day (massage + facial + lunch)",
    contentRequired: "1 Reel + 5 Stories + 1 Post",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80",
    nextAction: "Schedule your visit",
  },
  // ACTIVE - Scheduled
  {
    id: "c4",
    offerId: "1",
    businessName: "Bella Vita Restaurant",
    businessLogo: "dining",
    title: "Italian Dining Experience",
    status: "scheduled",
    isInfluencer: false,
    appliedDate: "2026-01-15",
    scheduledDate: "2026-01-28",
    whatYouGet: "Free dinner for 2",
    contentRequired: "3 Stories + 1 Post",
    deadline: "2026-02-15",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    nextAction: "Visit on Jan 28",
  },
  // ACTIVE - Visited
  {
    id: "c5",
    offerId: "7",
    businessName: "TechHub Store",
    businessLogo: "tech",
    title: "Latest Gadgets Review",
    status: "visited",
    isInfluencer: true,
    appliedDate: "2026-01-10",
    scheduledDate: "2026-01-20",
    visitedDate: "2026-01-20",
    whatYouGet: "2 tech gadgets to keep",
    contentRequired: "1 Video + 2 Reels + 1 Review",
    deadline: "2026-02-18",
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=80",
    nextAction: "Upload your content",
  },
  // IN REVIEW - Content Submitted
  {
    id: "c6",
    offerId: "6",
    businessName: "Glow Beauty Bar",
    businessLogo: "beauty",
    title: "Complete Makeover Experience",
    status: "content_submitted",
    isInfluencer: false,
    appliedDate: "2025-12-10",
    scheduledDate: "2025-12-20",
    visitedDate: "2025-12-20",
    submittedDate: "2026-01-02",
    whatYouGet: "Makeover + skincare products",
    contentRequired: "1 Reel + 4 Stories + 1 Review",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
    nextAction: "Content under review",
  },
  // COMPLETED
  {
    id: "c7",
    offerId: "4",
    businessName: "Urban Threads Boutique",
    businessLogo: "fashion",
    title: "Spring Collection Feature",
    status: "completed",
    isInfluencer: true,
    appliedDate: "2025-11-20",
    scheduledDate: "2025-12-01",
    visitedDate: "2025-12-01",
    submittedDate: "2025-12-10",
    completedDate: "2025-12-15",
    whatYouGet: "3 outfits of your choice",
    contentRequired: "2 Reels + 3 Posts + 6 Stories",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
  },
  // COMPLETED - Another one
  {
    id: "c8",
    offerId: "8",
    businessName: "Home Haven Decor",
    businessLogo: "home",
    title: "Room Makeover Collaboration",
    status: "completed",
    isInfluencer: true,
    appliedDate: "2025-10-15",
    scheduledDate: "2025-11-01",
    visitedDate: "2025-11-01",
    submittedDate: "2025-11-20",
    completedDate: "2025-11-25",
    whatYouGet: "Furniture & decor for one room",
    contentRequired: "2 Reels + 3 Posts + 8 Stories",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
  },
];
