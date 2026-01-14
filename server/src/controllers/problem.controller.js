import * as problemService from '../services/problem.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js';
import constants from '../config/constants.js';

const { STATUS_CODES, MESSAGES } = constants;

/**
 * Get all problems with filters and pagination
 */
export const getAllProblems = async (req, res, next) => {
  try {
    const {
      difficulty,
      tags,
      search,
      page = 1,
      limit = 10,
      sortBy = 'question_id',
      sortOrder = 'asc'
    } = req.query;

    const options = {
      difficulty,
      tags: tags ? tags.split(',') : undefined,
      search,
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder
    };

    const result = await problemService.getAllProblems({}, options);

    return paginatedResponse(
      res,
      result.problems,
      result.page,
      result.limit,
      result.total,
      'Problems retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get problem by task_id
 */
export const getProblemByTaskId = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const problem = await problemService.getProblemByTaskId(taskId);

    if (!problem) {
      return errorResponse(res, 'Problem not found', STATUS_CODES.NOT_FOUND);
    }

    return successResponse(res, problem, 'Problem retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get problem by question_id
 */
export const getProblemByQuestionId = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const problem = await problemService.getProblemByQuestionId(parseInt(questionId));

    if (!problem) {
      return errorResponse(res, 'Problem not found', STATUS_CODES.NOT_FOUND);
    }

    return successResponse(res, problem, 'Problem retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get random problem
 */
export const getRandomProblem = async (req, res, next) => {
  try {
    const { difficulty } = req.query;
    const problem = await problemService.getRandomProblem(difficulty);

    if (!problem) {
      return errorResponse(res, 'No problems found', STATUS_CODES.NOT_FOUND);
    }

    return successResponse(res, problem, 'Random problem retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get problems by difficulty
 */
export const getProblemsByDifficulty = async (req, res, next) => {
  try {
    const { difficulty } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await problemService.getProblemsByDifficulty(difficulty, options);

    return paginatedResponse(
      res,
      result.problems,
      result.page,
      result.limit,
      result.total,
      `${difficulty} problems retrieved successfully`
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get problems by tag
 */
export const getProblemsByTag = async (req, res, next) => {
  try {
    const { tag } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await problemService.getProblemsByTag(tag, options);

    return paginatedResponse(
      res,
      result.problems,
      result.page,
      result.limit,
      result.total,
      `Problems with tag '${tag}' retrieved successfully`
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create new problem
 */
export const createProblem = async (req, res, next) => {
  try {
    const problemData = req.body;
    const problem = await problemService.createProblem(problemData);

    return successResponse(
      res,
      problem,
      'Problem created successfully',
      STATUS_CODES.CREATED
    );
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(
        res,
        'Problem with this task_id or question_id already exists',
        STATUS_CODES.BAD_REQUEST
      );
    }
    next(error);
  }
};

/**
 * Update problem by task_id
 */
export const updateProblem = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;

    const problem = await problemService.updateProblem(taskId, updateData);

    if (!problem) {
      return errorResponse(res, 'Problem not found', STATUS_CODES.NOT_FOUND);
    }

    return successResponse(res, problem, 'Problem updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete problem by task_id
 */
export const deleteProblem = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const problem = await problemService.deleteProblem(taskId);

    if (!problem) {
      return errorResponse(res, 'Problem not found', STATUS_CODES.NOT_FOUND);
    }

    return successResponse(res, { task_id: taskId }, 'Problem deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all unique tags
 */
export const getAllTags = async (req, res, next) => {
  try {
    const tags = await problemService.getAllTags();
    return successResponse(res, tags, 'Tags retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get statistics
 */
export const getStatistics = async (req, res, next) => {
  try {
    const stats = await problemService.getStatistics();
    return successResponse(res, stats, 'Statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};
