import { notFound } from "next/navigation";
import { getProject } from "~/server/services/project-services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/ui/tabs";
import { ProjectSettings } from "./_components/project-settings/project-settings";
import { ProjectTasks } from "./_components/project-tasks/project-tasks";

export default async function Page(props: { params: { slug: string } }) {
  const pro = await getProject(props.params.slug);
  if (!pro.success) return notFound();
  const project = pro.data;
  if (!project) notFound();

  const OWNER_TABS = [
    { name: "Tasks", component: <ProjectTasks projectId={project.id} /> },
    { name: "Settings", component: <ProjectSettings projectId={project.id} /> },
  ];

  const NON_OWNER_TABS = [
    { name: "Tasks", component: <ProjectTasks projectId={project.id} /> },
  ];

  const TABS = project.myRole === "owner" ? OWNER_TABS : NON_OWNER_TABS;

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
