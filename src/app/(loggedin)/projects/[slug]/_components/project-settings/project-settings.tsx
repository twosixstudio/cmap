import { ProjectDelete } from "./_components/project-delete/project-delete";

export function ProjectSettings(props: { projectId: string }) {
  return <ProjectDelete projectId={props.projectId} />;
}
