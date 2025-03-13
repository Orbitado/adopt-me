# Pet Adoption API – Project Documentation

## 1. Project Overview

This project is a **RESTful API** built with **Node.js, Express, and TypeScript**, allowing users to manage a catalog of pets available for adoption.

### Key Features:

- **Pet Management**: Create, retrieve, update, and delete pet listings
- **Adoption Process**: Track and manage adoption requests with status workflows
- **User Authentication**: Secure user registration and authentication
- **Role-Based Access**: Different permissions for regular users and administrators
- **Data Validation**: Input validation using Zod schema validation

### Technical Implementation:

✔ **Domain-Driven Design**: Modular structure with clear separation of concerns  
✔ **Error Handling Middleware**: Comprehensive error handling for validation, authentication, and server errors  
✔ **Response Compression**: Uses `compression` middleware to improve performance  
✔ **Rate Limiting**: Implements `express-rate-limit` to prevent API abuse  
✔ **Environment Configuration**: Separate environment configurations for development, testing, and production  
✔ **Logging**: Winston-based logging system for application events  
✔ **Automated Testing**: Jest-based test suite for unit and integration tests  
✔ **Type Safety**: Leverages TypeScript and Zod for compile-time and runtime type validation  
✔ **Code Quality**: Standards enforced with ESLint, Prettier, and Husky pre-commit hooks

---

## 2. Technical Requirements

### Core Dependencies
- **Node.js** (v20+)
- **npm** (v9+)
- **TypeScript** (v5.7+)
- **Express** (v4.21+)
- **MongoDB** via Mongoose (v8.10+)

### Main Packages
- `bcrypt` (password hashing)
- `compression` (response optimization)
- `cookie-parser` (handling HTTP cookies)
- `cors` (cross-origin request support)
- `dotenv` (environment variable management)
- `express-rate-limit` (API protection)
- `express-session` (session management)
- `jsonwebtoken` (JWT authentication)
- `mongoose` (MongoDB ODM)
- `winston` (logging)
- `zod` (data validation)

### Development Tools
- `eslint` & `prettier` (code quality)
- `husky` & `lint-staged` (pre-commit hooks)
- `ts-node-dev` (development server with hot reload)
- `jest` & `ts-jest` (testing framework)
- `supertest` (API testing)
- `faker` (test data generation)
- `pm2` (production process management)
- `cross-env` (environment variable support across platforms)

---

## 3. Installation and Setup

### 3.1 Clone the Repository

```bash
git clone https://github.com/Orbitado/adopt-me.git
cd adopt-me
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Configure Environment Variables

The project uses different .env files for different environments:

- `.env.development` - Development-specific variables
- `.env.test` - Testing-specific variables
- `.env.production` - Production-specific variables

Example of environment variables structure:

```ini
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/adopt-me
```

---

## 4. Project Structure

```
src/
├── config/          # Configuration files
│   ├── database.ts  # MongoDB connection setup
│   └── dotenv.ts    # Environment variable configuration
├── middlewares/     # Custom middlewares
│   ├── error-handler.ts
│   └── not-found-handler.ts
├── modules/         # Domain-specific modules
│   ├── adoptions/   # Adoption process management
│   ├── pets/        # Pet catalog management
│   ├── users/       # User management
│   ├── sessions/    # Session management
│   └── mocks/       # Mock data for testing/development
├── types/           # Type definitions
├── utils/           # Utility functions and helpers
│   └── logger.ts    # Logging configuration
├── __tests__/       # Test files
└── app.ts           # Application entry point
```

### Module Structure

Each module follows a consistent structure:

```
module/
├── dao/                # Data Access Objects
├── dto/                # Data Transfer Objects (Zod schemas)
├── module.model.ts     # Mongoose model and interface
├── module.controller.ts # HTTP request handlers
├── module.routes.ts    # Express routes
└── module.service.ts   # Business logic
```

---

## 5. API Endpoints

### Pets

- `GET /api/pets` - Get all pets
- `GET /api/pets/:id` - Get a specific pet
- `POST /api/pets` - Create a new pet
- `PUT /api/pets/:id` - Update a pet
- `DELETE /api/pets/:id` - Delete a pet

### Adoptions

- `GET /api/adoptions` - Get all adoptions
- `GET /api/adoptions/:id` - Get a specific adoption
- `POST /api/adoptions` - Create a new adoption request
- `PUT /api/adoptions/:id` - Update an adoption status
- `DELETE /api/adoptions/:id` - Delete an adoption

### Mocking

- `GET /api/mocks/mockingpets` - Mock Pets
- `GET /api/mocks/mockingusers` - Mock Users 
- `POST api/mocks/generateData` - Generate Users or Pets 

---

## 6. Running and Deployment

### 6.1 Available Scripts

```bash
# Development
npm run dev         # Start development server with hot reload

# Testing
npm run test        # Run tests with Jest

# Linting & Formatting
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
npm run typecheck   # Check TypeScript types

# Production
npm run build       # Build for production
npm start           # Start production server
```

### 6.2 Deploy to Production

1. Build the project:
   ```bash
   npm run build
   ```
2. Start the server:
   ```bash
   npm start
   ```

The project includes configuration for Docker deployment:

```bash
# Build Docker image
docker build -t adopt-me .

# Run Docker container
docker run -p 3000:3000 adopt-me
```

---

## 7. Contributing

Please read the CONTRIBUTING.md file for details on our code of conduct and the process for submitting pull requests.

---

## 8. License

This project is licensed under the ISC License - see the LICENSE file for details.
