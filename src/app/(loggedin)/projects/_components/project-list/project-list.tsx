import { ProjectTable } from "./_components/project-table/project-table";
import { getProjectsWithUsers } from "~/server/services/project-services";

export async function ProjectList() {
  const data = await getProjectsWithUsers();
  if (!data) return null;
  return <ProjectTable projects={data} />;
}
