#!/usr/bin/env node

/**
 * scout-block.js - PreToolUse hook for blocking redundant directories and sensitive files
 *
 * Blocks access to:
 * - Dependency directories: node_modules, target, venv, vendor, etc.
 * - Build artifacts: dist, build, .next, .nuxt, etc.
 * - Sensitive files: .env, credentials, *.pem, *.key, etc.
 *
 * Exit Codes:
 * - 0: Command allowed
 * - 2: Command blocked
 *
 * Supports tools: Bash, Read, Glob, Grep
 */

const fs = require('fs');

// Blocked directory patterns (token savings)
// Using word boundaries (\b) or path separators to avoid false positives
const BLOCKED_DIRS = [
  // JavaScript/TypeScript
  /\bnode_modules\b/,
  /\bdist\//,
  /\bbuild\//,
  /\.next\b/,
  /\.nuxt\b/,
  /\.output\b/,

  // Rust
  /\btarget\//,

  // Go
  /\bvendor\//,

  // Python
  /\b__pycache__\b/,
  /\bvenv\//,
  /\.venv\//,
  /\bsite-packages\b/,

  // General
  /\.git\//,
  /\.cache\//,
  /\bcoverage\//,
  /\.nyc_output\b/,
];

// Blocked sensitive file patterns (security)
const BLOCKED_FILES = [
  // Environment files
  /\.env$/,
  /\.env\.[^/]+$/,

  // Credentials
  /\bcredentials\b/i,
  /\bsecrets?\b/i,

  // Keys
  /\.pem$/,
  /\.key$/,
  /\.p12$/,
  /\.pfx$/,

  // Auth tokens
  /\.netrc$/,
  /\.npmrc$/,
];

/**
 * Check if a path matches any blocked pattern
 */
function isBlocked(pathToCheck) {
  if (!pathToCheck) return { blocked: false };

  // Normalize path separators
  const normalizedPath = pathToCheck.replace(/\\/g, '/');

  // Check directory patterns
  for (const pattern of BLOCKED_DIRS) {
    if (pattern.test(normalizedPath)) {
      return {
        blocked: true,
        reason: 'directory',
        pattern: pattern.toString(),
        message: `Dependency/build directories waste tokens and are not useful for code analysis.`,
      };
    }
  }

  // Check sensitive file patterns
  for (const pattern of BLOCKED_FILES) {
    if (pattern.test(normalizedPath)) {
      return {
        blocked: true,
        reason: 'sensitive',
        pattern: pattern.toString(),
        message: `This file may contain secrets and credentials.`,
      };
    }
  }

  return { blocked: false };
}

/**
 * Extract paths to check from tool input based on tool type
 */
function extractPaths(toolName, toolInput) {
  const paths = [];

  switch (toolName) {
    case 'Bash':
    case 'run_shell_command':
      // Skip Bash commands - they don't have structured path parameters
      // Checking substring matches on arbitrary commands causes too many false positives
      // e.g., `echo "building dist files"` would incorrectly match /\bdist\//
      break;

    case 'Read':
    case 'read_file':
      if (toolInput.file_path) {
        paths.push(toolInput.file_path);
      }
      break;

    case 'Glob':
    case 'glob':
      if (toolInput.pattern) {
        paths.push(toolInput.pattern);
      }
      if (toolInput.path) {
        paths.push(toolInput.path);
      }
      if (toolInput.dir_path) {
        paths.push(toolInput.dir_path);
      }
      break;

    case 'Grep':
    case 'grep_search':
      if (toolInput.path) {
        paths.push(toolInput.path);
      }
      if (toolInput.dir_path) {
        paths.push(toolInput.dir_path);
      }
      if (toolInput.glob) {
        paths.push(toolInput.glob);
      }
      if (toolInput.include_pattern) {
        paths.push(toolInput.include_pattern);
      }
      break;

    default:
      // For other tools, check common path fields
      if (toolInput.path) paths.push(toolInput.path);
      if (toolInput.file_path) paths.push(toolInput.file_path);
      if (toolInput.dir_path) paths.push(toolInput.dir_path);
      if (toolInput.pattern) paths.push(toolInput.pattern);
  }

  return paths;
}

/**
 * Main execution
 */
function main() {
  try {
    // Read JSON input from stdin
    const input = fs.readFileSync(0, 'utf-8');

    if (!input || input.trim().length === 0) {
      // Empty input - allow (don't block on parse errors)
      process.exit(0);
    }

    let data;
    try {
      data = JSON.parse(input);
    } catch (parseError) {
      // JSON parse error - allow (don't block on parse errors)
      process.exit(0);
    }

    const toolName = data.tool_name;
    const toolInput = data.tool_input || {};

    // Extract paths to check
    const pathsToCheck = extractPaths(toolName, toolInput);

    // Check each path
    for (const pathToCheck of pathsToCheck) {
      const result = isBlocked(pathToCheck);

      if (result.blocked) {
        // Output error message
        console.error(`BLOCKED: Access denied.`);
        console.error(`Path: ${pathToCheck}`);
        console.error(`Reason: ${result.message}`);
        console.error(`Bypass: Ask the user to confirm if this access is intentional.`);

        // Exit with code 2 to block the tool
        process.exit(2);
      }
    }

    // All paths allowed
    process.exit(0);

  } catch (error) {
    // On any error, allow the command (fail open)
    // This prevents the hook from breaking Claude Code
    process.exit(0);
  }
}

main();
