"use client";

import Link from "next/link";
import { useState } from "react";
import { User, Building2, ArrowRight } from "lucide-react";
import ChatbotFAB from "@/components/ui/ChatbotFAB";

type UserType = "creator" | "business" | null;

interface UserTypeOption {
  id: UserType;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
}

const userTypeOptions: UserTypeOption[] = [
  {
    id: "creator",
    title: "I'm a Creator",
    subtitle: "Influencer / Content Creator",
    description: "Looking for brand deals and content opportunities",
    icon: <User className="h-8 w-8" />,
    href: "/onboarding/location?type=creator",
    accentColor: "brand-cyan",
    gradientFrom: "#75FBDE",
    gradientTo: "#3B82F6",
  },
  {
    id: "business",
    title: "I'm a Business",
    subtitle: "Brand / Company",
    description: "Looking for creators to promote my products or services",
    icon: <Building2 className="h-8 w-8" />,
    href: "/onboarding/location?type=business",
    accentColor: "brand-magenta",
    gradientFrom: "#EA33E9",
    gradientTo: "#662D91",
  },
];

export default function SelectTypePage() {
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const [hoveredType, setHoveredType] = useState<UserType>(null);

  const selectedOption = userTypeOptions.find((opt) => opt.id === selectedType);

  return (
    <div className="relative flex min-h-screen flex-col bg-black overflow-hidden">
      {/* Video/Image Background with overlay */}
      <div className="absolute inset-0">
        {/* Animated gradient background simulating video */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 via-black to-brand-cyan/10 animate-pulse-slow" />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
      </div>

      {/* Decorative glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-brand-purple/20 blur-[128px]" />
      <div className="absolute bottom-1/3 left-0 h-64 w-64 rounded-full bg-brand-cyan/15 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-brand-magenta/15 blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-6">
        {/* Header */}
        <div className="text-center w-full max-w-md">
          <p className="text-sm font-medium text-brand-cyan uppercase tracking-wider mb-2">
            Welcome to Influfinder
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            How will you use the platform?
          </h1>
          <p className="mt-3 text-base text-gray-400">
            Select your account type to get started
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 py-8 w-full max-w-md">
          {userTypeOptions.map((option) => {
            const isSelected = selectedType === option.id;
            const isHovered = hoveredType === option.id;

            return (
              <button
                key={option.id}
                onClick={() => setSelectedType(option.id)}
                onMouseEnter={() => setHoveredType(option.id)}
                onMouseLeave={() => setHoveredType(null)}
                className={`group relative w-full overflow-hidden rounded-2xl p-5 transition-all duration-300 ${
                  isSelected
                    ? "scale-[1.02]"
                    : "hover:scale-[1.01]"
                }`}
                style={{
                  boxShadow: isSelected
                    ? `0 0 0 2px ${option.gradientFrom}`
                    : undefined,
                }}
              >
                {/* Background */}
                <div
                  className={`absolute inset-0 transition-all duration-300 ${
                    isSelected
                      ? "opacity-100"
                      : "opacity-80 group-hover:opacity-90"
                  }`}
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${option.gradientFrom}20, ${option.gradientTo}10)`
                      : "rgba(17, 17, 17, 0.9)",
                  }}
                />

                {/* Gradient border on selection */}
                {isSelected && (
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      padding: "2px",
                      background: `linear-gradient(135deg, ${option.gradientFrom}, ${option.gradientTo})`,
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />
                )}

                {/* Content */}
                <div className="relative flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-all duration-300`}
                    style={{
                      backgroundColor: isSelected
                        ? `${option.gradientFrom}30`
                        : "rgba(38, 38, 38, 1)",
                      color: option.gradientFrom,
                    }}
                  >
                    {option.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="text-lg font-bold text-white">
                      {option.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1">{option.subtitle}</p>
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {option.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight
                    className={`h-5 w-5 shrink-0 transition-all duration-300 ${
                      isSelected || isHovered
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-2 opacity-0"
                    }`}
                    style={{ color: option.gradientFrom }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer with CTA */}
        <div className="pt-4 space-y-4 w-full max-w-md">
          {/* Continue Button */}
          <Link
            href={selectedOption?.href || "#"}
            onClick={(e) => !selectedType && e.preventDefault()}
            className={`block w-full rounded-full px-8 py-4 text-center font-semibold text-lg transition-all duration-300 ${
              selectedType
                ? "bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-magenta text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-purple/30 active:scale-[0.98]"
                : "bg-gray-900 text-gray-600 cursor-not-allowed"
            }`}
          >
            {selectedType ? "Continue" : "Select an option"}
          </Link>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/onboarding/login"
              className="text-brand-cyan hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Chatbot FAB */}
      <ChatbotFAB bottomOffset={96} showNotification={true} />
    </div>
  );
}
