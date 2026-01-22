"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Eye, EyeOff, ChevronDown, Loader2, Globe, Phone } from "lucide-react";
import { countries, Country } from "@/lib/countries";
import { industries } from "@/lib/industries";

export default function BusinessRegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    website: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!selectedIndustry) {
      newErrors.industry = "Please select an industry";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/onboarding/business/success";
    }, 1500);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-black">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/15 via-black to-brand-purple/10" />

      {/* Fixed Header */}
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-xl p-6 pb-4">
        {/* Back Button */}
        <Link
          href="/onboarding/business/login"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </Link>

        {/* Header */}
        <div className="text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-magenta/20">
              <Building2 className="h-6 w-6 text-brand-magenta" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">
            Register Your Business
          </h1>
          <p className="text-sm text-gray-400">
            Create your business account
          </p>
        </div>
      </div>

      {/* Scrollable Form */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className={`w-full rounded-2xl border bg-gray-900/80 px-4 py-3.5 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 ${
                errors.companyName
                  ? "border-red-500 focus:ring-red-500/50"
                  : "border-gray-700 focus:border-brand-magenta focus:ring-brand-magenta/50"
              }`}
              placeholder="Your company name"
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-400">{errors.companyName}</p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Industry *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                className={`w-full rounded-2xl border bg-gray-900/80 px-4 py-3.5 text-left transition-all focus:outline-none focus:ring-2 ${
                  errors.industry
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-gray-700 focus:border-brand-magenta focus:ring-brand-magenta/50"
                }`}
              >
                <span className="flex items-center justify-between">
                  <span className={selectedIndustry ? "text-white" : "text-gray-500"}>
                    {selectedIndustry
                      ? industries.find((i) => i.id === selectedIndustry)?.label
                      : "Select your industry"}
                  </span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showIndustryDropdown ? "rotate-180" : ""}`} />
                </span>
              </button>

              {showIndustryDropdown && (
                <div className="absolute z-30 mt-2 w-full rounded-2xl border border-gray-700 bg-gray-900 shadow-xl max-h-48 overflow-y-auto">
                  {industries.map((industry) => (
                    <button
                      key={industry.id}
                      type="button"
                      onClick={() => {
                        setSelectedIndustry(industry.id);
                        setShowIndustryDropdown(false);
                      }}
                      className="flex w-full items-center px-4 py-3 text-left text-white hover:bg-gray-800 transition-colors"
                    >
                      {industry.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.industry && (
              <p className="mt-1 text-sm text-red-400">{errors.industry}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Business Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full rounded-2xl border bg-gray-900/80 px-4 py-3.5 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500/50"
                  : "border-gray-700 focus:border-brand-magenta focus:ring-brand-magenta/50"
              }`}
              placeholder="business@company.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full rounded-2xl border bg-gray-900/80 px-4 py-3.5 pr-12 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-gray-700 focus:border-brand-magenta focus:ring-brand-magenta/50"
                }`}
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full rounded-2xl border bg-gray-900/80 px-4 py-3.5 pr-12 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-gray-700 focus:border-brand-magenta focus:ring-brand-magenta/50"
                }`}
                placeholder="Repeat your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Website (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Website <span className="text-gray-500">(optional)</span>
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full rounded-2xl border border-gray-700 bg-gray-900/80 pl-12 pr-4 py-3.5 text-white placeholder-gray-500 transition-all focus:border-brand-magenta focus:outline-none focus:ring-2 focus:ring-brand-magenta/50"
                placeholder="https://yourcompany.com"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Country <span className="text-gray-500">(optional)</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="w-full rounded-2xl border border-gray-700 bg-gray-900/80 px-4 py-3.5 text-left transition-all focus:border-brand-magenta focus:outline-none focus:ring-2 focus:ring-brand-magenta/50"
              >
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    {selectedCountry ? (
                      <>
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span className="text-white">{selectedCountry.name}</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Select country</span>
                    )}
                  </span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showCountryDropdown ? "rotate-180" : ""}`} />
                </span>
              </button>

              {showCountryDropdown && (
                <div className="absolute z-30 mt-2 w-full rounded-2xl border border-gray-700 bg-gray-900 shadow-xl">
                  <div className="p-3 border-b border-gray-800">
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-brand-magenta focus:outline-none"
                      placeholder="Search..."
                      autoFocus
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(country);
                          setShowCountryDropdown(false);
                          setCountrySearch("");
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-white hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="text-sm">{country.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone <span className="text-gray-500">(optional)</span>
            </label>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 rounded-2xl border border-gray-700 bg-gray-900/80 px-3 py-3.5">
                <span className="text-lg">{selectedCountry?.flag || "🌎"}</span>
                <span className="text-sm text-gray-400">{selectedCountry?.phoneCode || "+1"}</span>
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                className="flex-1 rounded-2xl border border-gray-700 bg-gray-900/80 px-4 py-3.5 text-white placeholder-gray-500 transition-all focus:border-brand-magenta focus:outline-none focus:ring-2 focus:ring-brand-magenta/50"
                placeholder="Phone number"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-brand-magenta via-brand-purple to-brand-cyan px-6 py-4 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-brand-purple/30 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Business Account"
              )}
            </button>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-400 pt-2">
            By registering, you agree to our{" "}
            <span className="text-brand-magenta hover:underline cursor-pointer">Business Terms</span> and{" "}
            <span className="text-brand-magenta hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </form>
      </div>
    </div>
  );
}
