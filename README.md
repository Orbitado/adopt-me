# Pet Adoption API – Project Documentation

## 1. Project Overview

This project is a **RESTful API** built with **Node.js, Express, and TypeScript**, allowing users to manage a catalog of pets available for adoption.

### Key Features:

- **Retrieve** a list of available pets
- **Get** details about a specific pet
- **Manage adoption process** through dedicated endpoints
- **User authentication and management**
- For authenticated users: **add**, **update**, or **delete** pet records

### Additional Implementations:

✔ **Error Handling Middleware**: Captures and responds to validation, authentication, and server errors  
✔ **Response Compression**: Uses `compression` middleware to improve performance  
✔ **Rate Limiting**: Implements `express-rate-limit` to prevent abuse  
✔ **Environment Configuration**: Separate environment configs for development, testing, and production  
✔ **Automated Testing**: Uses Jest for comprehensive test coverage  
✔ **Type Safety**: Leverages TypeScript and Zod for runtime type validation  
✔ **Code Quality**: Enforces standards with ESLint, Prettier, and Husky pre-commit hooks

---

## 2. Technical Requirements

- **Node.js** (v14 or later)
- **npm** or **yarn**
- **TypeScript** (v5.x)
- **Express** (v4.x)
- **MongoDB** via Mongoose
- **Additional Packages:**
  - `compression` (for response compression)
  - `dotenv` (for environment variables)
  - `cors` (for cross-origin requests)
  - `zod` (for data validation)
  - `express-rate-limit` (for API protection)
  - `cookie-parser` (for handling cookies)
- **Development Tools:**
  - `eslint` & `prettier` (for code quality)
  - `husky` & `lint-staged` (for pre-commit hooks)
  - `ts-node-dev` (for development server)
- **Testing:**
  - `jest`
  - `faker` (for mock data)
- **Production:**
  - `pm2` (for process management)
  - `cross-env` (for environment variable support across platforms)

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

- `.env` - Common environment variables
- `.env.development` - Development-specific variables
- `.env.test` - Testing-specific variables
- `.env.production` - Production-specific variables

Example of `.env` file:

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
├── middlewares/     # Custom middlewares
├── modules/         # Domain-specific modules
│   ├── adoptions/   # Adoption process management
│   ├── pets/        # Pet catalog management
│   ├── shared/      # Shared utilities and components
│   └── users/       # User management
├── providers/       # Service providers
├── public/          # Static files
├── tests/           # Test files
├── types/           # Type definitions
├── utils/           # Utility functions
└── app.ts           # Entry point
```

### Module Structure

Each module follows a consistent structure:

```
module/
├── dao/           # Data Access Objects
├── dto/           # Data Transfer Objects
├── module.controller.ts
├── module.model.ts
├── module.routes.ts
└── module.service.ts
```

---

## 5. Running and Deployment

### 5.1 Available Scripts

```bash
# Development
npm run dev         # Start development server with hot reload

# Testing
npm run test        # Run tests with coverage

# Linting & Formatting
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
npm run typecheck   # Check TypeScript types

# Production
npm run build       # Build for production
npm start           # Start production server
```

### 5.2 Deploy to Production

1. Build the project:
   ```bash
   npm run build
   ```
2. Start the server:
   ```bash
   npm start
   ```

For production deployment, the project includes PM2 for process management and clustering.

---

## 6. Best Practices

- **Environment Configuration**: Different environment files for development, testing, and production
- **Code Quality**: ESLint and Prettier configured with pre-commit hooks via Husky
- **Type Safety**: TypeScript for compile-time safety and Zod for runtime validation
- **Modular Architecture**: Domain-driven design with clear separation of concerns
- **Security**: Rate limiting, environment variable protection, and proper error handling
- **Documentation**: Clear documentation for API endpoints and project structure

---

## 7. API Documentation

The API exposes endpoints for managing pets, users, and the adoption process. Detailed API documentation will be available via Swagger/OpenAPI at `/api-docs` when running the server.

---

## 8. Contributing

Please read the CONTRIBUTING.md file for details on our code of conduct and the process for submitting pull requests.

---

## 9. License

This project is licensed under the ISC License - see the LICENSE file for details.
