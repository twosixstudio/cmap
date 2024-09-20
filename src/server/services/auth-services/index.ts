import { auth } from "@/auth";
import type { Session } from "next-auth";
import { CustomError } from "~/server/types";

export async function requireAuth(): Promise<Session> {
  const session = await auth();
  if (!session) {
    throw new CustomError("User authentication failed.", 401);
  }
  return session;
}
