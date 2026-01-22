"use client";

import Link from "next/link";
import { useState } from "react";
import { User, Building2, ArrowRight } from "lucide-react";

type UserType = "creator" | "business" | null;

export default function SelectTypePage() {
  const [selectedType, setSelectedType] = useState<UserType>(null);

  return (
    <div className="relative flex min-h-screen flex-col bg-black p-6">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/15 via-brand-purple/20 to-brand-cyan/15" />

      {/* Subtle glow effects */}
      <div className="absolute top-1/4 left-0 h-64 w-64 rounded-full bg-brand-magenta/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-brand-cyan/20 blur-3xl" />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Header */}
        <div className="pt-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">
            How will you use Influfinder?
          </h1>
          <p className="text-lg text-gray-300">
            Select your account type to get started
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8">
          {/* Creator Option */}
          <button
            onClick={() => setSelectedType("creator")}
            className={`group relative w-full max-w-md overflow-hidden rounded-3xl p-6 transition-all duration-300 ${
              selectedType === "creator"
                ? "scale-[1.02] ring-2 ring-brand-cyan"
                : "hover:scale-[1.01]"
            }`}
          >
            {/* Background */}
            <div className={`absolute inset-0 transition-all duration-300 ${
              selectedType === "creator"
                ? "bg-gradient-to-br from-brand-cyan/30 via-brand-purple/20 to-brand-cyan/10"
                : "bg-gray-900/80 group-hover:bg-gray-800/80"
            }`} />

            {/* Gradient border */}
            <div className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${
              selectedType === "creator" ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            }`} style={{
              padding: '2px',
              background: 'linear-gradient(135deg, #75FBDE, #662D91)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }} />

            {/* Content */}
            <div className="relative flex items-center gap-5">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                selectedType === "creator"
                  ? "bg-brand-cyan/30"
                  : "bg-gray-800 group-hover:bg-gray-700"
              }`}>
                <User className={`h-8 w-8 transition-colors duration-300 ${
                  selectedType === "creator" ? "text-brand-cyan" : "text-brand-cyan"
                }`} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="mb-1 text-xl font-bold text-white">
                  I'm a Creator
                </h3>
                <p className="text-sm text-gray-400">
                  Looking for offers and brand collaborations
                </p>
              </div>
              <ArrowRight className={`h-6 w-6 transition-all duration-300 ${
                selectedType === "creator"
                  ? "text-brand-cyan translate-x-0 opacity-100"
                  : "text-gray-600 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`} />
            </div>
          </button>

          {/* Business Option */}
          <button
            onClick={() => setSelectedType("business")}
            className={`group relative w-full max-w-md overflow-hidden rounded-3xl p-6 transition-all duration-300 ${
              selectedType === "business"
                ? "scale-[1.02] ring-2 ring-brand-magenta"
                : "hover:scale-[1.01]"
            }`}
          >
            {/* Background */}
            <div className={`absolute inset-0 transition-all duration-300 ${
              selectedType === "business"
                ? "bg-gradient-to-br from-brand-magenta/30 via-brand-purple/20 to-brand-magenta/10"
                : "bg-gray-900/80 group-hover:bg-gray-800/80"
            }`} />

            {/* Gradient border */}
            <div className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${
              selectedType === "business" ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            }`} style={{
              padding: '2px',
              background: 'linear-gradient(135deg, #EA33E9, #662D91)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }} />

            {/* Content */}
            <div className="relative flex items-center gap-5">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                selectedType === "business"
                  ? "bg-brand-magenta/30"
                  : "bg-gray-800 group-hover:bg-gray-700"
              }`}>
                <Building2 className={`h-8 w-8 transition-colors duration-300 ${
                  selectedType === "business" ? "text-brand-magenta" : "text-brand-magenta"
                }`} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="mb-1 text-xl font-bold text-white">
                  I'm a Business
                </h3>
                <p className="text-sm text-gray-400">
                  Looking for creators to promote my brand
                </p>
              </div>
              <ArrowRight className={`h-6 w-6 transition-all duration-300 ${
                selectedType === "business"
                  ? "text-brand-magenta translate-x-0 opacity-100"
                  : "text-gray-600 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`} />
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <div className="pb-8">
          <Link
            href={
              selectedType === "creator"
                ? "/onboarding/login"
                : selectedType === "business"
                ? "/onboarding/business/login"
                : "#"
            }
            onClick={(e) => !selectedType && e.preventDefault()}
            className={`block w-full max-w-md mx-auto rounded-full px-8 py-4 text-center font-semibold transition-all ${
              selectedType
                ? "bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-magenta text-white hover:scale-105 hover:shadow-lg hover:shadow-brand-purple/30 active:scale-95"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            {selectedType ? "Continue" : "Select an option"}
          </Link>
        </div>
      </div>
    </div>
  );
}
