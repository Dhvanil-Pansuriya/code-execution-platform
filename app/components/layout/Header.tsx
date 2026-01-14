"use client";

import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import { MdClear } from "react-icons/md";
import { Language } from "../../types/language";
import AnimatedButton from "../ui/AnimatedButton";
import Dropdown from "../ui/Dropdown";

interface HeaderProps {
  selectedLanguage: string;
  languages: Language[];
  onLanguageChange: (languageId: string) => void;
  onRunCode: () => void;
  onClearOutput: () => void;
  isRunning: boolean;
  showOutput: boolean;
}

export default function Header({
  selectedLanguage,
  languages,
  onLanguageChange,
  onRunCode,
  onClearOutput,
  isRunning,
  showOutput,
}: HeaderProps) {
  const languageOptions = languages.map((lang) => ({
    value: lang.id,
    label: lang.name,
  }));

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-zinc-800 to-zinc-900 border-b border-zinc-700 shadow-lg"
    >
      <div className="max-w-full mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Title Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-shrink-0"
          >
            <h1 className="text-xl font-bold text-white">
              Monaco Code Runner
            </h1>
            <p className="text-zinc-400 text-xs mt-1">
              Multi-language code editor powered by Piston API
            </p>
          </motion.div>

          {/* Controls Section */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            {/* Language Dropdown */}
            <Dropdown
              options={languageOptions}
              value={selectedLanguage}
              onChange={onLanguageChange}
            />

            {/* Run Button */}
            <AnimatedButton
              variant="success"
              onClick={onRunCode}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-4 w-4 border-b-2 border-white"
                  />
                  Running...
                </>
              ) : (
                <>
                  <FaPlay className="w-4 h-4" />
                  Run Code
                </>
              )}
            </AnimatedButton>

            {/* Clear Button */}
            <AnimatedButton variant="secondary" onClick={onClearOutput}>
              <MdClear className="w-5 h-5" />
              Clear
            </AnimatedButton>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
