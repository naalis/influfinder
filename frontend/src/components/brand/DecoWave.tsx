interface DecoWaveProps {
  className?: string;
  variant?: "top" | "bottom" | "left" | "right";
  color?: "magenta" | "cyan" | "purple" | "gradient";
  opacity?: number;
}

export default function DecoWave({
  className = "",
  variant = "top",
  color = "magenta",
  opacity = 0.15,
}: DecoWaveProps) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "#75FBDE";
      case "purple":
        return "#662D91";
      case "gradient":
        return "url(#decoGradient)";
      default:
        return "#EA33E9";
    }
  };

  const getTransform = () => {
    switch (variant) {
      case "bottom":
        return "rotate(180deg)";
      case "left":
        return "rotate(90deg)";
      case "right":
        return "rotate(-90deg)";
      default:
        return "rotate(0deg)";
    }
  };

  return (
    <div
      className={`pointer-events-none absolute overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        style={{ transform: getTransform() }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="decoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA33E9" />
            <stop offset="50%" stopColor="#662D91" />
            <stop offset="100%" stopColor="#75FBDE" />
          </linearGradient>
        </defs>
        {/* Flowing ribbon wave shape */}
        <path
          d="M-50 100
             C 50 20, 100 180, 200 100
             S 350 20, 450 100
             L 450 0 L -50 0 Z"
          fill={getColor()}
        />
      </svg>
    </div>
  );
}

export function DecoRibbon({
  className = "",
  position = "topRight",
}: {
  className?: string;
  position?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}) {
  const positionClasses = {
    topLeft: "top-0 left-0 -translate-x-1/4 -translate-y-1/4",
    topRight: "top-0 right-0 translate-x-1/4 -translate-y-1/4",
    bottomLeft: "bottom-0 left-0 -translate-x-1/4 translate-y-1/4",
    bottomRight: "bottom-0 right-0 translate-x-1/4 translate-y-1/4",
  };

  return (
    <div
      className={`pointer-events-none absolute h-64 w-64 opacity-20 blur-3xl ${
        positionClasses[position]
      } ${className}`}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA33E9" />
            <stop offset="100%" stopColor="#75FBDE" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#ribbonGrad)" />
      </svg>
    </div>
  );
}

export function FlowingRibbon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EA33E9" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#662D91" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#75FBDE" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Flowing curved ribbon */}
      <path
        d="M-20 150
           Q 80 50, 200 120
           T 420 80"
        stroke="url(#flowGrad)"
        strokeWidth="40"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M-20 200
           Q 100 280, 220 180
           T 420 220"
        stroke="url(#flowGrad)"
        strokeWidth="30"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
