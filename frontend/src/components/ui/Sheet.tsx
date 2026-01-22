"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  position?: "bottom" | "right";
}

export default function Sheet({
  isOpen,
  onClose,
  children,
  title,
  position = "bottom",
}: SheetProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

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

  const positionClasses = {
    bottom: {
      container: "items-end",
      sheet: `rounded-t-3xl ${isAnimating && isOpen ? "translate-y-0" : "translate-y-full"}`,
    },
    right: {
      container: "justify-end",
      sheet: `h-full rounded-l-3xl ${isAnimating && isOpen ? "translate-x-0" : "translate-x-full"}`,
    },
  };

  const classes = positionClasses[position];

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating && isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Sheet Container */}
      <div className={`flex h-full w-full ${classes.container}`}>
        {/* Sheet */}
        <div
          ref={sheetRef}
          className={`relative w-full max-w-lg border border-gray-800 bg-gray-900 transition-transform duration-300 ease-out ${classes.sheet}`}
          style={{
            maxHeight: position === "bottom" ? "90vh" : undefined,
          }}
        >
          {/* Drag Handle (for bottom sheet) */}
          {position === "bottom" && (
            <div className="flex justify-center py-3">
              <div className="h-1 w-10 rounded-full bg-gray-700" />
            </div>
          )}

          {/* Header */}
          {title && (
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-gray-700"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          )}

          {/* Content */}
          <div
            className="overflow-y-auto"
            style={{
              maxHeight:
                position === "bottom"
                  ? `calc(90vh - ${title ? "120px" : "60px"})`
                  : undefined,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
