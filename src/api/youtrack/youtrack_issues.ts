import { yt } from "./youtrack_config";

export async function createYouTrackIssue(summary: string, projectId: string) {
    const response = await yt.post("/issues", {
        summary: summary,
        project: {
            id: projectId,
        }
    });
    return response;
}