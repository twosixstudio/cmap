import { ProjectCreate } from "./_components/project-create/project-create";
import { ProjectList } from "./_components/project-list/project-list";

export default async function Page() {
  return (
    <div>
      <ProjectCreate />
      <ProjectList />
    </div>
  );
}
