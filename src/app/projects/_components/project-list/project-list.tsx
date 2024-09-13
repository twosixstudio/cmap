import { getThing } from "~/server/api/test";
import { Wrapper } from "./_ui";
import { ProjectListItem } from "./_components/project-list-item/project-list-item";

export async function ProjectList() {
  const data = await getThing();
  return (
    <Wrapper>
      {data?.[0]?.projects.map(({ project }) => (
        <ProjectListItem key={project.id} {...project} />
      ))}
    </Wrapper>
  );
}
