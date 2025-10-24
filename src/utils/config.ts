import dotenv from "dotenv";

dotenv.config();

// Raise error if any of needed environment variable is missing
function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value;
}

// Configurate values from .env
export const config = {
    port: requireEnv("PORT"),
    youTrack: {
        baseUrl: requireEnv("YOUTRACK_BASE_URL"),
        token: requireEnv("YOUTRACK_TOKEN"),
    },
    slack: {
        baseUrl: requireEnv("SLACK_BASE_URL"),
        token: requireEnv("SLACK_TOKEN"),
        channel: requireEnv("SLACK_CHANNEL"),
    }
}