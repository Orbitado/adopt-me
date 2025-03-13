# Testing Guide for Adopt-Me API

This project uses Jest as a testing framework to implement unit, integration, and end-to-end tests.

## Test Setup

The testing environment is configured using:

- **Jest**: Main testing framework
- **ts-jest**: TypeScript support for Jest
- **supertest**: HTTP assertions for API testing
- **@faker-js/faker**: For generating test data

## Test Configuration

Tests are configured in the `jest.config.ts` file, which includes:

- TypeScript configuration
- Test environment settings
- Coverage reporting
- Test path patterns

## Test Structure

```
src/
  __tests__/                # Main test directory
    modules/                # Test organized by module
      pets/                 # Tests for the pets module
        pets.service.test.ts
        pets.controller.test.ts
        ...
```

## Types of Tests

### Unit Tests

Unit tests verify the isolated functionality of individual components. Dependencies are typically mocked.

```typescript
// Example of a unit test for pets.service.ts
describe('PetsService', () => {
  test('getAllPets should return all pets', async () => {
    const mockPets = [{ name: 'Fluffy' }, { name: 'Luna' }];
    jest.spyOn(petsDAO, 'findAll').mockResolvedValue(mockPets);
    
    const result = await petsService.getAllPets();
    
    expect(petsDAO.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockPets);
  });
});
```

### Integration Tests

Integration tests verify that components work correctly together. For example, testing API endpoints with a test database.

```typescript
// Example of an integration test for the pets API
describe('Pets API', () => {
  test('GET /api/pets should return all pets', async () => {
    // Setup test data
    await Pet.create({ name: 'Fluffy', /* other required fields */ });
    
    const response = await request(app)
      .get('/api/pets')
      .expect(200);
      
    expect(response.body.payload).toHaveLength(1);
    expect(response.body.payload[0].name).toBe('Fluffy');
  });
});
```

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests with watch mode (development)

```bash
npm test -- --watch
```

### Run a specific test file

```bash
npm test -- src/__tests__/modules/pets/pets.service.test.ts
```

### Generate coverage report

```bash
npm test -- --coverage
```

The coverage report will be generated in the `coverage/` directory.

## Test Database

For integration tests involving database operations, the project uses:

- A separate test database (configured in `.env.test`)
- Automatic database cleanup between test runs
- Mongoose test connection management

## Mock Data

The project uses `@faker-js/faker` to generate realistic test data:

```typescript
import { faker } from '@faker-js/faker';

const mockPet = {
  name: faker.animal.dog(),
  birthDate: faker.date.past(),
  breed: faker.animal.dog(),
  gender: faker.helpers.arrayElement(['male', 'female']),
  size: faker.helpers.arrayElement(['small', 'medium', 'large']),
  description: faker.lorem.paragraph(),
  isAdopted: false
};
```

## Testing Best Practices

1. **Test Isolation**: Each test should be independent of others
2. **Clear Assertions**: Tests should have clear assertions about expected outcomes
3. **Realistic Data**: Use faker to create realistic test data
4. **Clean Setup/Teardown**: Properly setup and cleanup test resources
5. **Naming Convention**: Use descriptive test names that explain the expected behavior

## Naming Convention

We follow this pattern for test organization:

```typescript
describe('Component or Module', () => {
  describe('specific method or functionality', () => {
    it('should behave in a specific way when certain conditions are met', () => {
      // Test implementation
    });
  });
});
``` 