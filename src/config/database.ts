import { connect, connection, ConnectOptions } from "mongoose";
import { ENV } from "./dotenv";

const { MONGO_LINK, NODE_ENV } = ENV;

if (!MONGO_LINK) {
  throw new Error("MONGO_LINK is not defined");
}

// Opciones optimizadas para alto rendimiento
const connectionOptions: ConnectOptions = {
  maxPoolSize: 100, // Más conexiones para alta concurrencia
  minPoolSize: 10, // Mantener al menos 10 conexiones abiertas
  socketTimeoutMS: 45000, // Tiempo máximo para operaciones de socket
  connectTimeoutMS: 10000, // Tiempo para establecer la conexión
  serverSelectionTimeoutMS: 10000, // Tiempo para seleccionar servidor
  heartbeatFrequencyMS: 10000, // Frecuencia de heartbeat
  autoIndex: NODE_ENV === "production" ? false : true, // No indexar automáticamente en producción
  bufferCommands: true, // Guardar comandos en buffer si se pierde la conexión
};

export async function connectDb(): Promise<void> {
  try {
    await connect(MONGO_LINK as string, connectionOptions);

    console.log(`Connected to MongoDB: ${MONGO_LINK}`);

    // Manejar errores de conexión
    connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    // Cuando la conexión se pierde
    connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    // Cuando la conexión se restablece
    connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}
