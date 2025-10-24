import Database from "better-sqlite3";

/**
 * SQLiteCache provides a small local persistence state 
 * for notifications that have been passed to a messenger.
 * Therefore, the already transferred notifications 
 * won't be sent again to the messenger.
 */
export class SQLiteCache {
    private db: Database.Database;

    constructor(dbPath: string) {
        this.db = new Database(dbPath);
        this.ensureSchema();
    }

    close() {
        this.db.close();
    }

    // Create notifications table if it doesn't exist
    private ensureSchema() {
        this.db.exec(
            `CREATE TABLE IF NOT EXISTS notifications(
                notification_id TEXT PRIMARY KEY
            );`
        );
    }

    insertNotification(notificationId: string) {
        this.db.prepare(
            `INSERT OR IGNORE INTO notifications (notification_id)
            VALUES (?)
            `
        ).run(notificationId);
    }

    getNotificationId(notificationId: string): string | null {
        const row = this.db.prepare(
            `SELECT notification_id FROM notifications 
            WHERE notification_id = ?
            `
        ).get(notificationId) as { notification_id: string } | undefined;

        if (!row) return null;

        return row.notification_id;
    }
}