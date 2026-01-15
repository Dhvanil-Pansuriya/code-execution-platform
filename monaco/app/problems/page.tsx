"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchProblems, Problem } from "../lib/problemsApi";
import { FaCode, FaSearch, FaFilter } from "react-icons/fa";
import TriangleLoader from "../components/loaders/TriangleLoader";

export default function ProblemsPage() {
  const router = useRouter();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [difficulty, setDifficulty] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProblems();
  }, [page, difficulty]);

  const loadProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProblems({
        page,
        limit: 20,
        difficulty: difficulty || undefined,
        search: searchTerm || undefined,
      });
      setProblems(data.problems || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error loading problems:", error);
      setError("Failed to load problems. Please make sure the backend server is running and MongoDB is connected.");
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadProblems();
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "text-green-400 bg-green-950/30 border-green-800";
      case "Medium":
        return "text-yellow-400 bg-yellow-950/30 border-yellow-800";
      case "Hard":
        return "text-red-400 bg-red-950/30 border-red-800";
      default:
        return "text-zinc-400 bg-zinc-800 border-zinc-700";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-zinc-800 to-zinc-900 border-b border-zinc-700 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <FaCode className="text-blue-400" />
                Code Play Problems
              </h1>
              <p className="text-zinc-400 mt-2">
                Practice coding problems and improve your skills
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Code Editor
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-800 rounded-lg p-6 mb-6 border border-zinc-700"
        >
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FaFilter className="text-zinc-400" />
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Search
            </motion.button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-950/30 border border-red-800 rounded-lg p-6 mb-6"
          >
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-red-400 font-semibold mb-2">Connection Error</h3>
                <p className="text-red-300 text-sm">{error}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadProblems}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Retry
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <TriangleLoader size={80} color="#3b82f6" />
            <p className="text-white text-lg mt-4">Loading problems...</p>
          </div>
        ) : problems.length === 0 && !error ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-lg">No problems found</p>
            <p className="text-zinc-500 text-sm mt-2">Try adjusting your search filters</p>
          </div>
        ) : !error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {problems.map((problem, index) => (
              <motion.div
                key={problem._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => router.push(`/problems/${problem.task_id}`)}
                className="bg-zinc-800 border border-zinc-700 rounded-lg p-5 hover:border-blue-500 hover:bg-zinc-750 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-zinc-500 font-mono text-sm">
                        #{problem.question_id}
                      </span>
                      <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
                        {problem.task_id
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {problem.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-zinc-700 text-zinc-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : null}

        {!loading && !error && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-2 mt-8"
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-zinc-800 text-white rounded-lg">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
