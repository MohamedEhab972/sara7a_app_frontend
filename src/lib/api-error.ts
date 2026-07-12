export class ApiError extends Error {
  readonly statusCode: number;
  readonly extra: unknown;

  constructor(message: string, statusCode: number, extra: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.extra = extra;
  }
}

export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  return err instanceof Error ? err.message : fallback;
}
