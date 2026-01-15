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
        executionTime,
        isCompileError: true
      };
    }

    if (data.run?.code !== 0 && data.run?.stderr) {
      return {
        success: false,
        output: data.run.stdout || '',
        error: data.run.stderr,
        executionTime,
        isRuntimeError: true
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
    const allResults = [];
    const passedResults = [];
    const failedResults = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const result = await executeCode(language, version, code, testCase.input);
      
      const testResult = {
        testNumber: i + 1,
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: result.output,
        passed: result.output.trim() === testCase.output.trim(),
        executionTime: result.executionTime,
        error: result.error
      };

      allResults.push(testResult);

      if (testResult.passed) {
        passedResults.push(testResult);
      } else {
        failedResults.push(testResult);
      }

      // If first test case has compilation or syntax error, stop execution
      if (i === 0 && (result.isCompileError || result.error)) {
        console.log(`Compilation/Syntax error detected in first test case. Stopping execution.`);
        console.log(`Error: ${result.error}`);
        
        const totalTests = allResults.length;
        const passedTests = passedResults.length;
        const failedTests = failedResults.length;

        console.log(`Test Results: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests} | Stopped due to error`);

        return {
          success: false,
          totalTests,
          passedTests,
          failedTests,
          allResults,
          passedResults,
          failedResults,
          stoppedEarly: true,
          errorMessage: result.error
        };
      }
    }

    const totalTests = allResults.length;
    const passedTests = passedResults.length;
    const failedTests = failedResults.length;

    console.log(`Test Results: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests} | Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);

    return {
      success: passedTests === totalTests,
      totalTests,
      passedTests,
      failedTests,
      allResults,
      passedResults,
      failedResults
    };
  } catch (error) {
    logger.error(`Error in executeWithTests: ${error.message}`);
    throw error;
  }
};
