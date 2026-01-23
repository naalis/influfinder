"use client";

import { useRouter } from "next/navigation";
import { mockOffers } from "@/lib/mockOffers";
import TierBadge from "@/components/TierBadge";
import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Store,
  Gift,
  Camera,
  Star,
  Frown,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function OfferDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);
  const [activeTab, setActiveTab] = useState<"influencer" | "user">("user");

  const offer = mockOffers.find((o) => o.id === params.id);

  // Mock: user is not a verified influencer
  const isVerifiedInfluencer = false;

  if (!offer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Frown className="h-16 w-16 text-gray-400 opacity-50" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white">Offer not found</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 text-brand-cyan hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const isInvitationOnly = offer.offerType === "invitation";

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      router.push("/collabs");
    }, 2000);
  };

  const currentRequirements = activeTab === "influencer"
    ? offer.influencerRequirements
    : offer.userRequirements;

  return (
    <div className="min-h-screen bg-black pb-32">
      {/* Hero Image */}
      <div className="relative h-80 w-full">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${offer.imageUrl})`,
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 backdrop-blur-sm transition-all hover:bg-black/90"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>

        {/* Free Badge */}
        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-brand-cyan px-4 py-2">
          <Gift className="h-4 w-4 text-black" />
          <span className="text-sm font-bold text-black">FREE</span>
        </div>

        {/* Invite Only Badge */}
        {isInvitationOnly && (
          <div className="absolute left-4 top-16 flex items-center gap-1.5 rounded-full bg-brand-magenta px-3 py-1.5">
            <Star className="h-3.5 w-3.5 text-white" />
            <span className="text-xs font-semibold text-white">Invite Only</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mx-auto max-w-lg px-6 pt-6">
        {/* Business Info */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900">
            <Store className="h-7 w-7 text-brand-cyan" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {offer.businessName}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{offer.category}</span>
              {offer.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {offer.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-2xl font-bold text-white">
          {offer.title}
        </h1>

        {/* Description */}
        <p className="mb-6 text-gray-300 leading-relaxed">
          {offer.description}
        </p>

        {/* What You Get Section */}
        <div className="mb-6 rounded-2xl border border-brand-cyan/30 bg-brand-cyan/10 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Gift className="h-5 w-5 text-brand-cyan" />
            <h3 className="text-lg font-semibold text-white">What You Get</h3>
          </div>
          <p className="text-lg font-medium text-white">{offer.whatYouGet}</p>
        </div>

        {/* Content Required Section */}
        <div className="mb-6 rounded-2xl border border-brand-magenta/30 bg-brand-magenta/10 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Camera className="h-5 w-5 text-brand-magenta" />
            <h3 className="text-lg font-semibold text-white">Content Required</h3>
          </div>
          <p className="mb-3 text-lg font-medium text-white">{offer.contentSummary}</p>
          <div className="flex flex-wrap gap-2">
            {offer.contentRequired.map((content, idx) => (
              <span
                key={idx}
                className="rounded-full bg-brand-magenta/20 px-3 py-1 text-sm text-brand-magenta"
              >
                {content.quantity} {content.type}{content.quantity > 1 ? 's' : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
            <div className="mb-1 flex items-center gap-2 text-2xl font-bold text-brand-purple">
              <Users className="h-5 w-5" />
              {offer.applicants}
            </div>
            <div className="text-sm text-gray-400">Interested</div>
          </div>
          {offer.deadline && (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <div className="mb-1 flex items-center gap-2 text-2xl font-bold text-brand-cyan">
                <Clock className="h-5 w-5" />
                {new Date(offer.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="text-sm text-gray-400">Deadline</div>
            </div>
          )}
        </div>

        {/* Requirements Section */}
        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Requirements
          </h3>

          {/* Tab Toggle */}
          <div className="mb-4 flex rounded-xl bg-gray-800 p-1">
            <button
              onClick={() => setActiveTab("influencer")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                activeTab === "influencer"
                  ? "bg-brand-magenta text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Verified Influencer
            </button>
            <button
              onClick={() => setActiveTab("user")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                activeTab === "user"
                  ? "bg-brand-cyan text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Regular User
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Minimum Followers</span>
              <span className="font-semibold text-white">
                {currentRequirements.minFollowers.toLocaleString()}+
              </span>
            </div>
            {activeTab === "user" && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Engagement Rate</span>
                <span className="font-semibold text-white">
                  {offer.userRequirements.minEngagement}%+
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Required Tier</span>
              <TierBadge tier={currentRequirements.tierRequired as 0 | 1 | 2 | 3 | 4 | 5} size="sm" />
            </div>
          </div>

          {activeTab === "influencer" && (
            <p className="mt-4 rounded-lg bg-brand-magenta/10 p-3 text-xs text-brand-magenta">
              <Star className="mr-1 inline h-3 w-3" />
              Verified influencers have easier requirements and get invited directly by businesses.
            </p>
          )}
        </div>

        {/* How It Works */}
        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">
            How It Works
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-cyan/20 text-xs font-bold text-brand-cyan">
                1
              </div>
              <div>
                <div className="font-medium text-white">Apply or Accept Invite</div>
                <div className="text-sm text-gray-400">
                  {isInvitationOnly ? "Wait for an invitation from the business" : "Submit your application"}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-purple/20 text-xs font-bold text-brand-purple">
                2
              </div>
              <div>
                <div className="font-medium text-white">Enjoy the Experience</div>
                <div className="text-sm text-gray-400">
                  Visit the business and enjoy {offer.whatYouGet.toLowerCase()}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-magenta/20 text-xs font-bold text-brand-magenta">
                3
              </div>
              <div>
                <div className="font-medium text-white">Create & Post Content</div>
                <div className="text-sm text-gray-400">
                  Share {offer.contentSummary} on your social media
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-xs font-bold text-green-500">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium text-white">Complete Exchange</div>
                <div className="text-sm text-gray-400">
                  Submit your content links and complete the collaboration
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-black/95 p-6 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          {isInvitationOnly && !isVerifiedInfluencer ? (
            <div className="text-center">
              <p className="mb-2 text-sm text-gray-400">
                This offer is invitation-only for verified influencers
              </p>
              <button
                disabled
                className="w-full cursor-not-allowed rounded-full bg-gray-800 px-8 py-4 font-semibold text-gray-500"
              >
                Invite Only
              </button>
            </div>
          ) : !isApplying ? (
            <button
              onClick={handleApply}
              className={`w-full rounded-full px-8 py-4 font-semibold transition-all hover:scale-105 active:scale-95 ${
                isInvitationOnly
                  ? "bg-gradient-to-r from-brand-magenta to-brand-purple text-white"
                  : "bg-brand-cyan text-black"
              }`}
            >
              {isInvitationOnly ? "Accept Invitation" : "Apply for This Exchange"}
            </button>
          ) : (
            <div className="flex w-full items-center justify-center rounded-full bg-gray-800 px-8 py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-cyan border-t-transparent" />
              <span className="ml-3 font-semibold text-white">Applying...</span>
            </div>
          )}
          <p className="mt-2 text-center text-xs text-gray-500">
            You'll be notified about your application status
          </p>
        </div>
      </div>
    </div>
  );
}
