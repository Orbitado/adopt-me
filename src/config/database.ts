import { connect, connection, ConnectOptions } from "mongoose";
import { ENV } from "./dotenv";

const { MONGO_LINK, NODE_ENV } = ENV;

if (!MONGO_LINK) {
  throw new Error("MONGO_LINK is not defined");
}

const connectionOptions: ConnectOptions = {
  maxPoolSize: 100,
  minPoolSize: 10,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
  heartbeatFrequencyMS: 10000,
  autoIndex: NODE_ENV === "production" ? false : true,
  bufferCommands: true,
};

export async function connectDb(): Promise<void> {
  try {
    await connect(MONGO_LINK as string, connectionOptions);

    console.log(`Connected to MongoDB: ${MONGO_LINK}`);

    connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}
