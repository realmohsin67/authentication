/**
 * Utility function to extract a readable error message from various error types.
 * @param error - The error object or message to extract the message from.
 * @returns A string containing the error message.
 */

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === "string") {
    return error;
  } else if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "An unknown error occurred";
}
