"use client";

import { CheckCircle, Plus, ExternalLink } from "lucide-react";

interface SocialAccount {
  platform: "instagram" | "tiktok" | "youtube";
  username?: string;
  followers?: number;
  engagementRate?: number;
  verified?: boolean;
  connected: boolean;
}

interface ConnectedAccountsProps {
  accounts: SocialAccount[];
  onConnect?: (platform: string) => void;
}

// Platform configurations
const platformConfig = {
  instagram: {
    name: "Instagram",
    color: "from-purple-500 via-pink-500 to-orange-400",
    bgColor: "bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-orange-400/20",
    borderColor: "border-pink-500/30",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  tiktok: {
    name: "TikTok",
    color: "from-black via-gray-800 to-black",
    bgColor: "bg-gradient-to-tr from-[#00f2ea]/20 via-black/20 to-[#ff0050]/20",
    borderColor: "border-[#00f2ea]/30",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
  youtube: {
    name: "YouTube",
    color: "from-red-600 to-red-700",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
};

function formatFollowers(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export default function ConnectedAccounts({
  accounts,
  onConnect,
}: ConnectedAccountsProps) {
  const allPlatforms: SocialAccount["platform"][] = ["instagram", "tiktok", "youtube"];

  // Create a map of connected accounts
  const accountMap = new Map(accounts.map((a) => [a.platform, a]));

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">Connected Accounts</h3>
        <span className="text-sm text-gray-500">
          {accounts.filter((a) => a.connected).length} / {allPlatforms.length}
        </span>
      </div>

      <div className="space-y-3">
        {allPlatforms.map((platform) => {
          const account = accountMap.get(platform);
          const config = platformConfig[platform];
          const isConnected = account?.connected;

          return (
            <div
              key={platform}
              className={`relative overflow-hidden rounded-xl border transition-all ${
                isConnected
                  ? `${config.bgColor} ${config.borderColor}`
                  : "border-gray-800 bg-gray-900/30"
              }`}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {/* Platform Icon */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isConnected
                        ? `bg-gradient-to-tr ${config.color} text-white`
                        : "bg-gray-800 text-gray-500"
                    }`}
                  >
                    {config.icon}
                  </div>

                  {/* Platform Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isConnected ? "text-white" : "text-gray-400"}`}>
                        {config.name}
                      </span>
                      {isConnected && account?.verified && (
                        <span className="flex items-center gap-1 rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    {isConnected && account?.username && (
                      <span className="text-sm text-gray-400">@{account.username}</span>
                    )}
                  </div>
                </div>

                {/* Stats or Connect Button */}
                {isConnected ? (
                  <div className="flex items-center gap-4">
                    {account?.followers && (
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">
                          {formatFollowers(account.followers)}
                        </div>
                        <div className="text-[10px] text-gray-500">Followers</div>
                      </div>
                    )}
                    {account?.engagementRate && (
                      <div className="text-right">
                        <div className="text-sm font-semibold text-brand-cyan">
                          {account.engagementRate}%
                        </div>
                        <div className="text-[10px] text-gray-500">Eng. Rate</div>
                      </div>
                    )}
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800/50 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onConnect?.(platform)}
                    className="flex items-center gap-1.5 rounded-full bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Benefits Note */}
      <p className="mt-4 text-center text-xs text-gray-500">
        Connect more accounts to increase your visibility and get better offers
      </p>
    </div>
  );
}
