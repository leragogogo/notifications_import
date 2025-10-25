import { slack } from "./slack_config";

export async function sendMessage(channel: string, markdownText: string,) {
    await slack.post("/chat.postMessage",
        {
            channel: channel,
            markdown_text: markdownText,
        }
    );
}

export async function sendEphemeral(channel: string, user: string, text: string) {
    await slack.post("/chat.postEphemeral",
        {
            channel: channel,
            user: user,
            markdown_text: text,
        }
    );
}