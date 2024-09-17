import { ProjectCreate } from "./_components/project-create/project-create";
import { ProjectList } from "./_components/project-list/project-list";

export default async function Page() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-10 py-20">
      <h1 className="text-2xl font-bold">Projects</h1>
      <ProjectList />
      <ProjectCreate />
    </div>
  );
}
