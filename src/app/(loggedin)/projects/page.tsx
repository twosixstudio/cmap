import { getUsers } from "~/server/api/test";
import { ProjectCreate } from "./_components/project-create/project-create";
import { ProjectList } from "./_components/project-list/project-list";

export default async function Page() {
  const users = await getUsers();
  return (
    <div>
      <pre>{JSON.stringify(users, null, 2)}</pre>
      <ProjectCreate />
      <ProjectList />
    </div>
  );
}
