import { notFound } from "next/navigation";
import { getProject } from "~/server/services/project-services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/ui/tabs";
import { ProjectSettings } from "./_components/project-settings/project-settings";
import { ProjectTasks } from "./_components/project-tasks/project-tasks";

export default async function Page(props: { params: { slug: string } }) {
  const { data: project, success } = await getProject(props.params.slug);
  if (!success) return notFound();
  if (!project) notFound();

  const TABS = [
    { name: "Tasks", component: <ProjectTasks projectId={project.id} /> },
    { name: "Settings", component: <ProjectSettings projectId={project.id} /> },
  ];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-10 py-20">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <Tabs
        defaultValue={TABS[0]?.name}
        className="flex flex-col items-start gap-6"
      >
        <TabsList>
          {TABS.map((x) => (
            <TabsTrigger key={x.name} value={x.name}>
              {x.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((x) => {
          return (
            <TabsContent className="w-full" key={x.name} value={x.name}>
              {x.component}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
