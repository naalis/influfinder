"use client";

import { useRouter } from "next/navigation";
import { mockOffers } from "@/lib/mockOffers";
import TierBadge from "@/components/TierBadge";
import { useState } from "react";

export default function OfferDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);

  const offer = mockOffers.find((o) => o.id === params.id);

  if (!offer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 text-6xl">😕</div>
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

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      router.push("/collabs");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black pb-24">
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
          <span className="text-xl text-white">←</span>
        </button>

        {/* Value Badge */}
        <div className="absolute right-4 top-4 rounded-full bg-black/70 px-4 py-2 backdrop-blur-sm">
          <span className="text-lg font-bold text-brand-cyan">
            ${offer.estimatedValue}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-lg px-6 pt-6">
        {/* Business Info */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-3xl">
            {offer.businessLogo}
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
                  <span>📍 {offer.location}</span>
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

        {/* Requirements Section */}
        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Requirements
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Minimum Followers</span>
              <span className="font-semibold text-white">
                {offer.requirements.minFollowers.toLocaleString()}+
              </span>
            </div>
            {offer.requirements.minEngagement && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Engagement Rate</span>
                <span className="font-semibold text-white">
                  {offer.requirements.minEngagement}%+
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Required Tier</span>
              <TierBadge tier={offer.requirements.tierRequired as any} size="sm" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
            <div className="mb-1 text-2xl font-bold text-brand-magenta">
              {offer.applicants}
            </div>
            <div className="text-sm text-gray-400">Applicants</div>
          </div>
          {offer.deadline && (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <div className="mb-1 text-2xl font-bold text-brand-purple">
                {new Date(offer.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="text-sm text-gray-400">Deadline</div>
            </div>
          )}
        </div>

        {/* What You'll Get */}
        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            What You'll Get
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-xl">✨</span>
              <div>
                <div className="font-semibold text-white">
                  Experience worth ${offer.estimatedValue}
                </div>
                <div className="text-sm text-gray-400">
                  Estimated retail value
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📸</span>
              <div>
                <div className="font-semibold text-white">
                  Content Creation Opportunity
                </div>
                <div className="text-sm text-gray-400">
                  Create authentic content for your audience
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">⭐</span>
              <div>
                <div className="font-semibold text-white">
                  Build Your Portfolio
                </div>
                <div className="text-sm text-gray-400">
                  Add to your collaboration history
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-black/95 p-6 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          {!isApplying ? (
            <button
              onClick={handleApply}
              className="w-full rounded-full bg-brand-cyan px-8 py-4 font-semibold text-black transition-all hover:scale-105 active:scale-95"
            >
              Apply for This Offer
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
