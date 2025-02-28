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
git clone https://github.com/Orbitado/adopt-me.git
cd adopt-me
```

### 3.2 Install Dependencies

Using npm:

```bash
npm install
```

### 3.3 Configure Environment Variables

Create a `.env` file in the root directory:

```ini
PORT=3000
NODE_ENV=development
JWT_SECRET=<your_secret_key>
```

---

## 4. Project Structure

```
src/
├── config/          # Configuraciones (DB, env, etc.)
├── middlewares/     # Middlewares personalizados
├── modules/         # Módulos por dominio
│   ├── pets/        # Módulo de mascotas
│   │   ├── dao/     # Data Access Objects
│   │   ├── dto/     # Data Transfer Objects
│   │   ├── pets.controller.ts
│   │   ├── pets.model.ts
│   │   ├── pets.routes.ts
│   │   └── pets.service.ts
│   └── ...
├── providers/       # Proveedores de servicios
├── public/          # Archivos estáticos
├── tests/           # Tests
├── types/           # Definiciones de tipos
└── app.ts           # Punto de entrada
```

---

## 5. Running and Deployment

### 5.1 Add Scripts to `package.json`

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

### 5.2 Deploy to Production

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

## 6. Best Practices

- **Use ESLint & Prettier** for code consistency.
- **Store sensitive data in `.env`**, never hardcode credentials.
- **Use Git for version control** and document changes in `README.md` or a `CHANGELOG.md`.
- **Ensure robust error handling** in all endpoints.
