"use server";
import { db } from "../db";

export async function getUsers() {
  return await db.query.users.findMany();
}
