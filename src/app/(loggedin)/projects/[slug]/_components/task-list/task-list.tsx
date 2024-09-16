import { getProjectTasks } from "~/server/api/test";
import { TaskTable } from "./_components/task-table/task-table";

export async function TaskList(props: { projectId: string }) {
  const tasks = await getProjectTasks(props.projectId);
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold">Tasks</h2>
      <TaskTable tasks={tasks} />
    </div>
  );
}
