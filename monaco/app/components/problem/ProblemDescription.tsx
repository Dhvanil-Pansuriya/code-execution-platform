"use client";

import { motion } from "framer-motion";
import { Problem } from "../../lib/problemsApi";

interface ProblemDescriptionProps {
  problem: Problem;
}

export default function ProblemDescription({ problem }: ProblemDescriptionProps) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "text-green-400";
      case "Medium":
        return "text-yellow-400";
      case "Hard":
        return "text-red-400";
      default:
        return "text-zinc-400";
    }
  };

  const parseDescription = (desc: string) => {
    const sections = desc.split(/\n\s*\n/);
    return sections;
  };

  const sections = parseDescription(problem.problem_description);

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      <div className="bg-zinc-900 border-b border-zinc-700 px-4 py-3">
        <h2 className="text-white font-semibold text-lg">Description</h2>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-6"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#52525b #27272a",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-zinc-500 font-mono text-sm">
                #{problem.question_id}
              </span>
              <h1 className="text-2xl font-bold text-white">
                {problem.task_id
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full border border-zinc-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            {sections.map((section, index) => (
              <div key={index} className="mb-4">
                {section.split("\n").map((line, lineIndex) => {
                  if (line.startsWith("Example")) {
                    return (
                      <div key={lineIndex} className="mt-6 mb-3">
                        <h3 className="text-white font-semibold text-lg">{line}</h3>
                      </div>
                    );
                  }
                  if (line.startsWith("Input:") || line.startsWith("Output:")) {
                    return (
                      <div key={lineIndex} className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 my-2">
                        <code className="text-sm text-zinc-200">{line}</code>
                      </div>
                    );
                  }
                  if (line.startsWith("Explanation:")) {
                    return (
                      <p key={lineIndex} className="text-zinc-400 text-sm mt-2 italic">
                        {line}
                      </p>
                    );
                  }
                  if (line.startsWith("Constraints:")) {
                    return (
                      <div key={lineIndex} className="mt-6 mb-3">
                        <h3 className="text-white font-semibold text-lg">{line}</h3>
                      </div>
                    );
                  }
                  return line.trim() ? (
                    <p key={lineIndex} className="text-zinc-300 leading-relaxed mb-2">
                      {line}
                    </p>
                  ) : null;
                })}
              </div>
            ))}
          </div>

          {problem.input_output && problem.input_output.length > 0 && (
            <div className="mt-8">
              <h3 className="text-white font-semibold text-lg mb-4">Sample Test Cases</h3>
              <div className="space-y-4">
                {problem.input_output.slice(0, 3).map((testCase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-zinc-900 border border-zinc-700 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-blue-400 font-semibold">Test Case {index + 1}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-zinc-500 text-sm">Input:</span>
                        <pre className="bg-zinc-950 border border-zinc-800 rounded p-3 mt-1 overflow-x-auto">
                          <code className="text-sm text-zinc-200">{testCase.input}</code>
                        </pre>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-sm">Expected Output:</span>
                        <pre className="bg-zinc-950 border border-zinc-800 rounded p-3 mt-1 overflow-x-auto">
                          <code className="text-sm text-green-400">{testCase.output}</code>
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
