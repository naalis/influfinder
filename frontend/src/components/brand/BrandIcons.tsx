interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// Connection Icon (main isotipo simplified)
export function ConnectionIcon({ className = "", size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Ring */}
      <circle cx="12" cy="7" r="5" stroke={color} strokeWidth="2" fill="none" />
      {/* Head */}
      <circle cx="12" cy="7" r="2" fill={color} />
      {/* Arrow body */}
      <path d="M12 12 L7 22 L12 18 L17 22 Z" fill={color} />
    </svg>
  );
}

// Travel Icon (plane-like shape from isotipo)
export function TravelIcon({ className = "", size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Ring/Globe shape */}
      <circle cx="8" cy="8" r="5" stroke={color} strokeWidth="2" fill="none" />
      {/* Plane wing extending */}
      <path d="M13 8 L22 4 L18 10 Z" fill={color} />
      {/* Tail */}
      <path d="M10 13 L6 22 L14 16 Z" fill={color} />
    </svg>
  );
}

// Fitness Icon (person/model figure)
export function FitnessIcon({ className = "", size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Head */}
      <circle cx="12" cy="4" r="3" fill={color} />
      {/* Body */}
      <path d="M12 8 L12 14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms spread */}
      <path d="M6 10 L12 12 L18 10" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Legs */}
      <path d="M12 14 L8 22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 14 L16 22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Tips Icon (multiple arrows pointing up)
export function TipsIcon({ className = "", size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left arrow */}
      <path d="M6 22 L6 10 L3 13 L6 6 L9 13 L6 10" fill={color} />
      {/* Center arrow (tallest) */}
      <path d="M12 22 L12 6 L9 9 L12 2 L15 9 L12 6" fill={color} />
      {/* Right arrow */}
      <path d="M18 22 L18 10 L15 13 L18 6 L21 13 L18 10" fill={color} />
    </svg>
  );
}

// Food/Dining Icon (spoon-like from isotipo)
export function DiningIcon({ className = "", size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Plate ring */}
      <circle cx="12" cy="10" r="7" stroke={color} strokeWidth="2" fill="none" />
      {/* Center dot */}
      <circle cx="12" cy="10" r="2" fill={color} />
      {/* Handle */}
      <path d="M12 17 L12 22" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Wellness/Spa Icon
export function WellnessIcon({ className = "", size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Meditation pose - head */}
      <circle cx="12" cy="5" r="3" fill={color} />
      {/* Body in lotus */}
      <path d="M12 9 L12 13" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Arms in meditation */}
      <path d="M6 12 Q9 10, 12 12 Q15 10, 18 12" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Lotus base */}
      <path d="M5 18 Q12 14, 19 18" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M7 20 Q12 16, 17 20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Fashion Icon
export function FashionIcon({ className = "", size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Head */}
      <circle cx="12" cy="4" r="2.5" fill={color} />
      {/* Dress body */}
      <path d="M8 8 L12 7 L16 8 L18 22 L6 22 Z" fill={color} />
      {/* Neckline */}
      <path d="M10 8 L12 10 L14 8" stroke="black" strokeWidth="1" fill="none" opacity="0.3" />
    </svg>
  );
}

// Beauty Icon
export function BeautyIcon({ className = "", size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Ring/mirror */}
      <circle cx="12" cy="9" r="7" stroke={color} strokeWidth="2" fill="none" />
      {/* Sparkle inside */}
      <circle cx="12" cy="9" r="3" fill={color} />
      {/* Handle */}
      <path d="M12 16 L12 22" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Tech Icon
export function TechIcon({ className = "", size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Screen ring */}
      <rect x="5" y="3" width="14" height="14" rx="2" stroke={color} strokeWidth="2" fill="none" />
      {/* Signal/connection */}
      <circle cx="12" cy="10" r="2" fill={color} />
      {/* Stand */}
      <path d="M12 17 L12 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M8 21 L16 21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Home Icon
export function HomeIcon({ className = "", size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Roof with ring element */}
      <path d="M12 3 L3 10 L5 10 L5 20 L19 20 L19 10 L21 10 Z" stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Door (isotipo-inspired) */}
      <circle cx="12" cy="14" r="3" stroke={color} strokeWidth="2" fill="none" />
      <circle cx="12" cy="14" r="1" fill={color} />
    </svg>
  );
}

// All Categories Icon (sparkle/all)
export function AllCategoriesIcon({ className = "", size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Center isotipo small */}
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="8" r="1.5" fill={color} />
      <path d="M12 12 L9 18 L12 16 L15 18 Z" fill={color} />
      {/* Sparkle rays */}
      <path d="M12 1 L12 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M19 5 L17.5 6.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M21 12 L19 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M5 5 L6.5 6.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M3 12 L5 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
