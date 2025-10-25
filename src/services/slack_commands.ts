import crypto from "crypto";
import { config } from "../utils/config";
import express from "express";
import { openModal } from "../api/slack/slack_modals";
import { getProjectIdByShortName } from "../api/youtrack/youtrack_projects";
import { createYouTrackIssue } from "../api/youtrack/youtrack_issues";
import { sendEphemeral } from "../api/slack/slack_messages";


/**
 * Verify that the incoming request is comming from Slack.
 * @param req Incoming request.
 * @returns Verification result
 */
function verifySlack(req: express.Request): boolean {
    const timestamp = req.header("X-Slack-Request-Timestamp");
    const signature = req.header("X-Slack-Signature");

    if (!timestamp || !signature) return false;

    // Ignore possible replay attack.
    if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 60 * 5) return false;

    const base = `v0:${timestamp}:${(req as any).rawBody}`;
    const hash = `v0=${crypto.createHmac("sha256", config.slack.signingSecret).update(base, "utf8").digest("hex")}`;
    try {
        return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
    } catch {
        return false;
    }
}

// Middleware that verifies the Slack signature before the actual request.
export function slackAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!verifySlack(req)) return res.status(401).send("Bad signature");
    next();
}

export async function commandsHandler(req: express.Request, res: express.Response) {
    const { command, text = "", trigger_id, channel_id } = req.body;

    if (command != "/youtrack") return res.status(200).send("Unknown command");

    // Extract subcommand from the text
    const [sub, ...rest] = text.trim().split(/\s+/);
    const subcommand = (sub || "help").toLowerCase();

    if (subcommand == "help") {
        return res.status(200).send(
            "*YouTrack commands:*\n• `/youtrack create` — open a form to create an issue\n• `/youtrack help` — show this help"
        );
    }

    if (subcommand == "create") {
        // Ack immediately, then open modal
        res.status(200).send();
        await openModal(trigger_id, channel_id);
        return;
    }

    return res.status(200).send("Try `/youtrack help`");
}

export async function interactionsHandler(req: express.Request, res: express.Response,) {
    const payload = JSON.parse(req.body.payload);

    if (payload.type === "view_submission" && payload.view?.callback_id === "yt_create_issue") {
        const state = payload.view.state.values;

        const summary = state.summary_block.summary.value as string;
        const projectShortName = state.project_block.project.value as string;
        const meta = JSON.parse(payload.view.private_metadata || "{}");
        try {
            const projectId = await getProjectIdByShortName(projectShortName);
            await createYouTrackIssue(
                summary,
                projectId,
            );
            // Tell Slack to close the modal
            res.json({ response_action: "clear" });

            // Notify in the originating channel
            await sendEphemeral(meta.channel_id, payload.user.id,
                `Created issue: *${summary}*`);
        } catch (e: any) {
            return res.json({
                response_action: "errors",
                errors: { project_block: "Failed to create issue. Please try again." }
            });
        }
        return;
    }

    return res.status(200).send();
}
