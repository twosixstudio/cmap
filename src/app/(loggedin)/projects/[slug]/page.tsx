import { notFound } from "next/navigation";
import { getProject, getUsers } from "~/server/api/test";
import { InviteUsers } from "./_components/invite-users/invite-users";
import { auth } from "@/auth";

export default async function Page(props: { params: { slug: string } }) {
  const project = await getProject(props.params.slug);
  const users = await getUsers();
  if (!project) notFound();
  const owners = project.users.filter((x) => x.role === "owner");
  const session = await auth();
  const amOwner = !!owners
    .map((y) => y.userId)
    .find((x) => x.includes(session?.user.id));

  return (
    <div className="mx-auto w-full max-w-4xl px-10 py-20">
      <h1 className="border-b pb-1 text-2xl font-bold">{project.name}</h1>
      {amOwner && <InviteUsers users={users} project={project} />}
    </div>
  );
}
