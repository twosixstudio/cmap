import { getMyTasks } from "~/server/services/task-services";
import { TaskTable } from "../_components/task-table/task-table";

export default async function Page() {
  const tasks = await getMyTasks();
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-10 py-20">
      <h1 className="text-2xl font-bold">My Tasks</h1>
      <TaskTable tasks={tasks} />
    </div>
  );
}
