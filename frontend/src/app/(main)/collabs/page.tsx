"use client";

import { useState } from "react";
import {
  Clock,
  Sparkles,
  Eye,
  CheckCircle,
  Mail,
  Send,
} from "lucide-react";
import CollabCard from "@/components/collabs/CollabCard";
import {
  mockCollabs,
  getCollabCategory,
  type CollabCategory,
} from "@/lib/mockCollabs";

type TabFilter = "all" | CollabCategory;

const tabs: { id: TabFilter; label: string; icon: React.ReactNode; color: string }[] = [
  {
    id: "all",
    label: "All",
    icon: <Sparkles className="h-4 w-4" />,
    color: "brand-cyan",
  },
  {
    id: "pending",
    label: "Pending",
    icon: <Clock className="h-4 w-4" />,
    color: "yellow-400",
  },
  {
    id: "active",
    label: "Active",
    icon: <Sparkles className="h-4 w-4" />,
    color: "blue-400",
  },
  {
    id: "in_review",
    label: "In Review",
    icon: <Eye className="h-4 w-4" />,
    color: "orange-400",
  },
  {
    id: "completed",
    label: "Completed",
    icon: <CheckCircle className="h-4 w-4" />,
    color: "green-400",
  },
];

export default function CollabsPage() {
  const [selectedTab, setSelectedTab] = useState<TabFilter>("all");

  const filteredCollabs =
    selectedTab === "all"
      ? mockCollabs
      : mockCollabs.filter(
          (collab) => getCollabCategory(collab.status) === selectedTab
        );

  // Count collabs per category
  const categoryCounts = {
    all: mockCollabs.length,
    pending: mockCollabs.filter((c) => getCollabCategory(c.status) === "pending")
      .length,
    active: mockCollabs.filter((c) => getCollabCategory(c.status) === "active")
      .length,
    in_review: mockCollabs.filter(
      (c) => getCollabCategory(c.status) === "in_review"
    ).length,
    completed: mockCollabs.filter(
      (c) => getCollabCategory(c.status) === "completed"
    ).length,
  };

  // Count invites vs applications in pending
  const pendingInvites = mockCollabs.filter(
    (c) => c.status === "invited"
  ).length;
  const pendingApplications = mockCollabs.filter(
    (c) => c.status === "applied"
  ).length;

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-black/95 p-6 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <h1 className="mb-2 text-2xl font-bold text-white">
            My Collaborations
          </h1>
          <p className="text-sm text-gray-400">
            Track your exchange journey
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-[97px] z-10 border-b border-gray-800 bg-black/95 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <div className="hide-scrollbar flex gap-2 overflow-x-auto px-6 py-4">
            {tabs.map((tab) => {
              const isSelected = selectedTab === tab.id;
              const count = categoryCounts[tab.id];

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    isSelected
                      ? `bg-${tab.color} text-black`
                      : "border border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600"
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor:
                            tab.color === "brand-cyan"
                              ? "#75FBDE"
                              : tab.color === "yellow-400"
                              ? "#facc15"
                              : tab.color === "blue-400"
                              ? "#60a5fa"
                              : tab.color === "orange-400"
                              ? "#fb923c"
                              : "#4ade80",
                        }
                      : undefined
                  }
                >
                  {tab.icon}
                  {tab.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs ${
                      isSelected
                        ? "bg-black/20 text-black"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-lg space-y-4 px-6 py-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-3 rounded-2xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center gap-1 text-xl font-bold text-yellow-400">
              <Send className="h-4 w-4" />
              {pendingApplications}
            </div>
            <div className="text-[10px] text-gray-500">Applied</div>
          </div>
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center gap-1 text-xl font-bold text-brand-magenta">
              <Mail className="h-4 w-4" />
              {pendingInvites}
            </div>
            <div className="text-[10px] text-gray-500">Invites</div>
          </div>
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center gap-1 text-xl font-bold text-blue-400">
              <Sparkles className="h-4 w-4" />
              {categoryCounts.active}
            </div>
            <div className="text-[10px] text-gray-500">Active</div>
          </div>
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center gap-1 text-xl font-bold text-green-400">
              <CheckCircle className="h-4 w-4" />
              {categoryCounts.completed}
            </div>
            <div className="text-[10px] text-gray-500">Done</div>
          </div>
        </div>

        {/* Section Title */}
        {selectedTab !== "all" && (
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">
              {tabs.find((t) => t.id === selectedTab)?.label} (
              {filteredCollabs.length})
            </h2>
          </div>
        )}

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
              {selectedTab === "pending" && (
                <Clock className="h-16 w-16 text-yellow-400" />
              )}
              {selectedTab === "active" && (
                <Sparkles className="h-16 w-16 text-blue-400" />
              )}
              {selectedTab === "in_review" && (
                <Eye className="h-16 w-16 text-orange-400" />
              )}
              {selectedTab === "completed" && (
                <CheckCircle className="h-16 w-16 text-green-400" />
              )}
              {selectedTab === "all" && (
                <Sparkles className="h-16 w-16 text-brand-cyan" />
              )}
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              No {selectedTab !== "all" ? selectedTab.replace("_", " ") : ""}{" "}
              collaborations
            </h3>
            <p className="text-gray-400">
              {selectedTab === "all"
                ? "Start applying to offers to see them here"
                : selectedTab === "pending"
                ? "No pending applications or invitations"
                : selectedTab === "active"
                ? "No active collaborations right now"
                : selectedTab === "in_review"
                ? "No content waiting for review"
                : "Complete your first collaboration!"}
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
