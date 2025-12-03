# Running Tests Guide

## Quick Start

Run all tests:
```bash
npm test
```

## Test Files Created

✅ **Utilities Tests:**
- `tests/utils/jwt.test.ts` - JWT token generation and verification
- `tests/utils/bcrypt.test.ts` - Password hashing and comparison

✅ **Middleware Tests:**
- `tests/middleware/auth.test.ts` - Authentication middleware
- `tests/middleware/error-handler.test.ts` - Error handling middleware

✅ **Service Tests:**
- `tests/services/auth.service.test.ts` - Authentication service logic

✅ **Integration Tests:**
- `tests/auth.test.ts` - Full auth route integration tests

## Running Specific Tests

### Run utility tests
```bash
npm test -- tests/utils
```

### Run middleware tests
```bash
npm test -- tests/middleware
```

### Run service tests
```bash
npm test -- tests/services
```

### Run single test file
```bash
npm test -- tests/utils/jwt.test.ts
```

### Run tests matching pattern
```bash
npm test -- --testNamePattern="JWT"
```

## Test Coverage

Generate coverage report:
```bash
npm run test:coverage
```

View coverage:
- Text: Check terminal output
- HTML: Open `coverage/index.html` in browser

## Watch Mode

Run tests in watch mode (auto-rerun on file changes):
```bash
npm run test:watch
```

## Test Environment

Tests automatically use:
- Mock database (no PostgreSQL needed)
- Test JWT secret
- Clean test data (auto-cleanup)

## Troubleshooting

### Tests failing?
1. Make sure dependencies are installed: `npm install`
2. Check if mock database is initialized
3. Run specific test to see detailed error

### Mock database not working?
- Tests automatically use mock database when DATABASE_URL is empty
- Check `tests/setup.ts` configuration

### TypeScript errors?
- Run `npm run build` first
- Check `tsconfig.json` configuration

## Next Steps

All core tests are now in place! You can:
1. Run `npm test` to verify everything works
2. Add more tests as needed
3. Check coverage with `npm run test:coverage`

