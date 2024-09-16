import { ProjectCreate } from "./_components/project-create/project-create";
import { ProjectList } from "./_components/project-list/project-list";

export default async function Page() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-10 py-20">
      <ProjectList />
      <ProjectCreate />
    </div>
  );
}
