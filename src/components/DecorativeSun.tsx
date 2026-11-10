import React from "react";

interface SunProps {
  className?: string;
  size?: number;
  color?: string;
  variant?: "rays" | "burst" | "hand-drawn" | "minimal";
}

export default function DecorativeSun({
  className = "",
  size = 48,
  color = "#9C8E5E",
  variant = "hand-drawn",
}: SunProps) {
  if (variant === "burst") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="50" cy="50" r="18" fill={color} />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <line
            key={deg}
            x1="50"
            y1="16"
            x2="50"
            y2="6"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
      </svg>
    );
  }

  if (variant === "minimal") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="30" cy="30" r="10" stroke={color} strokeWidth="2.5" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="30"
            y1="12"
            x2="30"
            y2="6"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${deg} 30 30)`}
          />
        ))}
      </svg>
    );
  }

  // hand-drawn organic style
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hand-drawn organic circle */}
      <path
        d="M40 24C49 23.5 56 31 56 40C56 49.5 48.5 56.5 40 56C31 55.5 24 48.5 24 40C24 31 31.5 24.5 40 24Z"
        fill={color}
      />
      {/* Hand drawn playful rays */}
      <path d="M40 8L40 18" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M40 62L40 72" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M8 40L18 40" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M62 40L72 40" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M17 17L24 24" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M56 56L63 63" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M63 17L56 24" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M24 56L17 63" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

