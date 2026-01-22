"use client";

import { useEffect, useState } from "react";
import { X, ChevronRight, LucideIcon } from "lucide-react";

interface DrawerItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  description?: string;
  onClick?: () => void;
  href?: string;
  badge?: string;
  badgeColor?: string;
}

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  items: DrawerItem[];
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  items,
}: DrawerProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating && isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`absolute bottom-0 left-0 right-0 rounded-t-3xl border border-gray-800 bg-gray-900 transition-transform duration-300 ease-out ${
          isAnimating && isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "80vh" }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center py-3">
          <div className="h-1 w-10 rounded-full bg-gray-700" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-gray-800 px-6 pb-4">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-gray-700"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        )}

        {/* Items */}
        <div className="overflow-y-auto p-4" style={{ maxHeight: "calc(80vh - 100px)" }}>
          <div className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon;
              const Component = item.href ? "a" : "button";

              return (
                <Component
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    item.onClick?.();
                    handleClose();
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-left transition-colors hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800">
                        <Icon className="h-5 w-5 text-brand-cyan" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-white">{item.label}</div>
                      {item.description && (
                        <div className="text-sm text-gray-400">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.badgeColor || "bg-brand-cyan/20 text-brand-cyan"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </div>
                </Component>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
