import { isApiError, messageFromErrorBody } from '@/shared/api/api-error'

export function formatApiError(error: unknown, fallback: string): string {
  if (isApiError(error)) {
    if (error.message.length > 0) {
      return error.message
    }
    return messageFromErrorBody(error.body, fallback)
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }

  return fallback
}
