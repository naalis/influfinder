"use client";

import { useState } from "react";
import { Clock, Sparkles, PartyPopper, Heart } from "lucide-react";
import CollabCard from "@/components/collabs/CollabCard";
import { mockCollabs } from "@/lib/mockCollabs";

type StatusFilter = "all" | "pending" | "active" | "completed";

export default function CollabsPage() {
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>("all");

  const filteredCollabs =
    selectedFilter === "all"
      ? mockCollabs
      : mockCollabs.filter((collab) => collab.status === selectedFilter);

  const statusCounts = {
    all: mockCollabs.length,
    pending: mockCollabs.filter((c) => c.status === "pending").length,
    active: mockCollabs.filter((c) => c.status === "active").length,
    completed: mockCollabs.filter((c) => c.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-black pb-6">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-black/95 p-6 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <h1 className="mb-2 text-2xl font-bold text-white">
            My Collaborations
          </h1>
          <p className="text-sm text-gray-400">
            Track your partnership journey
          </p>
        </div>
      </header>

      {/* Status Tabs */}
      <div className="sticky top-[120px] z-10 border-b border-gray-800 bg-black/95 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <div className="hide-scrollbar flex gap-2 overflow-x-auto px-6 py-4">
            {(["all", "active", "pending", "completed"] as StatusFilter[]).map(
              (filter) => {
                const isSelected = selectedFilter === filter;

                return (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      isSelected
                        ? "bg-brand-cyan text-black"
                        : "border border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    <span className="ml-1.5 opacity-70">
                      ({statusCounts[filter]})
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mx-auto max-w-lg space-y-4 px-6 py-6">
        <div className="grid grid-cols-3 gap-4 rounded-2xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="text-center">
            <div className="mb-1 text-2xl font-bold text-brand-cyan">
              {statusCounts.active}
            </div>
            <div className="text-xs text-gray-500">Active</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-2xl font-bold text-yellow-400">
              {statusCounts.pending}
            </div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-2xl font-bold text-green-400">
              {statusCounts.completed}
            </div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
        </div>

        {/* Collabs List */}
        {filteredCollabs.length > 0 ? (
          <div className="space-y-4">
            {filteredCollabs.map((collab) => (
              <CollabCard key={collab.id} collab={collab} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <div className="mb-4 opacity-30">
              {selectedFilter === "pending" && <Clock className="h-16 w-16 text-yellow-400" />}
              {selectedFilter === "active" && <Sparkles className="h-16 w-16 text-brand-cyan" />}
              {selectedFilter === "completed" && <PartyPopper className="h-16 w-16 text-green-400" />}
              {selectedFilter === "all" && <Heart className="h-16 w-16 text-brand-magenta" />}
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              No {selectedFilter !== "all" && selectedFilter} collaborations
            </h3>
            <p className="text-gray-400">
              {selectedFilter === "all"
                ? "Start applying to offers to see them here"
                : `No ${selectedFilter} collaborations yet`}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
