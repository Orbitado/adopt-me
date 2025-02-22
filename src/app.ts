import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// import { errorHandler } from "@/middlewares/error-handler";

dotenv.config();

// import usersRouter from './routes/users.router.js';
// import petsRouter from './routes/pets.router.js';
// import adoptionsRouter from './routes/adoption.router.js';
// import sessionsRouter from './routes/sessions.router.js';

const app = express();
const PORT = process.env["PORT"];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Primero van todas las rutas
// app.use('/api/users',usersRouter);
// ... otras rutas ...

// El error handler va al final

// app.use('/api/users',usersRouter);
// app.use('/api/pets',petsRouter);
// app.use('/api/adoptions',adoptionsRouter);
// app.use('/api/sessions',sessionsRouter);

// app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
