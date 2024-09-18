import { ProjectDelete } from "./_components/project-delete/project-delete";

export function ProjectSettings(props: { projectId: string }) {
  return (
    <div>
      <ProjectDelete projectId={props.projectId} />
    </div>
  );
}
