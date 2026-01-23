"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import TierBadge from "@/components/TierBadge";
import OfferCard from "@/components/offers/OfferCard";
import CategoryFilter from "@/components/offers/CategoryFilter";
import { FlowingRibbon, DecoRibbon } from "@/components/brand/DecoWave";
import Isotipo from "@/components/brand/Isotipo";
import { mockOffers, categories } from "@/lib/mockOffers";
import { calculateTierLevel } from "@/lib/tiers";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Mock user data
  const userCollabs = 7;
  const currentTier = calculateTierLevel(userCollabs);
  const userName = "Creator";

  // Filter offers by category and search
  const filteredOffers = mockOffers.filter((offer) => {
    const matchesCategory =
      selectedCategory === "all" ||
      offer.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-black pb-24">
      {/* Decorative background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <FlowingRibbon className="absolute -top-20 left-0 right-0 h-80 opacity-30" />
        <DecoRibbon position="topRight" className="!opacity-10" />
        <DecoRibbon position="bottomLeft" className="!opacity-10" />
      </div>

      {/* Subtle gradient overlay */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-brand-purple/10 via-transparent to-brand-magenta/5" />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-800/50 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto max-w-lg p-4">
          {/* Top row: Logo and Tier */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Isotipo size={32} variant="gradient" />
              <span className="text-lg font-bold text-white">Influfinder</span>
            </div>
            <TierBadge tier={currentTier} size="sm" variant="gradient" />
          </div>

          {/* Welcome text */}
          <div className="mb-4">
            <h1 className="mb-1 text-xl font-bold text-white">
              Hey, {userName}! <span className="wave">👋</span>
            </h1>
            <p className="text-sm text-gray-400">
              Find your next collaboration
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search offers..."
                className="w-full rounded-2xl border border-gray-800 bg-gray-900/80 py-3.5 pl-12 pr-4 text-white placeholder-gray-500 transition-all focus:border-brand-cyan/50 focus:outline-none focus:ring-2 focus:ring-brand-cyan/20"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-[52px] w-[52px] items-center justify-center rounded-2xl border transition-all ${
                showFilters
                  ? "border-brand-cyan bg-brand-cyan/10 text-brand-cyan"
                  : "border-gray-800 bg-gray-900/80 text-gray-400 hover:border-gray-700 hover:text-white"
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Category Filters */}
      <div className="sticky top-[180px] z-10 bg-black/80 py-3 backdrop-blur-xl">
        <div className="mx-auto max-w-lg">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </div>

      {/* Offers Feed */}
      <div className="relative z-0 mx-auto max-w-lg space-y-4 px-4 pt-2">
        {/* Stats Bar */}
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/90 backdrop-blur-sm">
          <div className="flex items-stretch">
            <div className="flex-1 p-4 text-center">
              <div className="mb-1 flex items-center justify-center gap-1.5 text-2xl font-bold text-brand-cyan">
                <Sparkles className="h-5 w-5" />
                {filteredOffers.length}
              </div>
              <div className="text-xs text-gray-500">Available</div>
            </div>
            <div className="w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
            <div className="flex-1 p-4 text-center">
              <div className="mb-1 text-2xl font-bold text-brand-magenta">
                {filteredOffers.filter(o => o.offerType === "invitation").length}
              </div>
              <div className="text-xs text-gray-500">Invite Only</div>
            </div>
            <div className="w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
            <div className="flex-1 p-4 text-center">
              <div className="mb-1 text-2xl font-bold text-brand-purple">
                {filteredOffers.reduce((sum, offer) => sum + offer.applicants, 0)}
              </div>
              <div className="text-xs text-gray-500">Interested</div>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        {filteredOffers.length > 0 ? (
          <div className="space-y-4">
            {filteredOffers.map((offer, index) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                variant={index === 0 ? "default" : "default"}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-gray-900/50 p-6">
              <Search className="h-12 w-12 text-brand-cyan/40" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              No offers found
            </h3>
            <p className="max-w-xs text-gray-400">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search.`
                : "Try selecting a different category"}
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredOffers.length > 0 && (
          <button className="w-full rounded-2xl border border-gray-800 bg-gray-900/50 py-4 text-center font-semibold text-gray-300 transition-all hover:border-brand-cyan/30 hover:bg-gray-900 hover:text-brand-cyan">
            Load More Offers
          </button>
        )}
      </div>
    </div>
  );
}
