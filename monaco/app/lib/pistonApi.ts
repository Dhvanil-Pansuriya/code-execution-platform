import { ExecutionResult } from "../types/language";

const PISTON_API_URL = "https://emkc.org/api/v2/piston";

export async function executeCode(
  language: string,
  version: string,
  code: string
): Promise<ExecutionResult> {
  const startTime = Date.now();

  try {
    const response = await fetch(`${PISTON_API_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: language,
        version: version,
        files: [
          {
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const executionTime = Date.now() - startTime;

    // Combine stdout and stderr
    let output = "";
    if (data.run?.stdout) {
      output += data.run.stdout;
    }
    if (data.run?.stderr) {
      if (output) output += "\n";
      output += data.run.stderr;
    }

    // Check for compilation errors
    if (data.compile?.stderr) {
      return {
        success: false,
        output: "",
        error: data.compile.stderr,
        executionTime,
      };
    }

    // Check for runtime errors
    if (data.run?.code !== 0 && data.run?.stderr) {
      return {
        success: false,
        output: data.run.stdout || "",
        error: data.run.stderr,
        executionTime,
      };
    }

    return {
      success: true,
      output: output || "(No output)",
      executionTime,
    };
  } catch (error) {
    return {
      success: false,
      output: "",
      error:
        error instanceof Error
          ? error.message
          : "An unknown error occurred while executing code",
      executionTime: Date.now() - startTime,
    };
  }
}

export async function getPistonRuntimes() {
  try {
    const response = await fetch(`${PISTON_API_URL}/runtimes`);
    if (!response.ok) {
      throw new Error("Failed to fetch runtimes");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Piston runtimes:", error);
    return [];
  }
}
