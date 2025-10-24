import axios from "axios";
import { config } from "../../utils/config";

// Create a preconfigured Axios instance for YouTrack REST API
export const yt = axios.create(
    {
        baseURL: config.youTrack.baseUrl,
        headers: {
            "Authorization": `Bearer ${config.youTrack.token}`,
            "Content-Type": "application/json",
        }
    }
);