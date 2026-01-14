"use client";

import { useState } from "react";
import Header from "./components/layout/Header";
import CodeEditor from "./components/editor/CodeEditor";
import OutputPanel from "./components/editor/OutputPanel";
import Footer from "./components/layout/Footer";
import ResizablePanels from "./components/ui/ResizablePanels";
import { LANGUAGES } from "./lib/languages";
import { executeCode } from "./lib/pistonApi";
import { ExecutionResult } from "./types/language";

export default function Home() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(
    LANGUAGES.find((lang) => lang.id === "javascript")?.defaultCode || ""
  );
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput] = useState(true);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const langConfig = LANGUAGES.find((lang) => lang.id === newLanguage);
    if (langConfig) {
      setCode(langConfig.defaultCode);
      setOutput(null);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const currentLang = LANGUAGES.find((lang) => lang.id === language);
    if (!currentLang) {
      setOutput({
        success: false,
        output: "",
        error: "Language configuration not found",
      });
      setIsRunning(false);
      return;
    }

    try {
      const result = await executeCode(
        currentLang.pistonRuntime,
        currentLang.version,
        code
      );
      setOutput(result);
    } catch (error) {
      setOutput({
        success: false,
        output: "",
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearOutput = () => {
    setOutput(null);
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.id === language);

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-900">
      {/* Header */}
      <Header
        selectedLanguage={language}
        languages={LANGUAGES}
        onLanguageChange={handleLanguageChange}
        onRunCode={handleRunCode}
        onClearOutput={handleClearOutput}
        isRunning={isRunning}
        showOutput={showOutput}
      />

      {/* Main Content - Resizable Editor and Output */}
      <ResizablePanels
        leftPanel={
          <CodeEditor
            language={language}
            value={code}
            onChange={handleEditorChange}
          />
        }
        rightPanel={<OutputPanel result={output} isRunning={isRunning} />}
        defaultLeftWidth={50}
        minLeftWidth={25}
        minRightWidth={25}
      />

      {/* Footer */}
      <Footer code={code} currentLanguage={currentLanguage} />
    </div>
  );
}
