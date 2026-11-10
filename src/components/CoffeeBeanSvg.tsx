import React from "react";

interface BeanProps {
  className?: string;
  size?: number;
  color?: string;
  rotate?: number;
}

export default function CoffeeBeanSvg({
  className = "",
  size = 28,
  color = "#887D47",
  rotate = 0,
}: BeanProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-block ${className}`}
    >
      <ellipse cx="16" cy="16" rx="12" ry="8" fill={color} />
      <path
        d="M6 16 C 11 12, 13 20, 16 16 C 19 12, 21 20, 26 16"
        stroke="#FFF9F2"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

