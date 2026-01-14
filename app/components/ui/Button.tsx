"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled = false,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-semibold transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-500/50 hover:shadow-blue-500/70 focus:ring-blue-500 disabled:from-zinc-600 disabled:to-zinc-600 disabled:shadow-none disabled:cursor-not-allowed disabled:opacity-50",
    secondary:
      "bg-zinc-700 hover:bg-zinc-600 text-white shadow-zinc-500/30 hover:shadow-zinc-500/50 focus:ring-zinc-500 disabled:bg-zinc-600 disabled:shadow-none disabled:cursor-not-allowed disabled:opacity-50",
    success:
      "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-green-500/50 hover:shadow-green-500/70 focus:ring-green-500 disabled:from-zinc-600 disabled:to-zinc-600 disabled:shadow-none disabled:cursor-not-allowed disabled:opacity-50",
    danger:
      "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-red-500/50 hover:shadow-red-500/70 focus:ring-red-500 disabled:from-zinc-600 disabled:to-zinc-600 disabled:shadow-none disabled:cursor-not-allowed disabled:opacity-50",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm gap-2",
    md: "px-6 py-2.5 text-base gap-2.5",
    lg: "px-8 py-3 text-lg gap-3",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
