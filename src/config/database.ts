import { connect, connection } from "mongoose";
import { ENV } from "./dotenv";

const { MONGO_LINK } = ENV;

if (!MONGO_LINK) {
  throw new Error("MONGO_LINK is not defined");
}

export async function connectDb(): Promise<void> {
  try {
    await connect(MONGO_LINK as string);
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
