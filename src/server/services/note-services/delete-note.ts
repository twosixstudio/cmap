"use server";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { notes } from "~/server/db/schema";
import type { ServerReponse } from "~/server/types";
import { handleError } from "~/utils/handle-error";

export async function deleteNote(
  noteId: string,
): Promise<ServerReponse<{ message: string }>> {
  try {
    await db.delete(notes).where(eq(notes.id, noteId));
    return { success: true, data: { message: "Note deleted" } };
  } catch (error) {
    return handleError(error);
  }
}
