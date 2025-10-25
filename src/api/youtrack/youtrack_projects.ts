import { yt } from "./youtrack_config";

export async function getProjectIdByShortName(shortName: string) {
    const response = await yt.get("/admin/projects",
        {
            params: { fields: "id,shortName" },
        }
    );
    const projects = response.data as { id: string; shortName: string }[];

    // Find project id by short name 
    const matchedProject = projects.find(p => p.shortName === shortName);
    if (!matchedProject) throw new Error(`YouTrack project ${shortName} not found`);

    return matchedProject.id;
}