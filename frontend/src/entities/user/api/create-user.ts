import { apiRequest } from '@shared/api'
import type { CreateUserPayload, User } from '../model/types'

export function createUser(payload: CreateUserPayload): Promise<User> {
  return apiRequest<User>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
