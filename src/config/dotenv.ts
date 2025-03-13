import { config } from "dotenv";
import path from "path";

const nodeEnv = process.env["NODE_ENV"] || "development";

const envPath = path.resolve(process.cwd(), `.env.${nodeEnv}`);

const defaultEnvPath = path.resolve(process.cwd(), ".env");

config({
  path: envPath,
});

config({
  path: defaultEnvPath,
});

const requiredEnvVars = [
  "PORT",
  "MONGO_LINK",
  // "JWT_SECRET",
  // "SESSION_SECRET_KEY",
  // "SESSION_EXPIRATION_TIME",
  // "JWT_EXPIRATION_TIME",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const ENV = {
  NODE_ENV: nodeEnv as "development" | "production" | "test",
  PORT: Number(process.env["PORT"]),
  MONGO_LINK: process.env["MONGO_LINK"] as string,
  // JWT_SECRET: process.env["JWT_SECRET"] as string,
  // JWT_EXPIRATION_TIME: Number(process.env["JWT_EXPIRATION_TIME"]),
  // SESSION_SECRET_KEY: process.env["SESSION_SECRET_KEY"] as string,
  // SESSION_EXPIRATION_TIME: Number(process.env["SESSION_EXPIRATION_TIME"]),
} as const;
