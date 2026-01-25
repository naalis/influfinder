"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  Navigation,
  Search,
  ChevronDown,
  Check,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import {
  countries,
  getCitiesForCountry,
  popularCities,
  getCountryByCode,
  type Country,
  type City,
} from "@/lib/locationData";

export default function LocationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get("type") || "creator";

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const countryRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter countries based on search
  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Get cities for selected country
  const availableCities = selectedCountry
    ? getCitiesForCountry(selectedCountry.code)
    : [];

  // Filter cities based on search
  const filteredCities = availableCities.filter((city) =>
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  // Handle geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding API (using a free service)
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
          );
          const data = await response.json();

          // Find country in our list
          const country = countries.find(
            (c) => c.code === data.countryCode || c.name === data.countryName
          );

          if (country) {
            setSelectedCountry(country);
            // Try to find city
            const cities = getCitiesForCountry(country.code);
            const city = cities.find(
              (c) =>
                c.name.toLowerCase() === data.city?.toLowerCase() ||
                c.name.toLowerCase() === data.locality?.toLowerCase()
            );
            if (city) {
              setSelectedCity(city);
            } else if (data.city || data.locality) {
              // Create a custom city entry
              setSelectedCity({
                name: data.city || data.locality,
                country: country.code,
              });
            }
          }
        } catch {
          setLocationError("Could not determine your location");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setLocationError("Unable to retrieve your location. Please select manually.");
        setIsLocating(false);
      }
    );
  };

  // Handle popular city selection
  const handlePopularCityClick = (city: City) => {
    const country = getCountryByCode(city.country);
    if (country) {
      setSelectedCountry(country);
      setSelectedCity(city);
    }
  };

  // Handle continue
  const handleContinue = () => {
    // Store location in localStorage for later use
    if (selectedCountry && selectedCity) {
      localStorage.setItem(
        "userLocation",
        JSON.stringify({
          country: selectedCountry,
          city: selectedCity,
        })
      );
    }

    // Navigate to next step based on user type
    if (userType === "business") {
      router.push("/onboarding/business/login");
    } else {
      router.push("/onboarding/login");
    }
  };

  const canContinue = selectedCountry && selectedCity;

  // Progress steps
  const totalSteps = userType === "creator" ? 5 : 4;
  const currentStep = 2;

  return (
    <div className="relative flex min-h-screen flex-col bg-black overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/20 via-black to-black" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-brand-cyan/20 blur-3xl" />
      <div className="absolute bottom-1/3 right-0 h-48 w-48 rounded-full bg-brand-magenta/15 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 px-6 pt-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Progress Indicator */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i < currentStep
                    ? "w-6 bg-brand-cyan"
                    : i === currentStep
                    ? "w-6 bg-brand-cyan/50"
                    : "w-1.5 bg-gray-700"
                }`}
              />
            ))}
          </div>

          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col px-6 pt-8">
        <div className="mx-auto w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-cyan/20">
                <MapPin className="h-8 w-8 text-brand-cyan" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Where are you located?
            </h1>
            <p className="text-gray-400">
              This helps us show you relevant opportunities nearby
            </p>
          </div>

          {/* Use Current Location Button */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-brand-cyan/50 bg-brand-cyan/10 px-6 py-4 text-brand-cyan transition-all hover:border-brand-cyan hover:bg-brand-cyan/20 active:scale-95 disabled:opacity-50"
          >
            {isLocating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-semibold">Detecting location...</span>
              </>
            ) : (
              <>
                <Navigation className="h-5 w-5" />
                <span className="font-semibold">Use my current location</span>
              </>
            )}
          </button>

          {locationError && (
            <p className="mb-4 text-center text-sm text-red-400">{locationError}</p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gray-800" />
            <span className="text-sm text-gray-500">or select manually</span>
            <div className="h-px flex-1 bg-gray-800" />
          </div>

          {/* Country Dropdown */}
          <div ref={countryRef} className="relative mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Country
            </label>
            <button
              onClick={() => {
                setShowCountryDropdown(!showCountryDropdown);
                setShowCityDropdown(false);
              }}
              className={`flex w-full items-center justify-between rounded-2xl border bg-gray-900/80 px-4 py-4 text-left transition-all ${
                showCountryDropdown
                  ? "border-brand-cyan ring-2 ring-brand-cyan/50"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              {selectedCountry ? (
                <span className="flex items-center gap-2 text-white">
                  <span className="text-xl">{selectedCountry.flag}</span>
                  {selectedCountry.name}
                </span>
              ) : (
                <span className="text-gray-500">Select a country</span>
              )}
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  showCountryDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Country Dropdown Menu */}
            {showCountryDropdown && (
              <div className="absolute z-20 mt-2 w-full rounded-2xl border border-gray-700 bg-gray-900 shadow-xl">
                {/* Search */}
                <div className="p-3 border-b border-gray-800">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Search countries..."
                      className="w-full rounded-xl bg-gray-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                      autoFocus
                    />
                  </div>
                </div>
                {/* List */}
                <div className="max-h-60 overflow-y-auto p-2">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country);
                        setSelectedCity(null);
                        setShowCountryDropdown(false);
                        setCountrySearch("");
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        selectedCountry?.code === country.code
                          ? "bg-brand-cyan/20 text-brand-cyan"
                          : "text-white hover:bg-gray-800"
                      }`}
                    >
                      <span className="text-xl">{country.flag}</span>
                      <span className="flex-1">{country.name}</span>
                      {selectedCountry?.code === country.code && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <p className="py-4 text-center text-sm text-gray-500">
                      No countries found
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* City Dropdown */}
          <div ref={cityRef} className="relative mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              City
            </label>
            <button
              onClick={() => {
                if (selectedCountry) {
                  setShowCityDropdown(!showCityDropdown);
                  setShowCountryDropdown(false);
                }
              }}
              disabled={!selectedCountry}
              className={`flex w-full items-center justify-between rounded-2xl border bg-gray-900/80 px-4 py-4 text-left transition-all ${
                !selectedCountry
                  ? "opacity-50 cursor-not-allowed border-gray-800"
                  : showCityDropdown
                  ? "border-brand-cyan ring-2 ring-brand-cyan/50"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              {selectedCity ? (
                <span className="text-white">{selectedCity.name}</span>
              ) : (
                <span className="text-gray-500">
                  {selectedCountry ? "Select a city" : "Select a country first"}
                </span>
              )}
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  showCityDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* City Dropdown Menu */}
            {showCityDropdown && selectedCountry && (
              <div className="absolute z-20 mt-2 w-full rounded-2xl border border-gray-700 bg-gray-900 shadow-xl">
                {/* Search */}
                <div className="p-3 border-b border-gray-800">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      placeholder="Search cities..."
                      className="w-full rounded-xl bg-gray-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                      autoFocus
                    />
                  </div>
                </div>
                {/* List */}
                <div className="max-h-60 overflow-y-auto p-2">
                  {filteredCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowCityDropdown(false);
                        setCitySearch("");
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        selectedCity?.name === city.name
                          ? "bg-brand-cyan/20 text-brand-cyan"
                          : "text-white hover:bg-gray-800"
                      }`}
                    >
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="flex-1">{city.name}</span>
                      {selectedCity?.name === city.name && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                  {filteredCities.length === 0 && (
                    <p className="py-4 text-center text-sm text-gray-500">
                      No cities found
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Popular Cities */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-3">Popular cities</p>
            <div className="flex flex-wrap gap-2">
              {popularCities.slice(0, 8).map((city) => {
                const country = getCountryByCode(city.country);
                const isSelected =
                  selectedCity?.name === city.name &&
                  selectedCountry?.code === city.country;
                return (
                  <button
                    key={`${city.country}-${city.name}`}
                    onClick={() => handlePopularCityClick(city)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all ${
                      isSelected
                        ? "bg-brand-cyan text-black font-medium"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <span>{country?.flag}</span>
                    <span>{city.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 pb-8">
        <div className="mx-auto w-full max-w-md">
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`w-full rounded-full px-8 py-4 text-center font-semibold text-lg transition-all ${
              canContinue
                ? "bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-magenta text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-purple/30 active:scale-[0.98]"
                : "bg-gray-900 text-gray-600 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
