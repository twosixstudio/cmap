import { notFound } from "next/navigation";
import { getProject } from "~/server/api/test";

export default async function Page(props: { params: { slug: string } }) {
  const project = await getProject(props.params.slug);
  if (!project) notFound();
  return (
    <div className="mx-auto w-full max-w-4xl px-10 py-20">
      <h1 className="border-b pb-1 text-2xl font-bold">{project.name}</h1>
    </div>
  );
}
