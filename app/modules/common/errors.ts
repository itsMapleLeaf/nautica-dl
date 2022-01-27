export function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error))
}

export function getErrorStack(error: unknown): string {
  const { stack, message } = toError(error)
  return stack || message
}

export async function captureError<T>(promise: Promise<T>) {
  try {
    return { value: await promise, error: undefined }
  } catch (error) {
    return { value: undefined, error: toError(error) }
  }
}
