import { ProjectCreate } from "./_components/project-create/project-create";
import { ProjectList } from "./_components/project-list/project-list";

export default async function Page() {
  return (
    <div className="flex flex-col gap-4 py-20">
      <ProjectList />
      <ProjectCreate />
    </div>
  );
}
