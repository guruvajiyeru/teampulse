import dns from "dns";
import mongoose from "mongoose";

let isConnected = false;

async function ensureAtlasSrvDns(uri) {
  if (!uri.startsWith("mongodb+srv://")) return;

  const host = new URL(uri).hostname;
  const srvName = `_mongodb._tcp.${host}`;

  try {
    await dns.promises.resolveSrv(srvName);
  } catch (error) {
    console.warn("⚠️ MongoDB Atlas SRV lookup failed via system DNS. Falling back to public resolvers...");
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    await dns.promises.resolveSrv(srvName);
  }
}

export async function connectDB() {
  if (isConnected) return;

  try {
    const uri = process.env.MONGO_URI || process.env.MONGO_URL || process.env.MONGODB_URI;
    const dbName = process.env.MONGO_DB_NAME || process.env.MONGO_DATABASE || "teampulseai";

    if (!uri) {
      console.warn("⚠️ MONGO_URI, MONGO_URL, or MONGODB_URI is not set. Falling back to local JSON store.");
      return;
    }

    await ensureAtlasSrvDns(uri);

    const conn = await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;

    console.log("✅ MongoDB connected successfully");
    console.log("Host:", conn.connection.host);

  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error);
    console.warn("⚠️ Running in local JSON store mode due to connection failure.");
  }
}

export default connectDB;