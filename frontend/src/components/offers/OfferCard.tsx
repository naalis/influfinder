"use client";

import Link from "next/link";
import { ComponentType, useState } from "react";
import type { Offer } from "@/lib/mockOffers";
import { MapPin, Heart, Clock, Users, Gift, Camera, Star } from "lucide-react";
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
  variant?: "default" | "compact" | "featured";
  isVerifiedInfluencer?: boolean;
}

export default function OfferCard({
  offer,
  variant = "default",
  isVerifiedInfluencer = false
}: OfferCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const Icon = iconMap[offer.businessLogo] || AllCategoriesIcon;

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  // Determine if this is an invitation-only offer
  const isInvitationOnly = offer.offerType === "invitation";
  const canApply = offer.offerType === "both" || offer.offerType === "application";

  if (variant === "compact") {
    return (
      <Link href={`/offer/${offer.id}`}>
        <div className="group flex gap-4 rounded-2xl border border-gray-800 bg-gray-900/80 p-3 transition-all hover:border-brand-cyan/30 hover:bg-gray-900 active:scale-[0.98]">
          {/* Thumbnail */}
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-800">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${offer.imageUrl})` }}
            />
            {isInvitationOnly && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Star className="h-4 w-4 text-brand-magenta" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-medium text-brand-cyan">
                  <Gift className="h-3 w-3" />
                  {offer.whatYouGet}
                </span>
              </div>
              <h3 className="line-clamp-1 text-sm font-semibold text-white">
                {offer.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{offer.businessName}</span>
              {isInvitationOnly && (
                <span className="rounded-full bg-brand-magenta/20 px-2 py-0.5 text-[10px] font-medium text-brand-magenta">
                  Invite Only
                </span>
              )}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center self-center"
          >
            <Heart
              className={`h-5 w-5 transition-all ${
                isSaved ? "fill-brand-magenta text-brand-magenta" : "text-gray-600 hover:text-brand-magenta"
              }`}
            />
          </button>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/offer/${offer.id}`}>
      <div className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition-all hover:border-brand-cyan/30 hover:shadow-lg hover:shadow-brand-cyan/5 active:scale-[0.98]">
        {/* Gradient border effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-cyan/20 via-brand-purple/10 to-brand-magenta/20 opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-800">
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: `url(${offer.imageUrl})`,
            }}
          />

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top badges row */}
          <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
            {/* Category Badge */}
            <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md">
              <Icon size={14} color="#75FBDE" />
              <span className="text-xs font-medium text-white">
                {offer.category}
              </span>
            </div>

            {/* Badges row */}
            <div className="flex items-center gap-2">
              {/* Invitation Only Badge */}
              {isInvitationOnly && (
                <div className="flex items-center gap-1 rounded-full bg-brand-magenta/80 px-2.5 py-1 backdrop-blur-md">
                  <Star className="h-3 w-3 text-white" />
                  <span className="text-[10px] font-semibold text-white">
                    Invite Only
                  </span>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md transition-all hover:bg-black/80"
              >
                <Heart
                  className={`h-5 w-5 transition-all ${
                    isSaved ? "fill-brand-magenta text-brand-magenta scale-110" : "text-white hover:text-brand-magenta"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Bottom info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between">
              {/* Business info */}
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/60 backdrop-blur-md">
                  <Icon size={20} color="#75FBDE" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white">
                    {offer.businessName}
                  </span>
                  {offer.location && (
                    <div className="flex items-center gap-1 text-xs text-gray-300">
                      <MapPin className="h-3 w-3" />
                      {offer.location}
                    </div>
                  )}
                </div>
              </div>

              {/* What You Get Badge */}
              <div className="rounded-xl bg-gradient-to-r from-brand-cyan to-brand-cyan/80 px-3 py-2 shadow-lg shadow-brand-cyan/20">
                <div className="flex items-center gap-1.5">
                  <Gift className="h-4 w-4 text-black" />
                  <span className="text-xs font-bold text-black">
                    FREE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-4">
          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white group-hover:text-brand-cyan transition-colors">
            {offer.title}
          </h3>

          {/* What You Get */}
          <div className="mb-3 flex items-start gap-2 rounded-lg bg-brand-cyan/10 p-2.5">
            <Gift className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
            <div>
              <p className="text-xs font-medium text-brand-cyan">What you get</p>
              <p className="text-sm text-white">{offer.whatYouGet}</p>
            </div>
          </div>

          {/* Content Required */}
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-brand-magenta/10 p-2.5">
            <Camera className="mt-0.5 h-4 w-4 shrink-0 text-brand-magenta" />
            <div>
              <p className="text-xs font-medium text-brand-magenta">Content required</p>
              <p className="text-sm text-white">{offer.contentSummary}</p>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-brand-purple" />
                <span>{offer.applicants} interested</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand-purple" />
                <span>2 days left</span>
              </span>
            </div>

            {/* CTA */}
            <div className={`rounded-full px-4 py-2 text-xs font-semibold transition-all group-hover:shadow-lg ${
              isInvitationOnly
                ? "bg-gradient-to-r from-brand-magenta to-brand-purple text-white group-hover:shadow-brand-magenta/30"
                : "bg-gradient-to-r from-brand-cyan to-brand-cyan/80 text-black group-hover:shadow-brand-cyan/30"
            }`}>
              {isInvitationOnly ? "View Invite" : "Apply Now"}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
