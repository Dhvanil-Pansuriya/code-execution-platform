import Problem from '../models/Problem.js';
import logger from '../middleware/logger.js';

/**
 * Get all problems with filtering, sorting, and pagination
 */
export const getAllProblems = async (filters = {}, options = {}) => {
  try {
    const {
      difficulty,
      tags,
      search,
      page = 1,
      limit = 10,
      sortBy = 'question_id',
      sortOrder = 'asc'
    } = options;

    const query = { ...filters };

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (tags && tags.length > 0) {
      query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const problems = await Problem.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Problem.countDocuments(query);

    return {
      problems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error(`Error in getAllProblems: ${error.message}`);
    throw error;
  }
};

/**
 * Get problem by task_id
 */
export const getProblemByTaskId = async (taskId) => {
  try {
    const problem = await Problem.findOne({ task_id: taskId }).lean();
    return problem;
  } catch (error) {
    logger.error(`Error in getProblemByTaskId: ${error.message}`);
    throw error;
  }
};

/**
 * Get problem by question_id
 */
export const getProblemByQuestionId = async (questionId) => {
  try {
    const problem = await Problem.findOne({ question_id: questionId }).lean();
    return problem;
  } catch (error) {
    logger.error(`Error in getProblemByQuestionId: ${error.message}`);
    throw error;
  }
};

/**
 * Get random problem
 */
export const getRandomProblem = async (difficulty = null) => {
  try {
    const query = difficulty ? { difficulty } : {};
    const count = await Problem.countDocuments(query);
    
    if (count === 0) {
      return null;
    }

    const random = Math.floor(Math.random() * count);
    const problem = await Problem.findOne(query).skip(random).lean();
    
    return problem;
  } catch (error) {
    logger.error(`Error in getRandomProblem: ${error.message}`);
    throw error;
  }
};

/**
 * Get problems by difficulty
 */
export const getProblemsByDifficulty = async (difficulty, options = {}) => {
  try {
    return await getAllProblems({ difficulty }, options);
  } catch (error) {
    logger.error(`Error in getProblemsByDifficulty: ${error.message}`);
    throw error;
  }
};

/**
 * Get problems by tag
 */
export const getProblemsByTag = async (tag, options = {}) => {
  try {
    return await getAllProblems({ tags: tag }, options);
  } catch (error) {
    logger.error(`Error in getProblemsByTag: ${error.message}`);
    throw error;
  }
};

/**
 * Create new problem
 */
export const createProblem = async (problemData) => {
  try {
    const problem = new Problem(problemData);
    await problem.save();
    logger.info(`Created problem: ${problem.task_id}`);
    return problem;
  } catch (error) {
    logger.error(`Error in createProblem: ${error.message}`);
    throw error;
  }
};

/**
 * Update problem by task_id
 */
export const updateProblem = async (taskId, updateData) => {
  try {
    const problem = await Problem.findOneAndUpdate(
      { task_id: taskId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (problem) {
      logger.info(`Updated problem: ${taskId}`);
    }
    
    return problem;
  } catch (error) {
    logger.error(`Error in updateProblem: ${error.message}`);
    throw error;
  }
};

/**
 * Delete problem by task_id
 */
export const deleteProblem = async (taskId) => {
  try {
    const problem = await Problem.findOneAndDelete({ task_id: taskId });
    
    if (problem) {
      logger.info(`Deleted problem: ${taskId}`);
    }
    
    return problem;
  } catch (error) {
    logger.error(`Error in deleteProblem: ${error.message}`);
    throw error;
  }
};

/**
 * Get all unique tags
 */
export const getAllTags = async () => {
  try {
    const tags = await Problem.distinct('tags');
    return tags.sort();
  } catch (error) {
    logger.error(`Error in getAllTags: ${error.message}`);
    throw error;
  }
};

/**
 * Get statistics
 */
export const getStatistics = async () => {
  try {
    const stats = await Problem.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Problem.countDocuments();
    const tags = await Problem.distinct('tags');

    return {
      total,
      byDifficulty: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      totalTags: tags.length
    };
  } catch (error) {
    logger.error(`Error in getStatistics: ${error.message}`);
    throw error;
  }
};
