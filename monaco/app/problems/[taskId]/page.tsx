"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaPlay, FaArrowLeft } from "react-icons/fa";
import { fetchProblemByTaskId, runCode, submitCode, Problem } from "../../lib/problemsApi";
import { LANGUAGES } from "../../lib/languages";
import ProblemDescription from "../../components/problem/ProblemDescription";
import CodeEditor from "../../components/editor/CodeEditor";
import TestResultsPanel from "../../components/problem/TestResultsPanel";
import ResizablePanels from "../../components/ui/ResizablePanels";
import ResizableVerticalPanels from "../../components/ui/ResizableVerticalPanels";
import AnimatedButton from "../../components/ui/AnimatedButton";
import Dropdown from "../../components/ui/Dropdown";
import TriangleLoader from "../../components/loaders/TriangleLoader";

export default function ProblemPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    loadProblem();
  }, [taskId]);

  const loadProblem = async () => {
    try {
      setLoading(true);
      const data = await fetchProblemByTaskId(taskId);
      setProblem(data);
      setCode("");
    } catch (error) {
      console.error("Error loading problem:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleRunCode = async () => {
    if (!problem || !code.trim()) return;

    setIsRunning(true);
    setTestResults(null);

    try {
      const currentLang = LANGUAGES.find((lang) => lang.id === language);
      if (!currentLang) {
        setTestResults({
          allResults: [],
          totalTests: 0,
          passedTests: 0,
          error: "Language not supported",
        });
        setIsRunning(false);
        return;
      }

      const firstTestCase = problem.input_output[0];
      
      if (!firstTestCase) {
        setTestResults({
          allResults: [],
          totalTests: 0,
          passedTests: 0,
          error: "No test cases available",
        });
        setIsRunning(false);
        return;
      }

      const result = await runCode(
        language,
        code,
        firstTestCase.input
      );

      const testResult = {
        testNumber: 1,
        input: firstTestCase.input,
        expectedOutput: firstTestCase.output,
        actualOutput: result.output,
        passed: result.output.trim() === firstTestCase.output.trim(),
        error: result.error,
      };

      setTestResults({
        allResults: [testResult],
        totalTests: 1,
        passedTests: testResult.passed ? 1 : 0,
        isRunOnly: true,
      });
    } catch (error) {
      console.error("Error running code:", error);
      setTestResults({
        allResults: [],
        totalTests: 0,
        passedTests: 0,
        error: error instanceof Error ? error.message : "Failed to execute code",
        isRunOnly: true,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem || !code.trim()) return;

    setIsSubmitting(true);
    setTestResults(null);

    try {
      const currentLang = LANGUAGES.find((lang) => lang.id === language);
      if (!currentLang) {
        setTestResults({
          allResults: [],
          passedResults: [],
          failedResults: [],
          totalTests: 0,
          passedTests: 0,
          failedTests: 0,
          error: "Language not supported",
        });
        setIsSubmitting(false);
        return;
      }

      const testCases = problem.input_output;

      const result = await submitCode(
        language,
        code,
        testCases
      );

      setTestResults({
        allResults: result.allResults,
        passedResults: result.passedResults,
        failedResults: result.failedResults,
        totalTests: result.totalTests,
        passedTests: result.passedTests,
        failedTests: result.failedTests,
        isRunOnly: false,
      });
    } catch (error) {
      console.error("Error submitting code:", error);
      setTestResults({
        allResults: [],
        passedResults: [],
        failedResults: [],
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        error: error instanceof Error ? error.message : "Failed to submit code",
        isRunOnly: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseResults = () => {
    setTestResults(null);
  };

  const languageOptions = LANGUAGES.map((lang) => ({
    value: lang.id,
    label: lang.name,
  }));

  // Check if code is empty
  const isCodeEmpty = !code.trim();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-900">
        <div className="text-center">
          <TriangleLoader size={80} color="#3b82f6" />
          <p className="text-white text-lg mt-4">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-900">
        <div className="text-center">
          <p className="text-white text-lg">Problem not found</p>
          <button
            onClick={() => router.push("/problems")}
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-900">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-zinc-800 to-zinc-900 border-b border-zinc-700 shadow-lg"
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/problems")}
                className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-white text-xl" />
              </motion.button>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {problem.task_id
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </h1>
                <p className="text-zinc-400 text-sm">
                  Problem #{problem.question_id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Dropdown
                options={languageOptions}
                value={language}
                onChange={handleLanguageChange}
              />

              <AnimatedButton
                variant="secondary"
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting || isCodeEmpty}
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

              <AnimatedButton
                variant="success"
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting || isCodeEmpty}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="rounded-full h-4 w-4 border-b-2 border-white"
                    />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </AnimatedButton>
            </div>
          </div>
        </div>
      </motion.div>

      <ResizablePanels
        leftPanel={<ProblemDescription problem={problem} />}
        rightPanel={
          <div className="h-full bg-zinc-900">
            <ResizableVerticalPanels
              topPanel={
                <CodeEditor
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                />
              }
              bottomPanel={
                testResults ? (
                  <TestResultsPanel
                    testResults={testResults}
                    onClose={handleCloseResults}
                  />
                ) : null
              }
              showBottomPanel={!!testResults}
              defaultTopHeight={60}
              minTopHeight={30}
              minBottomHeight={20}
            />
          </div>
        }
        defaultLeftWidth={40}
        minLeftWidth={30}
        minRightWidth={40}
      />
    </div>
  );
}
