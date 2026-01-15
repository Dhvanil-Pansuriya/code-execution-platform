import * as executionService from '../services/execution.service.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import constants from '../config/constants.js';
import { getLanguageVersion, isLanguageSupported } from '../config/languages.js';
import logger from '../middleware/logger.js';

const { STATUS_CODES } = constants;

/**
 * Execute code
 */
export const executeCode = async (req, res, next) => {
  try {
    const { language, code, stdin = '', args = [] } = req.body;

    // Validate required fields
    if (!language || !code) {
      return errorResponse(
        res,
        'Missing required fields: language and code are required',
        STATUS_CODES.BAD_REQUEST
      );
    }

    // Check if code is empty or only whitespace
    if (!code.trim()) {
      return errorResponse(
        res,
        'Code cannot be empty',
        STATUS_CODES.BAD_REQUEST
      );
    }

    // Check if language is supported
    if (!isLanguageSupported(language)) {
      return errorResponse(
        res,
        `Unsupported language: ${language}`,
        STATUS_CODES.BAD_REQUEST
      );
    }

    // Get version from config
    const version = getLanguageVersion(language);

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
    const { language, code, testCases } = req.body;

    // Validate required fields
    if (!language || !code || !testCases || !Array.isArray(testCases)) {
      return errorResponse(
        res,
        'Missing required fields: language, code, and testCases (array) are required',
        STATUS_CODES.BAD_REQUEST
      );
    }

    // Check if code is empty or only whitespace
    if (!code.trim()) {
      return errorResponse(
        res,
        'Code cannot be empty',
        STATUS_CODES.BAD_REQUEST
      );
    }

    // Check if language is supported
    if (!isLanguageSupported(language)) {
      return errorResponse(
        res,
        `Unsupported language: ${language}`,
        STATUS_CODES.BAD_REQUEST
      );
    }

    // Get version from config
    const version = getLanguageVersion(language);

    const result = await executionService.executeWithTests(language, version, code, testCases);

    return successResponse(res, result, 'Code executed with tests successfully');
  } catch (error) {
    logger.error(`Error in executeWithTests controller: ${error.message}`);
    next(error);
  }
};
