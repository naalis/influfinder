import Link from "next/link";
import { ComponentType } from "react";
import { Clock, Sparkles, CheckCircle } from "lucide-react";
import type { Collaboration } from "@/lib/mockCollabs";
import {
  AllCategoriesIcon,
  DiningIcon,
  FitnessIcon,
  WellnessIcon,
  FashionIcon,
  TravelIcon,
  BeautyIcon,
  TechIcon,
  HomeIcon,
} from "@/components/brand/BrandIcons";

interface IconComponentProps {
  className?: string;
  size?: number;
  color?: string;
}

const businessIconMap: Record<string, ComponentType<IconComponentProps>> = {
  dining: DiningIcon,
  fitness: FitnessIcon,
  wellness: WellnessIcon,
  fashion: FashionIcon,
  travel: TravelIcon,
  beauty: BeautyIcon,
  tech: TechIcon,
  home: HomeIcon,
};

interface CollabCardProps {
  collab: Collaboration;
}

const statusConfig = {
  pending: {
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30",
    label: "Pending",
    Icon: Clock,
  },
  active: {
    color: "text-brand-cyan",
    bgColor: "bg-brand-cyan/10",
    borderColor: "border-brand-cyan/30",
    label: "Active",
    Icon: Sparkles,
  },
  completed: {
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/30",
    label: "Completed",
    Icon: CheckCircle,
  },
};

export default function CollabCard({ collab }: CollabCardProps) {
  const config = statusConfig[collab.status];
  const BusinessIcon = businessIconMap[collab.businessLogo] || AllCategoriesIcon;

  return (
    <Link href={`/collab/${collab.id}`}>
      <div
        className={`overflow-hidden rounded-2xl border ${config.borderColor} bg-gray-900 transition-all hover:scale-[1.02] active:scale-[0.98]`}
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-800">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${collab.imageUrl})`,
            }}
          />

          {/* Status Badge */}
          <div className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full ${config.bgColor} border ${config.borderColor} px-3 py-1.5 backdrop-blur-sm`}>
            <config.Icon className={`h-3.5 w-3.5 ${config.color}`} />
            <span className={`text-xs font-semibold ${config.color}`}>
              {config.label}
            </span>
          </div>

          {/* Value Badge */}
          <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 backdrop-blur-sm">
            <span className="text-xs font-semibold text-brand-cyan">
              ${collab.value}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Business Info */}
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800">
              <BusinessIcon size={16} color="#75FBDE" />
            </div>
            <span className="text-sm font-semibold text-gray-300">
              {collab.businessName}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-3 line-clamp-1 text-lg font-bold text-white">
            {collab.title}
          </h3>

          {/* Dates and Action */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                Applied:{" "}
                {new Date(collab.appliedDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {collab.deadline && collab.status === "active" && (
                <span className="text-yellow-400">
                  Due:{" "}
                  {new Date(collab.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
              {collab.completedDate && (
                <span className="text-green-400">
                  Completed:{" "}
                  {new Date(collab.completedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            {/* Next Action */}
            {collab.nextAction && (
              <div className={`rounded-lg ${config.bgColor} px-3 py-2 text-center`}>
                <span className={`text-sm font-medium ${config.color}`}>
                  {collab.nextAction}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
