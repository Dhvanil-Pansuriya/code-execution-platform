"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import TriangleLoader from "../loaders/TriangleLoader";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-zinc-900">
      <div className="text-center">
        <TriangleLoader size={80} color="#4fa94d" />
        <p className="text-white text-lg font-medium mt-4">
          Loading Editor...
        </p>
        <p className="text-zinc-400 text-sm mt-2">Powered by Monaco</p>
      </div>
    </div>
  ),
});

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
}

export default function CodeEditor({
  language,
  value,
  onChange,
}: CodeEditorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full w-full border-r border-zinc-700"
    >
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          fontSize: 15,
          fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
          fontLigatures: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          lineNumbers: "on",
          renderWhitespace: "selection",
          bracketPairColorization: {
            enabled: true,
          },
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          padding: { top: 16, bottom: 16 },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </motion.div>
  );
}
