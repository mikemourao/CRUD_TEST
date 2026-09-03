import { apiRequest } from '@shared/api'
import type { UpdateUserPayload, User } from '../model/types'

export function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  return apiRequest<User>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
