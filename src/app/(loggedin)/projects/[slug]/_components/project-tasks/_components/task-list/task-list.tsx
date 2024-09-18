import { TaskTable } from "~/app/(loggedin)/_components/task-table/task-table";
import { getTasksForProject } from "~/server/services/task-services";

export async function TaskList(props: { projectId: string }) {
  const tasks = await getTasksForProject(props.projectId);
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold">Tasks</h2>
      <TaskTable tasks={tasks} />
    </div>
  );
}
