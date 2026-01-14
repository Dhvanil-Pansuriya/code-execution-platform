import express from 'express';
import * as problemController from '../controllers/problem.controller.js';
import { validatePagination } from '../middleware/validator.js';

const router = express.Router();

/**
 * GET /api/v1/problems
 * Get all problems with filters and pagination
 * Query params: difficulty, tags, search, page, limit, sortBy, sortOrder
 */
router.get('/', validatePagination, problemController.getAllProblems);

/**
 * GET /api/v1/problems/random
 * Get random problem
 * Query params: difficulty (optional)
 */
router.get('/random', problemController.getRandomProblem);

/**
 * GET /api/v1/problems/tags
 * Get all unique tags
 */
router.get('/tags', problemController.getAllTags);

/**
 * GET /api/v1/problems/statistics
 * Get problems statistics
 */
router.get('/statistics', problemController.getStatistics);

/**
 * GET /api/v1/problems/difficulty/:difficulty
 * Get problems by difficulty
 * Params: difficulty (Easy, Medium, Hard)
 * Query params: page, limit
 */
router.get('/difficulty/:difficulty', validatePagination, problemController.getProblemsByDifficulty);

/**
 * GET /api/v1/problems/tag/:tag
 * Get problems by tag
 * Params: tag
 * Query params: page, limit
 */
router.get('/tag/:tag', validatePagination, problemController.getProblemsByTag);

/**
 * GET /api/v1/problems/question/:questionId
 * Get problem by question_id
 * Params: questionId (number)
 */
router.get('/question/:questionId', problemController.getProblemByQuestionId);

/**
 * GET /api/v1/problems/:taskId
 * Get problem by task_id
 * Params: taskId (string)
 */
router.get('/:taskId', problemController.getProblemByTaskId);

/**
 * POST /api/v1/problems
 * Create new problem
 * Body: problem object
 */
router.post('/', problemController.createProblem);

/**
 * PUT /api/v1/problems/:taskId
 * Update problem by task_id
 * Params: taskId
 * Body: update data
 */
router.put('/:taskId', problemController.updateProblem);

/**
 * DELETE /api/v1/problems/:taskId
 * Delete problem by task_id
 * Params: taskId
 */
router.delete('/:taskId', problemController.deleteProblem);

export default router;
