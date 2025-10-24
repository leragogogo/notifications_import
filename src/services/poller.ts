import { SQLiteCache } from "../storage/sqlite_cache";

interface PollerArgs {
    intervalMs: number,
};

/**
 * Controlled loop over sending notifications job.
 * It waits for each poll to finish before starting the next one,
 * retries if an error happens and allows to stop polling.
 * @param job function, that sends notifications from YouTrack to Slack
 * @param args arguments for poller
 */
export function startPoller(job: (cache: SQLiteCache) => Promise<void>, cache: SQLiteCache, args: PollerArgs) {
    // Prevents overlaps
    let running: boolean = false;

    // Allows to stop
    let stopped: boolean = false;

    // Acheduled job 
    let timer: NodeJS.Timeout | null = null;

    const schedule = (delay: number) => {
        if (stopped) return;
        if (timer) clearTimeout(timer);
        timer = setTimeout(tick, delay);
    }

    const tick = async () => {
        if (running || stopped) return;
        running = true;
        try {
            // Send the notifications
            await job(cache);
            // Schedule next poll
            schedule(args.intervalMs);
        } catch (e) {
            console.log(`Poll error: ${e}`)
            // Retry to schedule the job
            schedule(args.intervalMs);
        }
        finally {
            running = false;
        }
    }

    schedule(0);

    // Return a stop function.
    return () => {
        stopped = true;
        if (timer) clearTimeout(timer);
    }
}
