// utils/errorHandler.ts

export function handleError(error: unknown): { success: false; error: string } {
  if (error instanceof Error) {
    console.error("Error:", error); // You can add more logging here if needed
    return { success: false, error: error.message };
  } else {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
