import Link from "next/link";
import { ComponentType } from "react";
import {
  Clock,
  Sparkles,
  CheckCircle,
  Gift,
  Mail,
  Send,
  Calendar,
  MapPin,
  Upload,
  Eye,
  Star,
} from "lucide-react";
import type { Collaboration, CollabStatus } from "@/lib/mockCollabs";
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

// Status configuration with icons, colors, and labels
const statusConfig: Record<
  CollabStatus,
  {
    color: string;
    bgColor: string;
    borderColor: string;
    label: string;
    Icon: ComponentType<{ className?: string }>;
  }
> = {
  applied: {
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30",
    label: "Applied",
    Icon: Send,
  },
  invited: {
    color: "text-brand-magenta",
    bgColor: "bg-brand-magenta/10",
    borderColor: "border-brand-magenta/30",
    label: "Invited",
    Icon: Mail,
  },
  accepted: {
    color: "text-brand-cyan",
    bgColor: "bg-brand-cyan/10",
    borderColor: "border-brand-cyan/30",
    label: "Accepted",
    Icon: CheckCircle,
  },
  scheduled: {
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
    label: "Scheduled",
    Icon: Calendar,
  },
  visited: {
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/30",
    label: "Visited",
    Icon: MapPin,
  },
  in_review: {
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/30",
    label: "In Review",
    Icon: Eye,
  },
  completed: {
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/30",
    label: "Completed",
    Icon: CheckCircle,
  },
  declined: {
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/30",
    label: "Declined",
    Icon: Clock,
  },
};

// Progress steps for visual indicator
const progressSteps: CollabStatus[] = [
  "applied", // or "invited"
  "accepted",
  "scheduled",
  "visited",
  "in_review",
  "completed",
];

function getProgressIndex(status: CollabStatus): number {
  if (status === "invited") return 0;
  if (status === "declined") return -1;
  return progressSteps.indexOf(status);
}

export default function CollabCard({ collab }: CollabCardProps) {
  const config = statusConfig[collab.status];
  const BusinessIcon = businessIconMap[collab.businessLogo] || AllCategoriesIcon;
  const progressIndex = getProgressIndex(collab.status);
  const isVip = collab.userType === "vip_influencer";

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
          <div
            className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full ${config.bgColor} border ${config.borderColor} px-3 py-1.5 backdrop-blur-sm`}
          >
            <config.Icon className={`h-3.5 w-3.5 ${config.color}`} />
            <span className={`text-xs font-semibold ${config.color}`}>
              {config.label}
            </span>
          </div>

          {/* VIP Influencer Badge */}
          {isVip && collab.status === "invited" && (
            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-brand-magenta px-2.5 py-1 backdrop-blur-sm">
              <Star className="h-3 w-3 text-white" />
              <span className="text-[10px] font-bold text-white">VIP INVITE</span>
            </div>
          )}

          {/* What You Get Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-brand-cyan px-3 py-1.5 backdrop-blur-sm">
            <Gift className="h-3 w-3 text-black" />
            <span className="text-xs font-bold text-black">FREE</span>
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
          <h3 className="mb-2 line-clamp-1 text-lg font-bold text-white">
            {collab.title}
          </h3>

          {/* What You Get & Content Required */}
          <div className="mb-3 flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1.5 text-brand-cyan">
              <Gift className="h-3 w-3" />
              <span className="line-clamp-1">{collab.whatYouGet}</span>
            </div>
            <div className="text-gray-500">
              Content: {collab.contentRequired}
            </div>
          </div>

          {/* Progress Bar */}
          {collab.status !== "declined" && (
            <div className="mb-3">
              <div className="flex items-center justify-between gap-1">
                {[0, 1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      step <= progressIndex
                        ? step === progressIndex
                          ? config.bgColor.replace("/10", "")
                          : "bg-gray-600"
                        : "bg-gray-800"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                <span>{collab.status === "invited" ? "Invited" : "Applied"}</span>
                <span>Completed</span>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            {collab.scheduledDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(collab.scheduledDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
            {collab.deadline && collab.status !== "completed" && (
              <span className="flex items-center gap-1 text-yellow-400">
                <Clock className="h-3 w-3" />
                Due{" "}
                {new Date(collab.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
            {collab.completedDate && (
              <span className="flex items-center gap-1 text-green-400">
                <CheckCircle className="h-3 w-3" />
                Completed{" "}
                {new Date(collab.completedDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>

          {/* Next Action */}
          {collab.nextAction && (
            <div
              className={`rounded-lg ${config.bgColor} px-3 py-2 text-center`}
            >
              <span className={`text-sm font-medium ${config.color}`}>
                {collab.nextAction}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
