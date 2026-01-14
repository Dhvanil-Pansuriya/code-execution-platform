# Piston API - Research Documentation

## Overview
Piston is a high-performance code execution engine that safely runs untrusted code in isolated sandboxed environments using Docker and Isolate.

**Public API**: `https://emkc.org/api/v2/piston/`

---

## Rate Limiting

### Public API Limits
- **Rate Limit**: **5 requests per second** (300 requests/minute)
- **Enforcement**: Strict - exceeding limit returns HTTP 429 (Too Many Requests)
- **Note**: As of May 7, 2024, no unlimited keys are granted
- **Recommendation**: For >5 req/sec, self-host Piston

### Rate Limit Strategy
- Evaluated over **1 or 10 second** periods
- Ensures even distribution across the minute
- Continuous retry won't work (counts against limit)

---

## Input/Output Limits

### Code Input
- **File Content**: No explicit size limit in API
- **Encoding**: Supports `utf8`, `base64`, `hex`
- **Multiple Files**: Supported (array of files)
- **stdin**: Optional text input (no documented limit)

### Output Limits
- **stdout**: **1,024 characters** (default)
- **stderr**: **1,024 characters** (default)
- **Configuration**: `PISTON_OUTPUT_MAX_SIZE` (default: 1024)
- **Exceeded**: Returns status code `OL` (stdout) or `EL` (stderr)

### File System Limits
- **Max Open Files**: 64 (default)
- **Max File Size**: 10 MB per file (default: 10,000,000 bytes)
- **Max Files**: 2,048 total files

---

## Execution Limits

### Timeout Limits
- **Compile Timeout**: 10 seconds (10,000ms) - default
- **Run Timeout**: 3 seconds (3,000ms) - default
- **Configurable**: Can be set per request (up to server maximum)
- **Exceeded**: Returns status code `TO` (timeout)

### Memory Limits
- **Compile Memory**: Unlimited by default (`-1`)
- **Run Memory**: Unlimited by default (`-1`)
- **Configurable**: Can be set in bytes per request
- **Note**: Self-hosted instances can configure limits

### Process Limits
- **Max Processes**: 256 (default)
- **Purpose**: Prevents fork bombs (`:(){ :|: &};:`)
- **Configurable**: `PISTON_MAX_PROCESS_COUNT`

---

## Security Constraints

### Sandboxing Features
- ✅ **Network Disabled**: No outgoing connections by default
- ✅ **Isolated Namespaces**: Each execution in separate Linux namespace
- ✅ **Unprivileged Users**: Different user per submission
- ✅ **Resource Limits**: CPU, memory, file, process caps
- ✅ **Cleanup**: All temp space cleaned after execution

### Resource Caps (Default)
| Resource | Limit | Purpose |
|----------|-------|---------|
| Processes | 256 | Prevent fork bombs |
| Open Files | 64 | Prevent inode exhaustion |
| File Size | 10 MB | Prevent disk exhaustion |
| Max Files | 2,048 | Prevent file-based attacks |
| stdout/stderr | 1,024 chars | Prevent output bombs |
| Run Time | 3 seconds | Prevent infinite loops |
| Compile Time | 10 seconds | Prevent slow compilation |

---

## API Request Format

### Execute Endpoint
```json
POST /api/v2/piston/execute
{
  "language": "python",
  "version": "3.10.0",
  "files": [{
    "name": "main.py",
    "content": "print('Hello World')"
  }],
  "stdin": "",
  "args": [],
  "compile_timeout": 10000,
  "run_timeout": 3000,
  "compile_memory_limit": -1,
  "run_memory_limit": -1
}
```

### Response Status Codes
- `RE` - Runtime Error
- `SG` - Signal (killed by signal)
- `TO` - Timeout
- `OL` - Output Length Exceeded (stdout)
- `EL` - Error Length Exceeded (stderr)
- `XX` - Internal Error

---

## Supported Languages
**60+ languages** including:
- JavaScript, TypeScript, Python, Java, C#, C++, C
- Go, Rust, PHP, Ruby, Swift, Kotlin
- Scala, Perl, R, Haskell, and many more

---

## Best Practices

### For Public API Users
1. ✅ **Respect rate limit**: Max 5 requests/second
2. ✅ **Implement retry logic**: Exponential backoff for 429 errors
3. ✅ **Set reasonable timeouts**: Don't use maximum unless needed
4. ✅ **Limit output**: Keep code output concise
5. ✅ **Handle errors gracefully**: Check status codes

### For Application Developers
1. ✅ **Client-side validation**: Check code size before sending
2. ✅ **Queue requests**: Don't burst requests
3. ✅ **Cache results**: For identical code executions
4. ✅ **User feedback**: Show execution time and limits
5. ✅ **Consider self-hosting**: For high-volume applications

---

## Summary

### Key Constraints
| Aspect | Limit |
|--------|-------|
| **Rate Limit** | 5 requests/second |
| **Output Size** | 1,024 characters |
| **Run Timeout** | 3 seconds (default) |
| **Compile Timeout** | 10 seconds (default) |
| **Max File Size** | 10 MB |
| **Max Processes** | 256 |

### When to Self-Host
- Need >5 requests/second
- Require custom timeout/memory limits
- Need guaranteed availability
- Want to customize security settings

**Key Takeaway**: Piston's public API is generous but limited. Design your application to respect rate limits and handle timeouts gracefully. For production apps with high traffic, consider self-hosting.
