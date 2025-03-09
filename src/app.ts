import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import session from "express-session";
import rateLimit from "express-rate-limit";

// Config
import { connectDb } from "./config/database";
import { ENV } from "./config/dotenv";

// Middlewares
import { notFoundHandler } from "./middlewares/not-found-handler";
import { errorHandler } from "./middlewares/error-handler";
import { addLogger } from "./utils/logger";

// Routes
import petsRouter from "./modules/pets/pets.routes";
import adoptionsRouter from "./modules/adoptions/adoptions.routes";
import usersRouter from "./modules/users/users.routes";
// import sessionsRouter from "./modules/sessions/sessions.routes";

connectDb();

const app = express();

const { PORT, NODE_ENV, SESSION_SECRET_KEY, SESSION_EXPIRATION_TIME } = ENV;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400,
  }),
);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

app.use(
  session({
    secret: SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: SESSION_EXPIRATION_TIME,
      httpOnly: true,
      secure: NODE_ENV === "production",
    },
  }),
);

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(cookieParser());
app.use(compression());

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
  });
});

app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/users", usersRouter);
// app.use("/api/sessions", sessionsRouter);

app.use(addLogger);
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
