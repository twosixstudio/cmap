import { notFound } from "next/navigation";
import { getProject, getUsers } from "~/server/api/test";
import { InviteUsers } from "./_components/invite-users/invite-users";
import { auth } from "@/auth";
import { CreateTask } from "./_components/create-task/create-task";

export default async function Page(props: { params: { slug: string } }) {
  const session = await auth();
  const users = await getUsers();
  const project = await getProject(props.params.slug);
  if (!project) notFound();
  if (!session) return null;
  const owners = project.users.filter((x) => x.role === "owner");
  const amOwner = !!owners
    .map((y) => y.userId)
    .find((x) => x.includes(session.user.id));

  return (
    <div className="mx-auto w-full max-w-4xl px-10 py-20">
      <h1 className="border-b pb-1 text-2xl font-bold">{project.name}</h1>
      <h2 className="font-bold">Tasks</h2>
      {project.tasks.map((x) => (
        <div key={x.id}>{x.name}</div>
      ))}
      <CreateTask projectId={project.id} />
      {amOwner && <InviteUsers users={users} project={project} />}
    </div>
  );
}
