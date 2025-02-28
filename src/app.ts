import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { connectDb } from "./config/database";
import { ENV } from "./config/dotenv";
import { notFoundHandler } from "./middlewares/not-found-handler";
import { errorHandler } from "./middlewares/error-handler";
import petsRouter from "./modules/pets/pets.routes";
import adoptionsRouter from "./modules/adoptions/adoptions.routes";

connectDb();

// import usersRouter from './routes/users.router.js';
// import petsRouter from './routes/pets.router.js';
// import adoptionsRouter from './routes/adoption.router.js';
// import sessionsRouter from './routes/sessions.router.js';

const app = express();

const { PORT, NODE_ENV } = ENV;

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// app.use('/api/users',usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
// app.use('/api/sessions',sessionsRouter);

app.use(notFoundHandler);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    errorHandler(err, req, res, next);
  } else {
    next(err);
  }
});

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${NODE_ENV} mode on port http://localhost:${PORT}`,
  );
});

process.on("unhandledRejection", (err: Error) => {
  console.error(`UNHANDLED REJECTION! 💥 Shutting down...`);
  console.error(`${err.name}: ${err.message}`);

  if (NODE_ENV === "production") {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on("uncaughtException", (err: Error) => {
  console.error(`UNCAUGHT EXCEPTION! 💥 Shutting down...`);
  console.error(`${err.name}: ${err.message}`);

  if (NODE_ENV === "production") {
    process.exit(1);
  }
});

export default app;
