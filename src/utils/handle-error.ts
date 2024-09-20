// utils/errorHandler.ts

import { CustomError, type ServerError } from "~/server/types";

export function handleError(error: unknown): ServerError {
  console.log(error);
  if (error instanceof CustomError) {
    // If it's already a CustomError, return it directly
    return { error: { message: error.message }, success: false };
  }

  if (error instanceof Error) {
    // Convert a generic Error to a CustomError
    return { error: { message: error.message }, success: false };
  }

  // If the error is of an unknown type, handle it as an unexpected error
  return { error: { message: "Unknown error occurred" }, success: false };
}
