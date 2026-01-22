import Link from "next/link";
import { ComponentType } from "react";
import type { Offer } from "@/lib/mockOffers";
import { MapPin } from "lucide-react";
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

const iconMap: Record<string, ComponentType<IconComponentProps>> = {
  dining: DiningIcon,
  fitness: FitnessIcon,
  wellness: WellnessIcon,
  fashion: FashionIcon,
  travel: TravelIcon,
  beauty: BeautyIcon,
  tech: TechIcon,
  home: HomeIcon,
};

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const Icon = iconMap[offer.businessLogo] || AllCategoriesIcon;

  return (
    <Link href={`/offer/${offer.id}`}>
      <div className="group overflow-hidden rounded-2xl bg-gray-900 transition-all hover:scale-[1.02] active:scale-[0.98]">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-800">
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundImage: `url(${offer.imageUrl})`,
            }}
          />

          {/* Badge Overlay */}
          <div className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 backdrop-blur-sm">
            <span className="text-xs font-semibold text-brand-cyan">
              ${offer.estimatedValue}
            </span>
          </div>

          {/* Category Badge */}
          <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 backdrop-blur-sm">
            <span className="text-xs font-medium text-white">
              {offer.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Business Info */}
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800">
              <Icon size={16} color="#75FBDE" />
            </div>
            <span className="text-sm font-semibold text-gray-300">
              {offer.businessName}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white">
            {offer.title}
          </h3>

          {/* Description */}
          <p className="mb-3 line-clamp-2 text-sm text-gray-400">
            {offer.description}
          </p>

          {/* Footer Info */}
          <div className="flex items-center justify-between border-t border-gray-800 pt-3">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {offer.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {offer.location}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {offer.applicants} applied
              </span>
              <div className="rounded-full bg-brand-cyan px-3 py-1.5 text-xs font-semibold text-black transition-colors group-hover:bg-brand-cyan/90">
                View
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
