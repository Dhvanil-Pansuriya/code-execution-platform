"use client";

import { ReactNode, ButtonHTMLAttributes, useState } from "react";

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "success" | "danger" | "secondary";
}

export default function AnimatedButton({
  children,
  variant = "success",
  disabled = false,
  className = "",
  ...props
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const gradientColors = {
    success: "bg-[conic-gradient(from_90deg_at_50%_50%,#10b981_0%,#34d399_50%,#6ee7b7_100%)]",
    danger: "bg-[conic-gradient(from_90deg_at_50%_50%,#ef4444_0%,#f87171_50%,#fca5a5_100%)]",
    secondary: "bg-[conic-gradient(from_90deg_at_50%_50%,#6b7280_0%,#9ca3af_50%,#d1d5db_100%)]",
  };

  return (
    <button
      className={`relative inline-flex h-12 active:scale-95 transition overflow-hidden rounded-lg p-[1px] focus:outline-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {isHovered && !disabled && (
        <span
          className={`absolute inset-[-1000%] animate-[spin_2s_linear_infinite] ${gradientColors[variant]}`}
        />
      )}
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2">
        {children}
      </span>
    </button>
  );
}
