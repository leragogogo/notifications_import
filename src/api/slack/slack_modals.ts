import { slack } from "./slack_config";

export async function openModal(trigger_id: string, channel_id: string) {
    await slack.post("/views.open",
        {
            trigger_id,
            view: {
                type: "modal",
                callback_id: "yt_create_issue",
                private_metadata: JSON.stringify({ channel_id }),
                title: { type: "plain_text", text: "Create YouTrack Issue" },
                submit: { type: "plain_text", text: "Create" },
                close: { type: "plain_text", text: "Cancel" },
                blocks: [
                    {
                        type: "input",
                        block_id: "summary_block",
                        label: { type: "plain_text", text: "Summary" },
                        element: {
                            type: "plain_text_input",
                            action_id: "summary",
                            placeholder: { type: "plain_text", text: "e.g., Fix login" }
                        }
                    },
                    {
                        type: "input",
                        block_id: "project_block",
                        label: { type: "plain_text", text: "Project's Short Name" },
                        element: {
                            type: "plain_text_input",
                            action_id: "project",
                            placeholder: { type: "plain_text", text: "Project's short name" },
                        }
                    }
                ]
            }
        }
    )
}

