import { Wrapper } from "./_ui";
import { ProjectListItem } from "./_components/project-list-item/project-list-item";
import { getThing } from "~/server/api/test";

export async function ProjectList() {
  const data = await getThing();
  return (
    <Wrapper>
      {data?.[0]?.projects.map(({ role, project }) => (
        <ProjectListItem key={project.id} {...project} role={role} />
      ))}
    </Wrapper>
  );
}
