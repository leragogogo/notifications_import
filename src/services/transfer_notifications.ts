import { sendNotificationsToSlack } from "../api/slack/slack_notifications";
import { fetchYouTrackNotifications } from "../api/youtrack/youtrack_notifications";
import { SQLiteCache } from "../storage/sqlite_cache";
import { config } from "../utils/config";
import { decodeField } from "../utils/decode_field";
import { HTMLToMarkdown } from "../utils/html_to_md";

/**
 * Transfer YouTrack notifications to Slack channel.
 * The notifications that have been transferred won't appear again in the channel.
 * @param cache Local db to store already transferred notifications.
 */
export async function transferNotifications(cache: SQLiteCache) {
    const notifications = await fetchYouTrackNotifications();

    // Find notifications that weren't transferred yet
    const unknownNotifications = [];
    for (const notification of notifications) {
        console.log(notification.id)
        if (cache.getNotificationId(notification.id) == null) {
            unknownNotifications.push(notification);
        }
    }

    console.log(unknownNotifications);

    for (const notification of unknownNotifications) {
        // Decode content and transform it to markdown
        const markdownContent = HTMLToMarkdown(decodeField(notification.content));
        await sendNotificationsToSlack(config.slack.channel, markdownContent);
        cache.insertNotification(notification.id);
    }

}