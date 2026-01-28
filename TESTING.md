# 🧪 Comprehensive Test Suite Documentation

## 📋 Overview

This project includes a comprehensive test suite with maximum coverage and 100% pass rate goal. The tests cover all major components, utilities, API endpoints, and validation schemas.

## 🎯 Test Categories

### 1. **Utility Functions** (`tests/lib/utils.test.ts`)
- **formatCurrency()**: Tests currency formatting for Indian Rupees
- **formatDate()**: Tests date formatting with various formats
- **generateSlug()**: Tests slug generation for URLs

### 2. **Validation Schemas** (`tests/lib/validations.test.ts`)
- **propertySchema**: Tests property validation rules
- **blogSchema**: Tests blog post validation rules
- **careerApplicationSchema**: Tests career application validation rules

### 3. **API Routes** (`tests/api/**/*.test.ts`)
- **Admin Properties API**: Tests CRUD operations for properties
- **Admin Blogs API**: Tests CRUD operations for blogs
- **Admin Enquiries API**: Tests CRUD operations for enquiries
- **Admin Videos API**: Tests CRUD operations for videos
- **Admin Career API**: Tests CRUD operations for career applications

### 4. **React Components** (`tests/components/**/*.test.tsx`)
- **PropertyCard**: Tests property card component rendering and interactions
- **LoanCalculator**: Tests loan calculator functionality and calculations

## 🚀 Running Tests

### Quick Test Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI environment
npm run test:ci

# Run comprehensive test suite with detailed output
npm run test:all
```

### Individual Test Categories
```bash
# Test only utility functions
npm test -- tests/lib/utils.test.ts

# Test only validation schemas
npm test -- tests/lib/validations.test.ts

# Test only API routes
npm test -- tests/api/**/*.test.ts

# Test only components
npm test -- tests/components/**/*.test.tsx
```

## 📊 Coverage Goals

### Target Coverage Thresholds
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Coverage Report
Run `npm run test:coverage` to generate a detailed coverage report in the `coverage/` directory.

## 🛠️ Test Utilities

### Mock Data
Located in `tests/utils/test-helpers.ts`:
- `mockProperty`: Sample property data for testing
- `mockBlog`: Sample blog data for testing
- `mockEnquiry`: Sample enquiry data for testing
- `mockVideo`: Sample video data for testing
- `mockCareerApplication`: Sample career application data for testing

### Helper Functions
- `createMockRequest()`: Creates mock NextRequest objects
- `createMockParams()`: Creates mock route parameters
- `createPrismaError()`: Creates mock Prisma errors

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)
- Next.js integration
- Path mapping for `@/` imports
- Coverage collection settings
- Custom test matchers

### Setup File (`jest.setup.js`)
- Global mocks for Next.js components
- Mocks for external APIs
- Mocks for browser APIs

## 📝 Writing Tests

### Test Structure
```typescript
describe('Component/Function Name', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should do something specific', () => {
    // Arrange - setup test data
    // Act - perform action
    // Assert - verify result
  });
});
```

### Best Practices
1. **Arrange-Act-Assert** pattern
2. Descriptive test names
3. Test both happy paths and edge cases
4. Mock external dependencies
5. Use proper TypeScript typing
6. Test error handling
7. Test user interactions for components

## 🎯 Test Images

The `test-images/` folder contains sample images used in tests:
- `1.jpg`, `2.jpg`, `3.jpg`, `4.jpg`, `5.jpg` - Property images
- `fp1.jpg`, `fp2.jpg`, `fp3.jpg` - Floor plan images
- `rera.png` - RERA QR code image

## 🐛 Debugging Tests

### Common Issues
1. **Import errors**: Check Jest configuration and path mapping
2. **Mock issues**: Verify mocks are properly set up
3. **Async issues**: Use proper async/await patterns
4. **Type errors**: Ensure proper TypeScript typing

### Debug Commands
```bash
# Run tests with verbose output
npm test -- --verbose

# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Run specific test file
npm test -- path/to/test.test.ts
```

## 📈 CI/CD Integration

### GitHub Actions
```yaml
- name: Run Tests
  run: npm run test:ci
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:ci"
    }
  }
}
```

## 🎉 Success Criteria

The test suite is considered successful when:
- ✅ All tests pass (100% pass rate)
- ✅ Coverage thresholds are met
- ✅ No TypeScript errors
- ✅ No linting errors
- ✅ Tests run in CI/CD pipeline

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [React Testing Best Practices](https://kentcdodds.com/blog/testing-react-hooks/)
- [Next.js Testing](https://nextjs.org/docs/testing)

---

**Remember**: Tests are not just about catching bugs - they're about ensuring code quality, preventing regressions, and documenting expected behavior. Write tests that are maintainable, readable, and comprehensive! 🚀
