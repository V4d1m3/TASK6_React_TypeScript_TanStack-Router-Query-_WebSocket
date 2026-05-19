import { httpClient } from '@/shared/api/http-client'
import type { LoginPayload, LoginResponse } from '@/entities/dummy-json/model/types'

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  return httpClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: {
      username: payload.username,
      password: payload.password,
      expiresInMins: payload.expiresInMins ?? 60,
    },
  })
}
