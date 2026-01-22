"use client";

import { useEffect, useState } from "react";
import { Send, Sparkles } from "lucide-react";

interface ApplicationSentAnimationProps {
  onComplete?: () => void;
}

export default function ApplicationSentAnimation({
  onComplete,
}: ApplicationSentAnimationProps) {
  const [phase, setPhase] = useState<"sending" | "sent" | "complete">("sending");

  useEffect(() => {
    // Sending phase
    const sendingTimer = setTimeout(() => {
      setPhase("sent");
    }, 800);

    // Complete phase
    const completeTimer = setTimeout(() => {
      setPhase("complete");
      onComplete?.();
    }, 2000);

    return () => {
      clearTimeout(sendingTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Main Icon */}
      <div className="relative mb-4">
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500 ${
            phase === "sending"
              ? "bg-brand-cyan/20 scale-100"
              : "bg-green-500/20 scale-110"
          }`}
        >
          <Send
            className={`h-10 w-10 transition-all duration-500 ${
              phase === "sending"
                ? "text-brand-cyan translate-x-0 rotate-0"
                : "text-green-400 translate-x-2 -translate-y-2 -rotate-12"
            }`}
          />
        </div>

        {/* Sparkles */}
        {phase !== "sending" && (
          <>
            <Sparkles
              className="absolute -right-2 -top-2 h-5 w-5 animate-pulse text-brand-cyan"
              style={{ animationDelay: "0s" }}
            />
            <Sparkles
              className="absolute -left-2 top-0 h-4 w-4 animate-pulse text-brand-magenta"
              style={{ animationDelay: "0.2s" }}
            />
            <Sparkles
              className="absolute -bottom-1 right-0 h-4 w-4 animate-pulse text-brand-purple"
              style={{ animationDelay: "0.4s" }}
            />
          </>
        )}
      </div>

      {/* Text */}
      <div className="text-center">
        <h3
          className={`text-xl font-bold transition-all duration-300 ${
            phase === "sending" ? "text-white" : "text-green-400"
          }`}
        >
          {phase === "sending" ? "Sending..." : "Application Sent!"}
        </h3>
        {phase !== "sending" && (
          <p className="mt-1 text-sm text-gray-400 animate-fade-in">
            You'll be notified when reviewed
          </p>
        )}
      </div>
    </div>
  );
}
