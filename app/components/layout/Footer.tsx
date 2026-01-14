"use client";

import { motion } from "framer-motion";
import { Language } from "../types/language";

interface FooterProps {
  code: string;
  currentLanguage: Language | undefined;
}

export default function Footer({ code, currentLanguage }: FooterProps) {
  const lineCount = code.split("\n").length;
  const charCount = code.length;
  const wordCount = code.trim().split(/\s+/).filter(Boolean).length;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-zinc-800 to-zinc-900 border-t border-zinc-700 px-6 py-3 shadow-lg"
    >
      <div className="flex items-center justify-between text-sm">
        {/* Left Section - Stats */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-6 text-zinc-300"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <svg
              className="w-4 h-4 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{lineCount}</span>
            <span className="text-zinc-500">lines</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <svg
              className="w-4 h-4 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{charCount}</span>
            <span className="text-zinc-500">characters</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <svg
              className="w-4 h-4 text-purple-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <span className="font-medium">{wordCount}</span>
            <span className="text-zinc-500">words</span>
          </motion.div>
        </motion.div>

        {/* Right Section - Language Info */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-zinc-800 px-3 py-1.5 rounded-full"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-zinc-300 font-medium">
              {currentLanguage?.name || "Unknown"}
            </span>
          </motion.div>

          {currentLanguage && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-zinc-400 text-xs bg-zinc-800 px-3 py-1.5 rounded-full"
            >
              v{currentLanguage.version}
            </motion.div>
          )}

          <div className="flex items-center gap-2 text-zinc-400">
            <span>Powered by</span>
            <span className="font-semibold text-blue-400">Piston API</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
