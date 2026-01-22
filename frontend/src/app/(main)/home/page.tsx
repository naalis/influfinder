"use client";

import { useState } from "react";
import TierBadge from "@/components/TierBadge";
import OfferCard from "@/components/offers/OfferCard";
import CategoryFilter from "@/components/offers/CategoryFilter";
import { mockOffers, categories } from "@/lib/mockOffers";
import { calculateTierLevel } from "@/lib/tiers";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock user data
  const userCollabs = 7;
  const currentTier = calculateTierLevel(userCollabs);
  const userName = "Creator";

  // Filter offers by category
  const filteredOffers =
    selectedCategory === "all"
      ? mockOffers
      : mockOffers.filter((offer) =>
          offer.category.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  return (
    <div className="min-h-screen bg-black pb-6">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-black/95 p-6 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-bold text-white">
                Hey, {userName}! 👋
              </h1>
              <p className="text-sm text-gray-400">
                Discover amazing opportunities
              </p>
            </div>
            <TierBadge tier={currentTier} size="md" variant="gradient" />
          </div>
        </div>
      </header>

      {/* Category Filters */}
      <div className="sticky top-[120px] z-10 bg-black/95 py-4 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </div>

      {/* Offers Feed */}
      <div className="mx-auto max-w-lg space-y-4 px-6">
        {/* Stats Bar */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-800 bg-gray-900/50 p-4">
          <div>
            <div className="text-2xl font-bold text-brand-cyan">
              {filteredOffers.length}
            </div>
            <div className="text-xs text-gray-500">Available Offers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brand-magenta">
              ${filteredOffers.reduce((sum, offer) => sum + offer.estimatedValue, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Total Value</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brand-purple">
              {filteredOffers.reduce((sum, offer) => sum + offer.applicants, 0)}
            </div>
            <div className="text-xs text-gray-500">Applicants</div>
          </div>
        </div>

        {/* Offers Grid */}
        {filteredOffers.length > 0 ? (
          <div className="space-y-4">
            {filteredOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <div className="mb-4 text-6xl opacity-30">🔍</div>
            <h3 className="mb-2 text-xl font-bold text-white">
              No offers found
            </h3>
            <p className="text-gray-400">
              Try selecting a different category
            </p>
          </div>
        )}

        {/* Load More Button (UI only) */}
        {filteredOffers.length > 0 && (
          <button className="w-full rounded-2xl border-2 border-gray-800 bg-transparent py-4 text-center font-semibold text-gray-400 transition-all hover:border-gray-700 hover:bg-gray-900">
            Load More Offers
          </button>
        )}
      </div>
    </div>
  );
}
