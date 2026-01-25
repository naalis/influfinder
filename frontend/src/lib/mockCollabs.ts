/**
 * Collaboration Status Flow:
 *
 * For VIP Influencers (+1M followers):
 *   invited → accepted → scheduled → visited → in_review → completed
 *   invited → declined (by influencer or expired)
 *
 * For Regular Influencers (-1M followers) & Normal Users:
 *   applied → accepted → scheduled → visited → in_review → completed
 *   applied → declined (by business)
 */

export type CollabStatus =
  | "invited"    // Direct invitation from business (VIP only)
  | "applied"    // Application sent, waiting for response
  | "accepted"   // Approved, can schedule visit
  | "scheduled"  // Visit date confirmed
  | "visited"    // Visited the place, must create content
  | "in_review"  // Content submitted, under verification
  | "completed"  // Verified by both parties, closed
  | "declined";  // Rejected by business or declined by user

export type CollabTab = "invitations" | "applied" | "active" | "in_review" | "completed" | "declined";

export type UserType = "vip_influencer" | "regular_influencer" | "normal_user";

export interface Collaboration {
  id: string;
  offerId: string;
  businessName: string;
  businessLogo: string;
  title: string;
  status: CollabStatus;
  userType: UserType;
  appliedDate: string;
  whatYouGet: string;
  contentRequired: string;
  scheduledDate?: string;
  visitedDate?: string;
  submittedDate?: string;
  completedDate?: string;
  declinedDate?: string;
  declineReason?: string;
  deadline?: string;
  imageUrl: string;
  nextAction?: string;
}

// Helper to categorize status into tabs
export function getCollabTab(status: CollabStatus, userType: UserType): CollabTab {
  switch (status) {
    case "invited":
      return "invitations";
    case "applied":
      return "applied";
    case "accepted":
    case "scheduled":
    case "visited":
      return "active";
    case "in_review":
      return "in_review";
    case "completed":
      return "completed";
    case "declined":
      return "declined";
    default:
      return "applied";
  }
}

// Check if user is VIP (has invitations tab)
export function isVipInfluencer(userType: UserType): boolean {
  return userType === "vip_influencer";
}

// Mock current user type (in real app, this comes from auth)
export const currentUserType: UserType = "vip_influencer"; // Change to test different views

export const mockCollabs: Collaboration[] = [
  // === INVITATIONS (VIP only) ===
  {
    id: "c1",
    offerId: "5",
    businessName: "Paradise Beach Resort",
    businessLogo: "travel",
    title: "Luxury Weekend Getaway",
    status: "invited",
    userType: "vip_influencer",
    appliedDate: "2026-01-22",
    whatYouGet: "2-night stay + all meals + spa",
    contentRequired: "3 Reels + 4 Posts + 10 Stories",
    deadline: "2026-01-28",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    nextAction: "Accept or decline by Jan 28",
  },
  {
    id: "c2",
    offerId: "4",
    businessName: "Urban Threads Boutique",
    businessLogo: "fashion",
    title: "Spring Collection VIP Preview",
    status: "invited",
    userType: "vip_influencer",
    appliedDate: "2026-01-20",
    whatYouGet: "5 outfits + professional photoshoot",
    contentRequired: "2 Reels + 3 Posts + 8 Stories",
    deadline: "2026-01-25",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
    nextAction: "Accept or decline by Jan 25",
  },

  // === APPLIED (waiting for response) ===
  {
    id: "c3",
    offerId: "2",
    businessName: "FitZone Gym",
    businessLogo: "fitness",
    title: "3-Month Premium Membership",
    status: "applied",
    userType: "regular_influencer",
    appliedDate: "2026-01-20",
    whatYouGet: "3-month gym membership + PT session",
    contentRequired: "2 Reels + 4 Stories",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
    nextAction: "Waiting for business approval",
  },
  {
    id: "c4",
    offerId: "3",
    businessName: "Sunset Spa & Wellness",
    businessLogo: "wellness",
    title: "Luxury Spa Day Package",
    status: "applied",
    userType: "normal_user",
    appliedDate: "2026-01-18",
    whatYouGet: "Full spa day (massage + facial + lunch)",
    contentRequired: "1 Reel + 5 Stories + 1 Post",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80",
    nextAction: "Under review by business",
  },

  // === ACTIVE (Accepted) ===
  {
    id: "c5",
    offerId: "6",
    businessName: "Glow Beauty Bar",
    businessLogo: "beauty",
    title: "Complete Makeover Experience",
    status: "accepted",
    userType: "regular_influencer",
    appliedDate: "2026-01-10",
    whatYouGet: "Makeover + skincare products",
    contentRequired: "1 Reel + 4 Stories + 1 Review",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
    nextAction: "Schedule your visit",
  },

  // === ACTIVE (Scheduled) ===
  {
    id: "c6",
    offerId: "1",
    businessName: "Bella Vita Restaurant",
    businessLogo: "dining",
    title: "Italian Dining Experience",
    status: "scheduled",
    userType: "vip_influencer",
    appliedDate: "2026-01-15",
    scheduledDate: "2026-01-28",
    whatYouGet: "Free dinner for 2 (tasting menu)",
    contentRequired: "3 Stories + 1 Post",
    deadline: "2026-02-15",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    nextAction: "Visit scheduled for Jan 28",
  },

  // === ACTIVE (Visited) ===
  {
    id: "c7",
    offerId: "7",
    businessName: "TechHub Store",
    businessLogo: "tech",
    title: "Latest Gadgets Review",
    status: "visited",
    userType: "vip_influencer",
    appliedDate: "2026-01-10",
    scheduledDate: "2026-01-20",
    visitedDate: "2026-01-20",
    whatYouGet: "2 tech gadgets to keep",
    contentRequired: "1 Video + 2 Reels + 1 Review",
    deadline: "2026-02-05",
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=80",
    nextAction: "Create and upload your content",
  },

  // === IN REVIEW ===
  {
    id: "c8",
    offerId: "8",
    businessName: "Home Haven Decor",
    businessLogo: "home",
    title: "Room Makeover Collaboration",
    status: "in_review",
    userType: "vip_influencer",
    appliedDate: "2025-12-15",
    scheduledDate: "2026-01-05",
    visitedDate: "2026-01-05",
    submittedDate: "2026-01-15",
    whatYouGet: "Furniture & decor for one room",
    contentRequired: "2 Reels + 3 Posts + 8 Stories",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
    nextAction: "Content under verification",
  },

  // === COMPLETED ===
  {
    id: "c9",
    offerId: "9",
    businessName: "Café Deluxe",
    businessLogo: "dining",
    title: "Brunch Experience",
    status: "completed",
    userType: "vip_influencer",
    appliedDate: "2025-11-20",
    scheduledDate: "2025-12-01",
    visitedDate: "2025-12-01",
    submittedDate: "2025-12-10",
    completedDate: "2025-12-15",
    whatYouGet: "Brunch for 4 people",
    contentRequired: "2 Stories + 1 Post",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
  },
  {
    id: "c10",
    offerId: "10",
    businessName: "Yoga Studio Zen",
    businessLogo: "wellness",
    title: "Monthly Unlimited Pass",
    status: "completed",
    userType: "regular_influencer",
    appliedDate: "2025-10-15",
    scheduledDate: "2025-11-01",
    visitedDate: "2025-11-01",
    submittedDate: "2025-11-20",
    completedDate: "2025-11-25",
    whatYouGet: "1-month unlimited yoga classes",
    contentRequired: "1 Reel + 3 Stories",
    imageUrl: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&q=80",
  },

  // === DECLINED ===
  {
    id: "c11",
    offerId: "11",
    businessName: "Elite Watches",
    businessLogo: "fashion",
    title: "Luxury Watch Feature",
    status: "declined",
    userType: "regular_influencer",
    appliedDate: "2026-01-05",
    declinedDate: "2026-01-10",
    declineReason: "Looking for accounts with 50K+ followers",
    whatYouGet: "Watch loan for 1 week",
    contentRequired: "2 Reels + 2 Posts",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  },
  {
    id: "c12",
    offerId: "12",
    businessName: "Steakhouse Prime",
    businessLogo: "dining",
    title: "Premium Dining Experience",
    status: "declined",
    userType: "normal_user",
    appliedDate: "2026-01-08",
    declinedDate: "2026-01-12",
    declineReason: "Not enough engagement rate",
    whatYouGet: "Dinner for 2",
    contentRequired: "2 Stories + 1 Post",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
  },
];
