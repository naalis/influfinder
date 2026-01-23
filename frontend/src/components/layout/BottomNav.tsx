"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Briefcase, User, LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
  activeColor: string;
}

const navItems: NavItem[] = [
  {
    href: "/home",
    label: "Home",
    Icon: Home,
    activeColor: "cyan",
  },
  {
    href: "/explore",
    label: "Explore",
    Icon: Compass,
    activeColor: "purple",
  },
  {
    href: "/collabs",
    label: "Collabs",
    Icon: Briefcase,
    activeColor: "magenta",
  },
  {
    href: "/profile",
    label: "Profile",
    Icon: User,
    activeColor: "cyan",
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  const getActiveColorClass = (color: string) => {
    switch (color) {
      case "magenta":
        return "text-brand-magenta";
      case "purple":
        return "text-brand-purple";
      default:
        return "text-brand-cyan";
    }
  };

  const getGlowStyle = (color: string) => {
    switch (color) {
      case "magenta":
        return { filter: "drop-shadow(0 0 10px #EA33E9)" };
      case "purple":
        return { filter: "drop-shadow(0 0 10px #662D91)" };
      default:
        return { filter: "drop-shadow(0 0 10px #75FBDE)" };
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Gradient border top */}
      <div className="h-px bg-gradient-to-r from-brand-magenta/50 via-brand-purple/50 to-brand-cyan/50" />

      {/* Nav background with blur */}
      <div className="bg-black/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const colorClass = getActiveColorClass(item.activeColor);
            const glowStyle = getGlowStyle(item.activeColor);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-2 py-3"
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-magenta" />
                )}

                {/* Icon container */}
                <div
                  className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gray-800/80"
                      : "group-hover:bg-gray-900"
                  }`}
                >
                  <item.Icon
                    className={`h-5 w-5 transition-all duration-300 ${
                      isActive
                        ? `${colorClass} scale-110`
                        : "text-gray-500 group-hover:text-gray-300"
                    }`}
                    style={isActive ? glowStyle : {}}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] font-medium transition-all duration-300 ${
                    isActive ? colorClass : "text-gray-500 group-hover:text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
