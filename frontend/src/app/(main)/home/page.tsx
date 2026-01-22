"use client";

import { useState } from "react";
import { Search } from "lucide-react";
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
    <div className="relative min-h-screen bg-black pb-6">
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-brand-purple/10 via-transparent to-transparent" />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800/50 bg-black/90 p-6 backdrop-blur-xl">
        <div className="mx-auto max-w-lg">
          {/* Logo */}
          <div className="mb-4">
            <img
              src="/logo-white.png"
              alt="Influfinder"
              className="h-8 w-auto"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-xl font-bold text-white">
                Hey, {userName}!
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
      <div className="sticky top-[120px] z-10 bg-black/90 py-4 backdrop-blur-xl">
        <div className="mx-auto max-w-lg">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </div>

      {/* Offers Feed */}
      <div className="relative z-0 mx-auto max-w-lg space-y-4 px-6">
        {/* Stats Bar */}
        <div className="flex items-center justify-between rounded-2xl border border-brand-cyan/20 bg-gradient-to-r from-brand-cyan/5 via-brand-purple/5 to-brand-magenta/5 p-4">
          <div>
            <div className="text-2xl font-bold text-brand-cyan">
              {filteredOffers.length}
            </div>
            <div className="text-xs text-gray-400">Available</div>
          </div>
          <div className="h-8 w-px bg-gray-800" />
          <div>
            <div className="text-2xl font-bold text-brand-magenta">
              ${filteredOffers.reduce((sum, offer) => sum + offer.estimatedValue, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Total Value</div>
          </div>
          <div className="h-8 w-px bg-gray-800" />
          <div>
            <div className="text-2xl font-bold text-brand-purple">
              {filteredOffers.reduce((sum, offer) => sum + offer.applicants, 0)}
            </div>
            <div className="text-xs text-gray-400">Applied</div>
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
            <div className="mb-4">
              <Search className="h-16 w-16 text-brand-cyan/30" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              No offers found
            </h3>
            <p className="text-gray-400">
              Try selecting a different category
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredOffers.length > 0 && (
          <button className="w-full rounded-2xl border border-brand-cyan/30 bg-brand-cyan/5 py-4 text-center font-semibold text-brand-cyan transition-all hover:border-brand-cyan/50 hover:bg-brand-cyan/10">
            Load More Offers
          </button>
        )}
      </div>
    </div>
  );
}
