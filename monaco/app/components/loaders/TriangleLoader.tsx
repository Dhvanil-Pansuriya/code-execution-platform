"use client";

import { motion } from "framer-motion";

interface TriangleLoaderProps {
  size?: number;
  color?: string;
}

export default function TriangleLoader({
  size = 80,
  color = "#4fa94d",
}: TriangleLoaderProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-block",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Triangle 1 - Top */}
        <motion.polygon
          points="50,15 65,40 35,40"
          fill={color}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0,
          }}
        />

        {/* Triangle 2 - Bottom Left */}
        <motion.polygon
          points="35,45 50,70 20,70"
          fill={color}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Triangle 3 - Bottom Right */}
        <motion.polygon
          points="65,45 80,70 50,70"
          fill={color}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </svg>
    </div>
  );
}
