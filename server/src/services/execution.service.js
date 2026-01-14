import axios from 'axios';
import appConfig from '../config/app.js';
import constants from '../config/constants.js';
import logger from '../middleware/logger.js';

const { PISTON } = constants;

/**
 * Execute code using Piston API
 */
export const executeCode = async (language, version, code, stdin = '', args = []) => {
  try {
    const startTime = Date.now();

    const response = await axios.post(
      `${appConfig.pistonApi.baseUrl}/execute`,
      {
        language,
        version,
        files: [
          {
            content: code
          }
        ],
        stdin,
        args,
        compile_timeout: PISTON.DEFAULT_COMPILE_TIMEOUT,
        run_timeout: PISTON.DEFAULT_TIMEOUT
      },
      {
        timeout: appConfig.pistonApi.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const executionTime = Date.now() - startTime;
    const data = response.data;

    let output = '';
    if (data.run?.stdout) {
      output += data.run.stdout;
    }
    if (data.run?.stderr) {
      if (output) output += '\n';
      output += data.run.stderr;
    }

    if (data.compile?.stderr) {
      return {
        success: false,
        output: '',
        error: data.compile.stderr,
        executionTime
      };
    }

    if (data.run?.code !== 0 && data.run?.stderr) {
      return {
        success: false,
        output: data.run.stdout || '',
        error: data.run.stderr,
        executionTime
      };
    }

    return {
      success: true,
      output: output || '(No output)',
      executionTime,
      language,
      version
    };
  } catch (error) {
    logger.error(`Error in executeCode: ${error.message}`);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Code execution timeout');
    }
    
    throw error;
  }
};

/**
 * Get available runtimes from Piston API
 */
export const getRuntimes = async () => {
  try {
    const response = await axios.get(`${appConfig.pistonApi.baseUrl}/runtimes`, {
      timeout: 10000
    });

    return response.data;
  } catch (error) {
    logger.error(`Error in getRuntimes: ${error.message}`);
    throw error;
  }
};

/**
 * Execute code with test cases
 */
export const executeWithTests = async (language, version, code, testCases) => {
  try {
    const results = [];

    for (const testCase of testCases) {
      const result = await executeCode(language, version, code, testCase.input);
      results.push({
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: result.output,
        passed: result.output.trim() === testCase.output.trim(),
        executionTime: result.executionTime,
        error: result.error
      });
    }

    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;

    return {
      success: passedTests === totalTests,
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      results
    };
  } catch (error) {
    logger.error(`Error in executeWithTests: ${error.message}`);
    throw error;
  }
};
