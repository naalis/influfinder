"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-6 gradient-primary">
      {/* Logo Area */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className={`text-center transition-all duration-1000 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Logo (includes isotipo) */}
          <div className="mb-8">
            <img
              src="/logo-white.png"
              alt="Influfinder"
              className="mx-auto w-64"
            />
          </div>

          <p className="text-xl text-white/90 max-w-sm mx-auto">
            Making <span className="font-display italic">collaborations</span> simple
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div
        className={`w-full max-w-md transition-all duration-1000 delay-300 ${
          mounted
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <Link
          href="/onboarding/select-type"
          className="block w-full rounded-full bg-white px-8 py-4 text-center text-lg font-semibold text-black transition-all hover:scale-105 active:scale-95"
        >
          Get Started
        </Link>

        <p className="mt-4 text-center text-sm text-white/70">
          Join thousands of creators
        </p>
      </div>
    </div>
  );
}
