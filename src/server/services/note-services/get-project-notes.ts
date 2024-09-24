"use server";

import { db } from "~/server/db";
import type { Note, ServerReponse } from "~/server/types";
import { requireAuth } from "../auth-services";
import { handleError } from "~/utils/handle-error";

export async function getProjectNotes(props: {
  projectId: string;
}): Promise<ServerReponse<Note[]>> {
  try {
    await requireAuth();

    const res = await db.query.notes.findMany({
      where: (table, fn) => fn.eq(table.projectId, props.projectId),
    });

    return { success: true, data: res };
  } catch (error) {
    return handleError(error);
  }
}
