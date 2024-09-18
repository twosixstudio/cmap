import { CreateTask } from "./_components/create-task/create-task";
import { TaskList } from "./_components/task-list/task-list";

export function ProjectTasks(props: { projectId: string }) {
  return (
    <div className="flex flex-col gap-10">
      <TaskList projectId={props.projectId} />
      <CreateTask projectId={props.projectId} />
    </div>
  );
}
