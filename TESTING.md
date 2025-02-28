# Testing Guide for Adopt-Me API

This project uses Jest as a testing framework to implement unit, integration, and end-to-end tests.

## Test Setup

Tests are configured using:

- **Jest**: Testing framework
- **ts-jest**: For TypeScript support
- **supertest**: For API tests

## Test Structure

```
src/
  __tests__/               # Main test directory
    modules/               # Tests by module
      pets/                # Tests for the pets module
        ...
      adoptions/           # Tests for the adoptions module
        ...
    integration/           # Integration tests
      ...
    app.test.ts            # Basic application tests
```

## Types of Tests

### Unit Tests

Verify the isolated functioning of individual components using mocks for their dependencies.

```typescript
// Example of a unit test for pets.service.ts
test('getAllPets should return all pets', async () => {
  const mockPets = [{ name: 'Fluffy' }, { name: 'Luna' }];
  petsDAO.findAll.mockResolvedValue(mockPets);
  
  const result = await petsService.getAllPets();
  
  expect(petsDAO.findAll).toHaveBeenCalled();
  expect(result).toEqual(mockPets);
});
```

### Integration Tests

Verify that components work correctly together, for example, the API with the database.

```typescript
// Example of an integration test for the pets API
test('GET /api/pets should return all pets', async () => {
  await Pet.create({ name: 'Fluffy', /* other fields */ });
  
  const response = await request(app)
    .get('/api/pets')
    .expect(200);
    
  expect(response.body.payload).toHaveLength(1);
  expect(response.body.payload[0].name).toBe('Fluffy');
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
npm test -- modules/pets/pets.service.test.ts
```

### Generate coverage report

```bash
npm test -- --coverage
```

The coverage report will be generated in the `coverage/` directory.

## Database for Tests

Integration tests use a separate MongoDB database:

- Database name: `adopt-me-test`
- Host: `localhost`
- Port: `27017`

Tests automatically clean up data before and after execution.

## Principles for Writing Good Tests

1. **Independence**: Each test should be independent of others.
2. **Determinism**: Tests should produce the same results in each execution.
3. **Specificity**: Each test should test a single functionality.
4. **Clarity**: The name and structure of the test should clearly indicate what is being tested.

## Naming Convention

We follow the pattern:

```
describe('Component', () => {
  describe('method/functionality', () => {
    it('should behave in a certain way when...', () => {
      // Test
    });
  });
});
``` 