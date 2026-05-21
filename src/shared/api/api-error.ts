export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(message: string, status: number, body: unknown = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function messageFromErrorBody(body: unknown, fallback: string): string {
  if (typeof body === 'string' && body.length > 0) {
    return body
  }

  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message
    if (typeof message === 'string' && message.length > 0) {
      return message
    }
  }

  return fallback
}
