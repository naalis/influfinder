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

  const getColor = () => {
    switch (variant) {
      case "white":
        return "#ffffff";
      case "cyan":
        return "#75FBDE";
      case "magenta":
        return "#EA33E9";
      default:
        return `url(#${gradientId})`;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {variant === "gradient" && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#EA33E9" />
            <stop offset="50%" stopColor="#662D91" />
            <stop offset="100%" stopColor="#75FBDE" />
          </linearGradient>
        </defs>
      )}

      {/* Ring of light (circle) */}
      <circle
        cx="50"
        cy="30"
        r="20"
        stroke={getColor()}
        strokeWidth="8"
        fill="none"
      />

      {/* Head (small filled circle) */}
      <circle cx="50" cy="30" r="8" fill={getColor()} />

      {/* Body/Arrow pointing up (tripod legs) */}
      <path
        d="M50 50 L30 90 L50 75 L70 90 Z"
        fill={getColor()}
      />
    </svg>
  );
}
