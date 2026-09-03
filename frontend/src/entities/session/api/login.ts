import { apiRequest } from '@shared/api'
import type { User } from '@entities/user'

export interface LoginPayload {
  identifier: string
  password: string
}

export function login(payload: LoginPayload): Promise<User> {
  return apiRequest<User>('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
}
