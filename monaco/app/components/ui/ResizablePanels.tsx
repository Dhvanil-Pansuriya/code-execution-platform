"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

interface ResizablePanelsProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  defaultLeftWidth?: number; // percentage (0-100)
  minLeftWidth?: number; // percentage
  minRightWidth?: number; // percentage
}

export default function ResizablePanels({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 50,
  minLeftWidth = 20,
  minRightWidth = 20,
}: ResizablePanelsProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;

      // Calculate new left width as percentage
      let newLeftWidth = (mouseX / containerWidth) * 100;

      // Apply min/max constraints
      newLeftWidth = Math.max(minLeftWidth, Math.min(100 - minRightWidth, newLeftWidth));

      setLeftWidth(newLeftWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      // Prevent text selection while dragging
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging, minLeftWidth, minRightWidth]);

  return (
    <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
      {/* Left Panel */}
      <div
        style={{ width: `${leftWidth}%` }}
        className="overflow-hidden transition-none"
      >
        {leftPanel}
      </div>

      {/* Resizer */}
      <motion.div
        onMouseDown={handleMouseDown}
        className={`relative w-1 bg-zinc-700 cursor-col-resize group ${
          isDragging ? "bg-zinc-600" : ""
        }`}
        whileHover={{ scale: 1.5 }}
        transition={{ duration: 0.2 }}
      >
        {/* Visual indicator */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-16 bg-zinc-600 rounded-full ${
            isDragging ? "bg-zinc-500" : ""
          }`}
        >
          {/* Grip dots */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1">
            <div className="w-1 h-1 bg-zinc-400 rounded-full"></div>
            <div className="w-1 h-1 bg-zinc-400 rounded-full"></div>
            <div className="w-1 h-1 bg-zinc-400 rounded-full"></div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel */}
      <div
        style={{ width: `${100 - leftWidth}%` }}
        className="overflow-hidden transition-none"
      >
        {rightPanel}
      </div>

      {/* Overlay during dragging to prevent iframe issues */}
      {isDragging && (
        <div className="absolute inset-0 z-50 cursor-col-resize" />
      )}
    </div>
  );
}
