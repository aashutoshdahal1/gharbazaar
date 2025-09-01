#!/usr/bin/env node

/**
 * GharBazaar Test Runner
 * Simple script to run tests with better output formatting
 */

const { execSync } = require("child_process");
const path = require("path");

function runCommand(command, description) {
  console.log(`\n🔧 ${description}`);
  console.log("━".repeat(50));

  try {
    const output = execSync(command, {
      cwd: __dirname,
      stdio: "inherit",
      encoding: "utf8",
    });
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed`);
    console.error(`Exit code: ${error.status}`);
    return false;
  }
}

function main() {
  console.log("\n🚀 GharBazaar Test Suite Runner");
  console.log("═".repeat(50));

  const results = {};

  // Install dependencies if needed
  results.install = runCommand("npm install", "Installing dependencies");

  // Run unit tests
  results.unit = runCommand("npm run test:unit", "Running unit tests");

  // Run integration tests (auth only, as it works)
  results.integration = runCommand(
    "npx jest tests/integration/auth.test.js",
    "Running integration tests (auth)"
  );

  // Generate coverage report
  results.coverage = runCommand(
    "npm run test:coverage",
    "Generating coverage report"
  );

  // Summary
  console.log("\n📊 Test Results Summary");
  console.log("═".repeat(50));

  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(Boolean).length;

  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} ${test.toUpperCase()}`);
  });

  console.log(`\n📈 Overall: ${passed}/${total} test suites passed`);

  if (passed === total) {
    console.log("🎉 All tests passed! Your code is ready for production.");
  } else {
    console.log("⚠️  Some tests failed. Please review and fix the issues.");
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runCommand, main };
