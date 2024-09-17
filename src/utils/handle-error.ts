// utils/errorHandler.ts

export function handleError(error: unknown): {
  success: false;
  data: { error: string };
} {
  if (error instanceof Error) {
    console.error("Error:", error); // You can add more logging here if needed
    return { success: false, data: { error: error.message } };
  } else {
    console.error("Unexpected error:", error);
    return { success: false, data: { error: "An unexpected error occurred." } };
  }
}
