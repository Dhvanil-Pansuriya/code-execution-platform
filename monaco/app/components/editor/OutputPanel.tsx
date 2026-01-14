"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExecutionResult } from "../../types/language";

interface OutputPanelProps {
  result: ExecutionResult | null;
  isRunning: boolean;
}

export default function OutputPanel({ result, isRunning }: OutputPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full flex flex-col bg-zinc-950 border-l border-zinc-700"
    >
      {/* Output Header */}
      <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-4 py-3 border-b border-zinc-700 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-white font-semibold text-lg">Output</h2>
        </div>
        <AnimatePresence>
          {result?.executionTime && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-zinc-400 text-sm bg-zinc-800 px-3 py-1 rounded-full"
            >
              {result.executionTime}ms
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Output Content */}
      <div className="flex-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          {isRunning ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500 mx-auto"></div>
              <h2 className="text-white mt-4 text-lg font-medium">
                Executing code...
              </h2>
              <p className="text-zinc-400 text-sm mt-2">
                Running on Piston API servers
              </p>
            </motion.div>
          ) : !result ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="bg-zinc-800 rounded-full p-6 mb-4">
                <svg
                  className="w-12 h-12 text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-zinc-400 text-lg font-medium">No output yet</p>
              <p className="text-zinc-500 text-sm mt-2">
                Click "Run Code" to execute your program
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Output Section - Always show if there's output */}
              {result.output && (
                <motion.pre
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-sm font-mono text-zinc-100 overflow-x-auto whitespace-pre-wrap break-words"
                >
                  {result.output}
                </motion.pre>
              )}

              {/* Error Section - Only show if there's an error */}
              {result.error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-red-950/20 rounded-lg border border-red-800 overflow-hidden shadow-sm"
                >
                  <div className="bg-red-900/30 px-4 py-2 border-b border-red-800 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-red-300 text-sm font-medium">
                      Error
                    </span>
                  </div>
                  <pre className="p-4 text-sm font-mono text-red-200 overflow-x-auto whitespace-pre-wrap break-words">
                    {result.error}
                  </pre>
                </motion.div>
              )}

              {/* Show message if no output and no error */}
              {!result.output && !result.error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center h-full"
                >
                  <p className="text-zinc-500 text-sm">
                    Code executed successfully with no output
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
