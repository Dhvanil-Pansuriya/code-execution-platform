import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Problem from '../models/Problem.js';
import connectDB from '../config/database.js';
import logger from '../middleware/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load problems from JSONL file
 */
const loadProblemsFromJSONL = (filePath) => {
  try {
    const fullPath = path.join(__dirname, '../../', filePath);
    const rawData = fs.readFileSync(fullPath, 'utf-8');
    const lines = rawData.trim().split('\n');
    
    return lines.map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        logger.error(`Error parsing line ${index + 1}: ${error.message}`);
        return null;
      }
    }).filter(item => item !== null);
  } catch (error) {
    logger.error(`Error loading JSONL file: ${error.message}`);
    return [];
  }
};

/**
 * Load single problem from JSON file
 */
const loadProblemFromJSON = (filePath) => {
  try {
    const fullPath = path.join(__dirname, '../../', filePath);
    const rawData = fs.readFileSync(fullPath, 'utf-8');
    return [JSON.parse(rawData)];
  } catch (error) {
    logger.error(`Error loading JSON file: ${error.message}`);
    return [];
  }
};

/**
 * Seed problems to database
 */
const seedProblems = async (dataSource = 'data/data.jsonl') => {
  try {
    await connectDB();

    logger.info('Starting problem seeding...');

    let problems = [];
    if (dataSource.endsWith('.jsonl')) {
      problems = loadProblemsFromJSONL(dataSource);
    } else if (dataSource.endsWith('.json')) {
      problems = loadProblemFromJSON(dataSource);
    } else {
      throw new Error('Unsupported file format. Use .json or .jsonl');
    }

    if (problems.length === 0) {
      logger.warn('No problems found to seed');
      return;
    }

    logger.info(`Loaded ${problems.length} problems from ${dataSource}`);

    const deleteResult = await Problem.deleteMany({});
    logger.info(`Cleared ${deleteResult.deletedCount} existing problems`);

    const insertResult = await Problem.insertMany(problems, { ordered: false });
    logger.info(`Successfully seeded ${insertResult.length} problems`);

    const stats = await Problem.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    logger.info('Seeding statistics:');
    stats.forEach(stat => {
      logger.info(`  ${stat._id}: ${stat.count} problems`);
    });

    logger.info('Seeding completed successfully!');
  } catch (error) {
    if (error.code === 11000) {
      logger.error('Duplicate key error - some problems already exist');
    } else {
      logger.error(`Seeding error: ${error.message}`);
    }
  } finally {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  }
};

/**
 * Clear all problems from database
 */
const clearProblems = async () => {
  try {
    await connectDB();
    const result = await Problem.deleteMany({});
    logger.info(`Cleared ${result.deletedCount} problems from database`);
  } catch (error) {
    logger.error(`Error clearing problems: ${error.message}`);
  } finally {
    await mongoose.connection.close();
  }
};

const args = process.argv.slice(2);
const command = args[0];
const dataSource = args[1] || 'data/data.jsonl';

if (command === 'seed') {
  seedProblems(dataSource);
} else if (command === 'clear') {
  clearProblems();
} else {
  console.log(`
Usage:
  node src/seeders/problemSeeder.js seed [dataSource]
  node src/seeders/problemSeeder.js clear

Examples:
  node src/seeders/problemSeeder.js seed data/data.jsonl
  node src/seeders/problemSeeder.js seed data/sample.json
  node src/seeders/problemSeeder.js clear
  `);
}

export { seedProblems, clearProblems };
