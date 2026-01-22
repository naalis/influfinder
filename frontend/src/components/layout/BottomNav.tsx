"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, User, LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    href: "/home",
    label: "Home",
    Icon: Home,
  },
  {
    href: "/explore",
    label: "Explore",
    Icon: Search,
  },
  {
    href: "/collabs",
    label: "Collabs",
    Icon: Heart,
  },
  {
    href: "/profile",
    label: "Profile",
    Icon: User,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-black/95 backdrop-blur-lg"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-2 py-3 transition-all ${
                isActive ? "text-brand-cyan" : "text-gray-400"
              }`}
            >
              <item.Icon
                className={`h-6 w-6 transition-transform duration-200 ${
                  isActive ? "scale-110" : ""
                }`}
                style={
                  isActive
                    ? {
                        filter: "drop-shadow(0 0 8px var(--brand-cyan))",
                      }
                    : {}
                }
                fill={isActive ? "currentColor" : "none"}
              />
              <span
                className={`text-xs font-medium transition-all ${
                  isActive ? "font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
