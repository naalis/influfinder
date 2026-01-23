interface IsotipoProps {
  className?: string;
  size?: number;
  variant?: "gradient" | "white" | "cyan" | "magenta";
}

export default function Isotipo({
  className = "",
  size = 40,
  variant = "gradient",
}: IsotipoProps) {
  const gradientId = `isotipo-gradient-${Math.random().toString(36).slice(2)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Main gradient: magenta → purple → blue → cyan */}
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#EA33E9" />
          <stop offset="35%" stopColor="#662D91" />
          <stop offset="70%" stopColor="#1020E0" />
          <stop offset="100%" stopColor="#75FBDE" />
        </linearGradient>
      </defs>

      {/* Ring of light - thick arc (open at bottom-left like official logo) */}
      <path
        d={`
          M 25 35
          A 25 25 0 1 1 50 60
        `}
        stroke={variant === "gradient" ? `url(#${gradientId})` : variant === "white" ? "#ffffff" : variant === "cyan" ? "#75FBDE" : "#EA33E9"}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />

      {/* Head - filled circle inside the ring */}
      <circle
        cx="50"
        cy="35"
        r="10"
        fill={variant === "gradient" ? `url(#${gradientId})` : variant === "white" ? "#ffffff" : variant === "cyan" ? "#75FBDE" : "#EA33E9"}
      />

      {/* Upward-pointing arrow/cursor (connection symbol) */}
      <path
        d="M50 58 L32 92 L50 82 L68 92 Z"
        fill={variant === "gradient" ? `url(#${gradientId})` : variant === "white" ? "#ffffff" : variant === "cyan" ? "#75FBDE" : "#EA33E9"}
      />
    </svg>
  );
}
