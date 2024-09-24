"use server";

import { CustomError, type ServerReponse } from "~/server/types";
import { handleError } from "~/utils/handle-error";
import { requireAuth } from "../auth-services";
import { db } from "~/server/db";
import { notes } from "~/server/db/schema";

export async function createNote(props: {
  projectId: string;
  data: { title: string; content: string };
}): Promise<ServerReponse<{ message: string }>> {
  try {
    if (!props.data.content || !props.data.title)
      throw new CustomError("Data not provided", 500);

    const session = await requireAuth();

    await db
      .insert(notes)
      .values({
        ...props.data,
        userId: session.user.id,
        projectId: props.projectId,
      })
      .returning();

    return { success: true, data: { message: "Note created" } };
  } catch (error) {
    return handleError(error);
  }
}
