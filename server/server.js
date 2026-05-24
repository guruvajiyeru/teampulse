import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, ".env");
const envResult = dotenv.config({ path: envPath });
if (envResult.error) {
  console.warn(`⚠️ Could not load .env from ${envPath}. Use server/.env or set environment variables manually.`);
} else {
  console.log(`✅ Loaded .env from ${envPath}`);
}

import http from "http";
import mongoose from "mongoose";
import app from "./app.js";
import connectDB from "./database/db.js";
import { initSockets } from "./sockets/index.js";
import { PORT } from "./config/config.js";
import { initializeWeeklyReportCron } from "./cron/weeklyReportScheduler.js";

async function run() {
  try {
    // 1. Connect to MongoDB (gracefully skips if MONGO_URI not set, falls back to JSON store)
    await connectDB();

    // 2. Create HTTP server
    const httpServer = http.createServer(app);

    // 3. Initialize Socket.IO
    const io = initSockets(httpServer);

    // 4. Make io accessible on Express req instances
    app.set("io", io);

    // 5. Start weekly report cron scheduler
    initializeWeeklyReportCron();

    // 6. Start listening
    httpServer.on("error", (error) => {
      if (error?.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use. Stop the existing process or change PORT.`);
        process.exit(1);
      }
      console.error("❌ HTTP server error:", error);
      process.exit(1);
    });

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 TeamPulseAI running at http://localhost:${PORT}`);
      console.log(`   Environment : ${process.env.NODE_ENV || "development"}`);
      console.log(`   MongoDB     : ${mongoose.connection.readyState === 1 ? "connected" : "JSON fallback"}`);
    });
  } catch (error) {
    console.error("Critical server boot error:", error);
    process.exit(1);
  }
}

run();
