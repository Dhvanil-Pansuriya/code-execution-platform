import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import appConfig from '../config/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load problem data from JSON file
 */
export const loadProblemsData = () => {
  try {
    const dataPath = path.join(__dirname, '../../', appConfig.dataFilePath);
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);
    
    // If data is a single object, wrap it in an array
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error loading problems data:', error);
    return [];
  }
};

/**
 * Load problems from JSONL file (for future use)
 */
export const loadProblemsFromJSONL = (filePath) => {
  try {
    const dataPath = path.join(__dirname, '../../', filePath);
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const lines = rawData.trim().split('\n');
    
    return lines.map(line => {
      try {
        return JSON.parse(line);
      } catch (error) {
        console.error('Error parsing JSONL line:', error);
        return null;
      }
    }).filter(item => item !== null);
  } catch (error) {
    console.error('Error loading JSONL data:', error);
    return [];
  }
};

/**
 * Cache for loaded data
 */
let cachedProblems = null;

/**
 * Get problems with caching
 */
export const getProblemsData = () => {
  if (!cachedProblems) {
    cachedProblems = loadProblemsData();
  }
  return cachedProblems;
};

/**
 * Refresh cache
 */
export const refreshCache = () => {
  cachedProblems = null;
  return getProblemsData();
};
