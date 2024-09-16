import { notFound } from "next/navigation";
import { InviteUsers } from "./_components/invite-users/invite-users";
import { auth } from "@/auth";
import { CreateTask } from "./_components/create-task/create-task";
import { TaskList } from "./_components/task-list/task-list";
import { ProjectDelete } from "./_components/project-delete/project-delete";
import { getProject } from "~/server/services/project-services";
import { getUsers } from "~/server/services/user-services";

export default async function Page(props: { params: { slug: string } }) {
  const session = await auth();
  const users = await getUsers();
  const project = await getProject(props.params.slug);
  if (!project) notFound();
  if (!session) return null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-10 py-20">
      <h1 className="border-b pb-1 text-2xl font-bold">{project.name}</h1>
      <ProjectDelete projectId={project.id} />
      <TaskList projectId={project.id} />
      <CreateTask projectId={project.id} />
      {project.amOwner && <InviteUsers users={users} project={project} />}
    </div>
  );
}
