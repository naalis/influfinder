"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Loader2, User } from "lucide-react";
import { countries, Country } from "@/lib/countries";

export default function ProfileSetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phone: "",
  });

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      window.location.href = "/onboarding/connect-instagram";
    }, 1500);
  };

  const handleSkip = () => {
    window.location.href = "/onboarding/connect-instagram";
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-black p-6">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/10 via-black to-brand-magenta/10" />

      {/* Skip Button */}
      <div className="relative z-10 flex justify-end pt-4">
        <button
          onClick={handleSkip}
          className="text-sm text-gray-400 hover:text-brand-cyan transition-colors"
        >
          Skip for now
        </button>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-4 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan/20 to-brand-magenta/20">
            <User className="h-8 w-8 text-brand-cyan" />
          </div>
        </div>
        <h1 className="mb-3 text-3xl font-bold text-white">
          Complete Your Profile
        </h1>
        <p className="text-gray-300">
          Help us personalize your experience
        </p>
      </div>

      {/* Form */}
      <div className="relative z-10 flex-1 flex items-center py-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full rounded-2xl border border-gray-700 bg-gray-900/80 px-4 py-4 text-white placeholder-gray-500 transition-all focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
              placeholder="Your full name"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                className="w-full rounded-2xl border border-gray-700 bg-gray-900/80 pl-9 pr-4 py-4 text-white placeholder-gray-500 transition-all focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                placeholder="username"
              />
            </div>
          </div>

          {/* Country Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Country <span className="text-gray-500">(optional)</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="w-full rounded-2xl border border-gray-700 bg-gray-900/80 px-4 py-4 text-left text-white transition-all focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
              >
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    {selectedCountry ? (
                      <>
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span>{selectedCountry.name}</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Select your country</span>
                    )}
                  </span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showCountryDropdown ? "rotate-180" : ""}`} />
                </span>
              </button>

              {/* Dropdown */}
              {showCountryDropdown && (
                <div className="absolute z-20 mt-2 w-full rounded-2xl border border-gray-700 bg-gray-900 shadow-xl">
                  {/* Search */}
                  <div className="p-3 border-b border-gray-800">
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none"
                      placeholder="Search countries..."
                      autoFocus
                    />
                  </div>
                  {/* List */}
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(country);
                          setShowCountryDropdown(false);
                          setCountrySearch("");
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-white hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-xl">{country.flag}</span>
                        <span>{country.name}</span>
                        <span className="ml-auto text-sm text-gray-500">{country.phoneCode}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number <span className="text-gray-500">(optional)</span>
            </label>
            <div className="flex gap-2">
              {/* Country Code */}
              <div className="flex items-center gap-2 rounded-2xl border border-gray-700 bg-gray-900/80 px-4 py-4 text-white">
                <span className="text-lg">{selectedCountry?.flag || "🌎"}</span>
                <span className="text-gray-400">{selectedCountry?.phoneCode || "+1"}</span>
              </div>
              {/* Phone Input */}
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                className="flex-1 rounded-2xl border border-gray-700 bg-gray-900/80 px-4 py-4 text-white placeholder-gray-500 transition-all focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                placeholder="Phone number"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-magenta px-6 py-4 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-brand-purple/30 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </span>
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </div>

      {/* Progress Indicator */}
      <div className="relative z-10 flex justify-center gap-2 pb-4">
        <div className="h-2 w-8 rounded-full bg-brand-cyan"></div>
        <div className="h-2 w-2 rounded-full bg-gray-700"></div>
        <div className="h-2 w-2 rounded-full bg-gray-700"></div>
        <div className="h-2 w-2 rounded-full bg-gray-700"></div>
      </div>
    </div>
  );
}
