import axios from "axios";
import { config } from "../../utils/config";

// Create a preconfigured Axios instance for Slack API
export const slack = axios.create({
    baseURL: config.slack.baseUrl,
    headers: {
        "Authorization": `Bearer ${config.slack.token}`,
        "Content-Type": "application/json"
    }
});
