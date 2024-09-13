"use server";

import { createProject } from ".";
import { getServerAuthSession } from "../auth";

export async function createProjectAction() {
  const session = await getServerAuthSession();
  console.log(session);
  if (!session) return Error("Unauthorized");
  await createProject("test", session?.user.id);
}
