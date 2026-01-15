import API_BASE_URL from './config';

export interface Problem {
  _id: string;
  task_id: string;
  question_id: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  problem_description: string;
  starter_code: string;
  estimated_date: string;
  prompt: string;
  completion: string;
  entry_point: string;
  test: string;
  input_output: Array<{
    input: string;
    output: string;
  }>;
  query: string;
  response: string;
}

export interface PaginatedResponse {
  problems: Problem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
}

export interface TestResult {
  testNumber: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string;
}

export interface SubmissionResult {
  allResults: TestResult[];
  passedResults: TestResult[];
  failedResults: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
}

export async function fetchProblems(params?: {
  page?: number;
  limit?: number;
  difficulty?: string;
  tags?: string;
  search?: string;
}): Promise<PaginatedResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
  if (params?.tags) queryParams.append('tags', params.tags);
  if (params?.search) queryParams.append('search', params.search);

  const response = await fetch(`${API_BASE_URL}/problems?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch problems');
  }

  const data = await response.json();
  return {
    problems: data.data || [],
    total: data.pagination?.totalItems || 0,
    page: data.pagination?.currentPage || 1,
    limit: data.pagination?.pageSize || 10,
    totalPages: data.pagination?.totalPages || 1
  };
}

export async function fetchProblemByTaskId(taskId: string): Promise<Problem> {
  const response = await fetch(`${API_BASE_URL}/problems/${taskId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch problem');
  }

  const data = await response.json();
  return data.data;
}

export async function runCode(
  language: string,
  code: string,
  stdin?: string
): Promise<ExecutionResult> {
  const response = await fetch(`${API_BASE_URL}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language,
      code,
      stdin: stdin || '',
      args: []
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to execute code');
  }

  const data = await response.json();
  return data.data;
}

export async function submitCode(
  language: string,
  code: string,
  testCases: Array<{ input: string; output: string }>
): Promise<SubmissionResult> {
  const response = await fetch(`${API_BASE_URL}/execute/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language,
      code,
      testCases
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to submit code');
  }

  const data = await response.json();
  return data.data;
}
