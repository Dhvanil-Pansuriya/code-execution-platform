"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

interface ResizableVerticalPanelsProps {
  topPanel: ReactNode;
  bottomPanel: ReactNode;
  defaultTopHeight?: number;
  minTopHeight?: number;
  minBottomHeight?: number;
  showBottomPanel: boolean;
}

export default function ResizableVerticalPanels({
  topPanel,
  bottomPanel,
  defaultTopHeight = 60,
  minTopHeight = 30,
  minBottomHeight = 20,
  showBottomPanel,
}: ResizableVerticalPanelsProps) {
  const [topHeight, setTopHeight] = useState(defaultTopHeight);
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
      const containerHeight = containerRect.height;
      const mouseY = e.clientY - containerRect.top;

      let newTopHeight = (mouseY / containerHeight) * 100;
      newTopHeight = Math.max(minTopHeight, Math.min(100 - minBottomHeight, newTopHeight));

      setTopHeight(newTopHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "row-resize";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging, minTopHeight, minBottomHeight]);

  return (
    <div ref={containerRef} className="h-full flex flex-col overflow-hidden relative">
      <div
        style={{ height: showBottomPanel ? `${topHeight}%` : "100%" }}
        className="overflow-hidden transition-none"
      >
        {topPanel}
      </div>

      {showBottomPanel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onMouseDown={handleMouseDown}
          className={`relative h-1 bg-zinc-700 cursor-row-resize group ${
            isDragging ? "bg-zinc-600" : ""
          }`}
        >
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-16 bg-zinc-600 rounded-full ${
              isDragging ? "bg-zinc-500" : ""
            }`}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1">
              <div className="w-1 h-1 bg-zinc-400 rounded-full"></div>
              <div className="w-1 h-1 bg-zinc-400 rounded-full"></div>
              <div className="w-1 h-1 bg-zinc-400 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      )}

      {showBottomPanel && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: `${100 - topHeight}%`, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="overflow-hidden"
        >
          {bottomPanel}
        </motion.div>
      )}

      {isDragging && (
        <div className="absolute inset-0 z-50 cursor-row-resize" />
      )}
    </div>
  );
}
