import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import { connectDb } from "./config/database";
import { ENV } from "./config/dotenv";
// import { errorHandler } from "@/middlewares/error-handler";
// import { notFoundHandler } from "@/middlewares/not-found-handler";

// Remove this as we're using our custom dotenv config
// dotenv.config();

connectDb();

// import usersRouter from './routes/users.router.js';
// import petsRouter from './routes/pets.router.js';
// import adoptionsRouter from './routes/adoption.router.js';
// import sessionsRouter from './routes/sessions.router.js';

const app = express();
const { PORT } = ENV;

// Use PORT from our ENV config instead
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// app.use('/api/users',usersRouter);
// app.use('/api/pets',petsRouter);
// app.use('/api/adoptions',adoptionsRouter);
// app.use('/api/sessions',sessionsRouter);

// app.use(errorHandler);
// app.use(notFoundHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
