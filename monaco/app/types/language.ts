export interface Language {
  id: string;
  name: string;
  pistonRuntime: string;
  version: string;
  defaultCode: string;
  icon?: string;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
}
