#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🧪 Running Comprehensive Test Suite\n');

// Test categories
const testCategories = [
  {
    name: 'Utility Functions',
    pattern: 'tests/lib/utils.test.ts',
    description: 'Testing utility functions like formatCurrency, formatDate, generateSlug'
  },
  {
    name: 'Validation Schemas',
    pattern: 'tests/lib/validations.test.ts',
    description: 'Testing Zod validation schemas for properties, blogs, and career applications'
  },
  {
    name: 'API Routes',
    pattern: 'tests/api/**/*.test.ts',
    description: 'Testing API endpoints for admin operations'
  },
  {
    name: 'React Components',
    pattern: 'tests/components/**/*.test.tsx',
    description: 'Testing React components with user interactions'
  }
];

let totalPassed = 0;
let totalFailed = 0;
let totalSuites = 0;

testCategories.forEach((category, index) => {
  console.log(`\n${index + 1}. ${category.name}`);
  console.log('━'.repeat(50));
  console.log(`📝 ${category.description}`);
  
  try {
    const result = execSync(`npm test -- ${category.pattern} --passWithNoTests --verbose`, {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log(result);
  } catch (error) {
    const output = error.stdout || error.message;
    console.log(output);
    
    // Extract test results from output
    const passedMatch = output.match(/(\d+) passed/);
    const failedMatch = output.match(/(\d+) failed/);
    const suitesMatch = output.match(/Test Suites: (\d+) total/);
    
    if (passedMatch) totalPassed += parseInt(passedMatch[1]);
    if (failedMatch) totalFailed += parseInt(failedMatch[1]);
    if (suitesMatch) totalSuites += parseInt(suitesMatch[1]);
  }
});

console.log('\n📊 Test Summary');
console.log('━'.repeat(50));
console.log(`✅ Passed: ${totalPassed}`);
console.log(`❌ Failed: ${totalFailed}`);
console.log(`📋 Total: ${totalPassed + totalFailed}`);
console.log(`🗂️  Total Test Suites: ${totalSuites}`);

if (totalFailed === 0) {
  console.log('\n🎉 All tests passed! 100% success rate!');
  process.exit(0);
} else {
  console.log('\n💥 Some tests failed. Please review the output above.');
  process.exit(1);
}
