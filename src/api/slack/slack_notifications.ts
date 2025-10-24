import { slack } from "./slack_config";

export async function sendNotificationsToSlack(channel: string, markdownText: string,) {
    const response = await slack.post("/chat.postMessage",
        {
            channel: channel,
            markdown_text: markdownText,
        }
    );
    return response;
}