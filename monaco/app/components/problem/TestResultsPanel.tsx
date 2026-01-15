"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

interface TestResult {
  testNumber: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string;
}

interface TestResultsPanelProps {
  testResults: {
    allResults?: TestResult[];
    passedResults?: TestResult[];
    failedResults?: TestResult[];
    totalTests: number;
    passedTests: number;
    failedTests?: number;
    isRunOnly?: boolean;
    error?: string;
  };
  onClose: () => void;
}

export default function TestResultsPanel({ testResults, onClose }: TestResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<"all" | "passed" | "failed">("all");

  const getDisplayResults = () => {
    if (testResults.isRunOnly) {
      return testResults.allResults || [];
    }

    switch (activeTab) {
      case "passed":
        return testResults.passedResults || [];
      case "failed":
        return testResults.failedResults || [];
      default:
        return testResults.allResults || [];
    }
  };

  const displayResults = getDisplayResults();
  const showTabs = !testResults.isRunOnly && testResults.totalTests > 0;

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      <div className="bg-zinc-900 border-b border-zinc-700 flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-white font-semibold text-lg">
              {testResults.isRunOnly ? "Test Result" : "Submission Results"}
            </h3>
            {!testResults.error && (
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    testResults.passedTests === testResults.totalTests
                      ? "bg-green-950/30 text-green-400 border border-green-800"
                      : "bg-red-950/30 text-red-400 border border-red-800"
                  }`}
                >
                  {testResults.passedTests} / {testResults.totalTests} Passed
                </span>
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <FaTimes className="text-zinc-400 hover:text-white" />
          </motion.button>
        </div>

        {showTabs && (
          <div className="px-4 flex gap-1 border-t border-zinc-800">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === "all"
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              All ({testResults.totalTests})
              {activeTab === "all" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("passed")}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === "passed"
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              Passed ({testResults.passedTests})
              {activeTab === "passed" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("failed")}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === "failed"
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              Failed ({testResults.failedTests || 0})
              {activeTab === "failed" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
                />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {testResults.error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-950/20 border border-red-800 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <FaTimesCircle className="text-red-400 text-xl flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-red-400 font-semibold mb-2">Error</h4>
                <p className="text-red-300 text-sm">{testResults.error}</p>
              </div>
            </div>
          </motion.div>
        ) : displayResults.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-zinc-400">
              {activeTab === "passed" && "No test cases passed"}
              {activeTab === "failed" && "No test cases failed"}
              {activeTab === "all" && "No test results available"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayResults.map((result: TestResult, index: number) => (
              <motion.div
                key={result.testNumber}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border rounded-lg p-4 ${
                  result.passed
                    ? "border-green-700 bg-green-950/20"
                    : "border-red-700 bg-red-950/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {result.passed ? (
                    <FaCheckCircle className="text-green-400 text-lg" />
                  ) : (
                    <FaTimesCircle className="text-red-400 text-lg" />
                  )}
                  <span
                    className={`font-semibold text-base ${
                      result.passed ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    Test Case {result.testNumber}: {result.passed ? "Passed ✓" : "Failed ✗"}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-zinc-900 rounded p-3">
                    <span className="text-zinc-500 text-sm font-medium">Input:</span>
                    <pre className="text-zinc-200 text-sm mt-1 whitespace-pre-wrap break-words">
                      {result.input}
                    </pre>
                  </div>
                  
                  <div className="bg-zinc-900 rounded p-3">
                    <span className="text-zinc-500 text-sm font-medium">Expected Output:</span>
                    <pre className="text-green-400 text-sm mt-1 whitespace-pre-wrap break-words">
                      {result.expectedOutput}
                    </pre>
                  </div>
                  
                  <div className="bg-zinc-900 rounded p-3">
                    <span className="text-zinc-500 text-sm font-medium">Your Output:</span>
                    <pre
                      className={`text-sm mt-1 whitespace-pre-wrap break-words ${
                        result.passed ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {result.actualOutput}
                    </pre>
                  </div>

                  {result.error && (
                    <div className="bg-red-950/30 rounded p-3">
                      <span className="text-red-400 text-sm font-medium">Error:</span>
                      <pre className="text-red-300 text-sm mt-1 whitespace-pre-wrap break-words">
                        {result.error}
                      </pre>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
