import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "default" | "light";
  height?: number;
  priority?: boolean;
}

export default function Logo({
  className = "h-9 w-auto",
  variant = "default",
  height = 36,
  priority = false,
}: LogoProps) {
  const src =
    variant === "light"
      ? "/images/lume-logo-light.png"
      : "/images/lume-logo.png";

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src={src}
        alt="Lume Coffee Co."
        width={300}
        height={96}
        priority={priority}
        className="h-full w-auto object-contain max-h-12"
      />
    </div>
  );
}
