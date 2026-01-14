# Monaco Editor - Research Documentation

## Overview
Monaco Editor is the code editor that powers VS Code, providing rich IntelliSense, validation, and syntax highlighting for web applications.

---

## Key Limitations & Constraints

### 1. **Tokenization Line Length**
- **Default Limit**: `20,000` characters per line
- **Configuration**: `editor.maxTokenizationLineLength`
- **Impact**: Lines exceeding this limit skip tokenization (no syntax highlighting)
- **Recommendation**: Increase to `200,000` for better handling, or `2,000,000` for extreme cases
- **Note**: Very long lines can cause UI freezing/unresponsiveness

### 2. **Tokenization Strategy**
- **Behavior**: Eager tokenization of entire document (not lazy/on-demand)
- **Reason**: Ensures correct syntax colors when jumping to any location
- **Performance**: Yields every ~5ms to prevent blocking main thread
- **Issue**: Single long line can block for longer than 5ms
- **Status**: Async tokenization available in VS Code, but NOT in Monaco Editor (uses Monarch)

### 3. **File Size Performance**
- **Large Files**: Monaco struggles with files containing very long lines
- **Memory**: Can consume significant memory for large documents
- **Recommendation**: 
  - Enable `editor.asyncTokenization` (if available)
  - Disable minimap for large files
  - Consider file size warnings for users

### 4. **Configuration Options**
```javascript
monaco.editor.create(container, {
  maxTokenizationLineLength: 20000,  // Default
  minimap: { enabled: false },        // Disable for performance
  wordWrap: 'on',                     // Prevent long lines
  // ... other options
});
```

### 5. **Best Practices**
- ✅ Set appropriate `maxTokenizationLineLength` based on use case
- ✅ Warn users about pasting very long lines
- ✅ Consider disabling features (minimap, bracket matching) for large files
- ✅ Monitor performance with large code inputs
- ⚠️ No hard file size limit, but performance degrades with size

---

## Token/Data Limits

### Input Limits
- **No explicit token limit** for Monaco Editor itself
- **Practical limit**: Determined by browser memory and performance
- **Line length**: Primary constraint (see above)

### Output Display
- **No hard limit** on displayed content
- **Performance consideration**: Very large outputs may cause lag

---

## Browser Considerations
- **Memory**: Large files can consume 200MB+ of browser memory
- **UI Thread**: Tokenization runs on main thread (can cause freezing)
- **Recommendation**: Implement client-side file size checks before loading

---

## Summary
Monaco Editor is powerful but has performance constraints with:
- **Long lines** (>20K characters)
- **Large files** (multiple MB)
- **Eager tokenization** strategy

**Key Takeaway**: Configure `maxTokenizationLineLength` appropriately and warn users about performance implications of large code inputs.
