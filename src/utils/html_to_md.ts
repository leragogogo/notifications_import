import TurndownService from "turndown";

/**
 * Slack accepts markdown text, YouTrack keeps content of notification as HTML.
 * This function converts HTML to markdown.
 * @param htmlText Text in HTML format.
 * @returns Converted markdown text.
 */
export function HTMLToMarkdown(htmlText: string): string {
    const turndownService = new TurndownService();
    return turndownService.turndown(htmlText);
}