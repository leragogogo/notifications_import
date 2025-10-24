import { yt } from "./youtrack_config";

export async function fetchYouTrackNotifications() {
    const response = await yt.get("/users/notifications",
        {
            params: { fields: "id,content,metadata" },
        }
    );
    return response.data;
}