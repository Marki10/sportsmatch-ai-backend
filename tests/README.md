# Test Suite

This directory contains unit and integration tests for the SportsMatch AI Backend.

## Test Structure

```
tests/
├── setup.ts                    # Test configuration and setup
├── auth.test.ts                # Integration tests for auth routes
├── middleware/
│   ├── auth.test.ts           # Unit tests for auth middleware
│   └── error-handler.test.ts  # Unit tests for error handler
├── services/
│   └── auth.service.test.ts   # Unit tests for auth service
└── utils/
    ├── jwt.test.ts            # Unit tests for JWT utility
    └── bcrypt.test.ts         # Unit tests for bcrypt utility
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run specific test file
```bash
npm test -- tests/utils/jwt.test.ts
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="JWT"
```

## Test Categories

### Unit Tests
- **Utils**: JWT, bcrypt utility functions
- **Middleware**: Auth, error handling
- **Services**: Business logic (auth service)

### Integration Tests
- **Routes**: Full request/response cycle (auth routes)

## Test Environment

Tests use:
- Mock database (automatically when DATABASE_URL not set)
- Test JWT secret
- Isolated test data (cleaned up after each test)

## Writing New Tests

1. Create test file: `tests/[category]/[name].test.ts`
2. Use Jest describe/it blocks
3. Clean up test data in `afterEach` or `afterAll`
4. Use the mock database automatically

## Example Test

```typescript
import { functionToTest } from '../../src/path/to/function';

describe('Function Name', () => {
  it('should do something', () => {
    const result = functionToTest();
    expect(result).toBe(expected);
  });
});
```

