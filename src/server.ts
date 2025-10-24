import express from "express";
import { config } from "./utils/config";
import { SQLiteCache } from "./storage/sqlite_cache";
import { transferNotifications } from "./services/transfer_notifications";
import { startPoller } from "./services/poller";

const app = express();

// Create local db to store transferred notifications
const cache = new SQLiteCache("./src/storage/cache.db");

// Start poller that send notifications from YouTrack to Slack's channel
const stopPoller = startPoller(transferNotifications, cache, { intervalMs: 60000 })

// Start server
const server = app.listen(config.port, async () => {
    console.log(`Listening on port ${config.port}`)
})

// Close all resources when finish execution
const shutdown = () => {
    console.log("Shutting down...");
    stopPoller();
    cache.close();
    server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);