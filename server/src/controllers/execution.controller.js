import * as executionService from '../services/execution.service.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import constants from '../config/constants.js';
import logger from '../middleware/logger.js';

const { STATUS_CODES } = constants;

/**
 * Execute code
 */
export const executeCode = async (req, res, next) => {
  try {
    const { language, version, code, stdin = '', args = [] } = req.body;

    if (!language || !version || !code) {
      return errorResponse(
        res,
        'Missing required fields: language, version, code',
        STATUS_CODES.BAD_REQUEST
      );
    }

    const result = await executionService.executeCode(language, version, code, stdin, args);

    return successResponse(res, result, 'Code executed successfully');
  } catch (error) {
    logger.error(`Error in executeCode controller: ${error.message}`);
    
    if (error.message === 'Code execution timeout') {
      return errorResponse(res, error.message, STATUS_CODES.SERVICE_UNAVAILABLE);
    }
    
    next(error);
  }
};

/**
 * Get available runtimes
 */
export const getRuntimes = async (req, res, next) => {
  try {
    const runtimes = await executionService.getRuntimes();
    return successResponse(res, runtimes, 'Runtimes retrieved successfully');
  } catch (error) {
    logger.error(`Error in getRuntimes controller: ${error.message}`);
    next(error);
  }
};

/**
 * Execute code with test cases
 */
export const executeWithTests = async (req, res, next) => {
  try {
    const { language, version, code, testCases } = req.body;

    if (!language || !version || !code || !testCases || !Array.isArray(testCases)) {
      return errorResponse(
        res,
        'Missing required fields: language, version, code, testCases (array)',
        STATUS_CODES.BAD_REQUEST
      );
    }

    const result = await executionService.executeWithTests(language, version, code, testCases);

    return successResponse(res, result, 'Code executed with tests successfully');
  } catch (error) {
    logger.error(`Error in executeWithTests controller: ${error.message}`);
    next(error);
  }
};
