# Pet Adoption API – Project Documentation  

## 1. Project Overview  

This project is a **RESTful API** built with **Node.js, Express, and TypeScript**, allowing users to manage a catalog of pets available for adoption.  

### Key Features:  
- **Retrieve** a list of available pets.  
- **Get** details about a specific pet.  
- **(Optional)** For authenticated users: **add**, **update**, or **delete** pet records.  

### Additional Implementations:  
✔ **Error Handling Middleware**: Captures and responds to validation, authentication, and server errors.  
✔ **Response Compression**: Uses `compression` middleware to improve performance.  
✔ **Clustering**: Utilizes multiple CPU cores (via Node.js `cluster` module or PM2).  
✔ **Automated Testing**: Uses Jest, ts-jest, mocks, and Faker.js to generate realistic test data.  

---

## 2. Technical Requirements  

- **Node.js** (v14 or later)  
- **npm** or **yarn**  
- **TypeScript** (v4.x)  
- **Express** (v4.x)  
- **Additional Packages:**  
  - `compression` (for response compression)  
  - `dotenv` (for environment variables)  
  - `cors` (optional, for cross-origin requests)  
  - `express-validator` (for input validation, optional)  
  - `morgan` (for logging, optional)  
- **Testing:**  
  - `jest`  
  - `ts-jest`  
  - `@types/jest`  
  - `supertest` (for API testing)  
  - `faker` (or `@faker-js/faker`, for mock data)  
- **Clustering (optional for development):**  
  - Node.js `cluster` module or **PM2** for production.  

---

## 3. Installation and Setup  

### 3.1 Clone the Repository  

```bash
git clone https://github.com/your-username/pet-adoption-api.git
cd pet-adoption-api
```

### 3.2 Install Dependencies  

Using npm:  

```bash
npm install
```

Or using yarn:  

```bash
yarn install
```

### 3.3 Configure Environment Variables  

Create a `.env` file in the root directory:  

```ini
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key
```

---

## 4. Project Structure  

```
/pet-adoption-api
│
├── src/
│   ├── controllers/        # Business logic and route handlers
│   ├── middlewares/        # Middleware (errorHandler, validation, etc.)
│   ├── models/             # Data models and TypeScript interfaces
│   ├── routes/             # API route definitions
│   ├── services/           # Data access logic or external service integrations
│   ├── tests/              # Unit and integration tests
│   ├── app.ts              # Express application configuration
│   └── server.ts           # Server startup (includes clustering)
│
├── tsconfig.json           # TypeScript configuration
├── .env                    # Environment variables
├── package.json            # Scripts and dependencies
└── README.md               # Project documentation
```

---

## 5. TypeScript Configuration  

A basic `tsconfig.json` file:  

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

---

## 6. Error Handling Middleware  

Create `src/middlewares/errorHandler.ts`:  

```typescript
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
```

Then, register it in `src/app.ts`:  

```typescript
import express from 'express';
import compression from 'compression';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(compression());
app.use('/api', routes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
```

---

## 7. Response Compression  

Enable **Gzip compression** using the `compression` package:  

```typescript
app.use(compression());
```

This reduces response size and improves API performance, especially for JSON responses.  

---

## 8. Clustering with Node.js  

To leverage multiple CPU cores, modify `src/server.ts`:  

```typescript
import cluster from 'cluster';
import os from 'os';
import app from './app';

const PORT = process.env.PORT || 3000;

function startServer(): void {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} – PID: ${process.pid}`);
  });
}

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running. Spawning ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  startServer();
}
```

This launches a worker process per CPU core, improving concurrent request handling.  

---

## 9. Automated Testing with Mocks and Faker  

### 9.1 Install Testing Dependencies  

```bash
npm install --save-dev jest ts-jest @types/jest supertest @faker-js/faker
```

Configure Jest (`jest.config.js`):  

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
};
```

### 9.2 API Endpoint Test Example  

Create `src/tests/pets.test.ts`:  

```typescript
import request from 'supertest';
import app from '../app';
import { faker } from '@faker-js/faker';

describe('GET /api/pets', () => {
  it('should return a list of pets', async () => {
    const res = await request(app).get('/api/pets');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /api/pets', () => {
  it('should add a new pet and return its data', async () => {
    const newPet = {
      name: faker.animal.cat(),
      species: 'Cat',
      age: faker.datatype.number({ min: 1, max: 15 }),
      description: faker.lorem.sentence(),
    };

    const res = await request(app).post('/api/pets').send(newPet);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(newPet.name);
  });
});
```

---

## 10. Running and Deployment  

### 10.1 Add Scripts to `package.json`  

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest --coverage"
  }
}
```

### 10.2 Deploy to Production  

1. Build the project:  
   ```bash
   npm run build
   ```
2. Start the server:  
   ```bash
   npm start
   ```
   
For production, consider using **PM2** for process management.

---

## 11. Best Practices  

- **Use ESLint & Prettier** for code consistency.
- **Store sensitive data in `.env`**, never hardcode credentials.
- **Use Git for version control** and document changes in `README.md` or a `CHANGELOG.md`.
- **Ensure robust error handling** in all endpoints.
