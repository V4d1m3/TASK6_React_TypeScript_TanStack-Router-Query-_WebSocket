import { env } from '@/shared/config/env'
import {
  ApiError,
  messageFromErrorBody,
} from '@/shared/api/api-error'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
}

async function readResponseText(response: Response): Promise<string> {
  try {
    return await response.text()
  } catch {
    return ''
  }
}

function parseJsonBody<T>(text: string, status: number): T {
  if (!text.trim()) {
    throw new ApiError('Empty response body', status, null)
  }

  try {
    return JSON.parse(text) as T
  } catch {
    throw new ApiError('Invalid JSON in response', status, text)
  }
}

export async function httpClient<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { method = 'GET', body, headers, signal } = options

  let response: Response

  try {
    response = await fetch(`${env.dummyJsonBaseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : 'Network request failed'
    throw new ApiError(message, 0, cause)
  }

  const text = await readResponseText(response)

  if (!response.ok) {
    let errorBody: unknown = null
    if (text.trim()) {
      try {
        errorBody = JSON.parse(text) as unknown
      } catch {
        errorBody = text
      }
    }

    const fallback = `HTTP ${response.status}: ${response.statusText}`
    throw new ApiError(
      messageFromErrorBody(errorBody, fallback),
      response.status,
      errorBody,
    )
  }

  return parseJsonBody<TResponse>(text, response.status)
}
