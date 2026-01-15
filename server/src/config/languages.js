/**
 * Language version mappings for Piston API
 * Maps language identifiers to their respective versions
 */
export const LANGUAGE_VERSIONS = {
  'python': '3.10.0',
  'javascript': '18.15.0',
  'typescript': '5.0.3',
  'java': '15.0.2',
  'cpp': '10.2.0',
  'c': '10.2.0',
  'csharp': '6.12.0',
  'go': '1.16.2',
  'rust': '1.68.2',
  'php': '8.2.3',
  'ruby': '3.0.1',
  'swift': '5.3.3',
  'kotlin': '1.8.20',
  'scala': '3.2.2',
  'r': '4.1.1',
  'perl': '5.36.0',
  'lua': '5.4.4',
  'haskell': '9.0.1',
  'elixir': '1.11.3',
  'dart': '2.19.6',
  'julia': '1.8.5',
  'clojure': '1.10.3',
  'fsharp': '6.0.0',
  'ocaml': '4.12.0',
  'racket': '8.3.0',
  'nim': '1.6.6',
  'crystal': '1.7.2',
  'zig': '0.10.1',
  'd': '2.101.0',
  'fortran': '10.2.0'
};

/**
 * Get version for a given language
 * @param {string} language - Language identifier
 * @returns {string|null} - Version string or null if not found
 */
export const getLanguageVersion = (language) => {
  return LANGUAGE_VERSIONS[language.toLowerCase()] || null;
};

/**
 * Check if a language is supported
 * @param {string} language - Language identifier
 * @returns {boolean} - True if language is supported
 */
export const isLanguageSupported = (language) => {
  return language.toLowerCase() in LANGUAGE_VERSIONS;
};

/**
 * Get all supported languages
 * @returns {string[]} - Array of supported language identifiers
 */
export const getSupportedLanguages = () => {
  return Object.keys(LANGUAGE_VERSIONS);
};

export default {
  LANGUAGE_VERSIONS,
  getLanguageVersion,
  isLanguageSupported,
  getSupportedLanguages
};
