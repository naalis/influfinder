"use client";

import { Heart, AlertTriangle, X, Shield, Info } from "lucide-react";

interface Strike {
  id: string;
  reason: string;
  date: string;
  severity: "warning" | "strike";
}

interface HealthStatusProps {
  strikes: Strike[];
  maxStrikes?: number;
  showDetails?: boolean;
}

export default function HealthStatus({
  strikes,
  maxStrikes = 3,
  showDetails = true,
}: HealthStatusProps) {
  const strikeCount = strikes.filter((s) => s.severity === "strike").length;
  const warningCount = strikes.filter((s) => s.severity === "warning").length;
  const healthPercentage = Math.max(0, ((maxStrikes - strikeCount) / maxStrikes) * 100);

  const getHealthColor = () => {
    if (strikeCount === 0) return "text-green-400";
    if (strikeCount === 1) return "text-yellow-400";
    if (strikeCount === 2) return "text-orange-400";
    return "text-red-400";
  };

  const getHealthLabel = () => {
    if (strikeCount === 0) return "Excellent";
    if (strikeCount === 1) return "Good";
    if (strikeCount === 2) return "At Risk";
    return "Critical";
  };

  return (
    <div className="space-y-4">
      {/* Health Overview */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-cyan" />
            <span className="font-semibold text-white">Account Health</span>
          </div>
          <span className={`font-semibold ${getHealthColor()}`}>
            {getHealthLabel()}
          </span>
        </div>

        {/* Health Bar */}
        <div className="mb-4">
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                strikeCount === 0
                  ? "bg-green-400"
                  : strikeCount === 1
                  ? "bg-yellow-400"
                  : strikeCount === 2
                  ? "bg-orange-400"
                  : "bg-red-400"
              }`}
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {/* Strike Indicators */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {[...Array(maxStrikes)].map((_, index) => (
              <div
                key={index}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                  index < strikeCount
                    ? "border-red-500 bg-red-500/20"
                    : "border-gray-700 bg-gray-800"
                }`}
              >
                {index < strikeCount ? (
                  <X className="h-4 w-4 text-red-400" />
                ) : (
                  <Heart className="h-4 w-4 text-gray-600" />
                )}
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-400">
            {strikeCount} / {maxStrikes} strikes
          </span>
        </div>

        {/* Warning if at risk */}
        {strikeCount >= 2 && (
          <div className="mt-4 flex items-start gap-3 rounded-xl bg-red-500/10 p-4">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <div className="text-sm">
              <div className="font-semibold text-red-400">Account at Risk</div>
              <div className="text-gray-400">
                One more strike will result in account suspension
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Strike History */}
      {showDetails && strikes.length > 0 && (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <Info className="h-5 w-5 text-gray-400" />
            Recent Issues
          </h3>
          <div className="space-y-3">
            {strikes.map((strike) => (
              <div
                key={strike.id}
                className={`flex items-start gap-3 rounded-xl p-3 ${
                  strike.severity === "strike"
                    ? "bg-red-500/10 border border-red-500/30"
                    : "bg-yellow-500/10 border border-yellow-500/30"
                }`}
              >
                {strike.severity === "strike" ? (
                  <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-400" />
                )}
                <div className="flex-1">
                  <div
                    className={`font-medium ${
                      strike.severity === "strike"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {strike.severity === "strike" ? "Strike" : "Warning"}
                  </div>
                  <div className="text-sm text-gray-300">{strike.reason}</div>
                  <div className="mt-1 text-xs text-gray-500">{strike.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Good Standing */}
      {strikes.length === 0 && (
        <div className="flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/30 p-4">
          <Shield className="h-6 w-6 text-green-400" />
          <div>
            <div className="font-semibold text-green-400">Great Standing!</div>
            <div className="text-sm text-gray-400">
              Your account is in excellent health with no issues
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
